---
title: 'Setting up a kubernetes lab cluster'
---

_This article assumes some experience with containers in general, using for instance docker, as well as a basic understanding of what Kubernetes is and what kind of problems it aims to solve._

## Introduction

`k3s` is a lightweight Kubernetes distribution. It’s been validated by the CNCF as a true Kubernetes distribution, making it a viable option to running the full, original Kubernetes project, especially for labs or dev environments.

What would then be the perks of running k3s over k8s? Well, k8s is designed with really high availability and scalability in mind.

After all, it’s built by Google to support workloads at their scale of operation. If you read some of the best practices on how to design your clusters, you’ll soon realize that it takes **a lot** of machines just to get started.

Some common best practices include

- separating the nodes and the controller plane leaders
- scaling out etcd to multiple nodes - or even its own cluster, as well as
- separating ingress nodes from regular work nodes to make sure they stay snappy for incoming requests.

While all of this is sound advice, setting up such an architecture could easily have you end up with 2-3 leader instances, 2-3 etcd servers, 1-2 ingress servers. That’s 5 servers in the best case, but more likely 6 or 7. This might feel like overkill for a lab or dev environment, and certainly not feasible for most local labs.

This is where k3s really shines!

- It consists of one binary of less than 50MB!
- As it is a CNCF certified distribution, it is fully compliant to the more complete, full k8s.
- Instead of using `etcd`, it uses an embedded `SQLite` database, which is fully sufficient for most local or lab use cases, although not suitable for HA environments.

## Creating our virtual machines

As I’m running on macOS, the first thing we need to do is to create a Linux VM capable of running k3s. This can be done easily using [multipass](https://multipass.run/), a command-line tool for fast and simple orchestration of Ubuntu VMs.

<img src="/images/multi-pass.gif" alt="multipass" width="100%" />

Let’s create a leader and two nodes:

```
$ multipass launch \
    --name k3s \
    --cpus 4 \
    --mem 4g \
    --disk 20g

Launched: k3s

$ multipass launch \
    --name k3s-node1 \
    --cpus 1 \
    --mem 1024M \
    --disk 3G

Launched: k3s-node1

$ multipass launch \
    --name k3s-node2 \
    --cpus 1 \
    --mem 1024M \
    --disk 3G

Launched: k3s-node2

```

### Installing k3s

Installation is simple, and if we where installing k3s directly on our machine, we’d get away with just piping the install script to `sh` like this:

```
$ curl -sfL https://get.k3s.io | sh -

```

However, as we’re going to be running k3s in multiple virtual machines using multipass, we need to take a somewhat different approach:

```
$ multipass exec k3s -- bash -c \
    "curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" sh -"

[INFO] Finding release for channel stable
[INFO] Using v1.18.8+k3s1 as release
[INFO] Downloading hash https://github.com/rancher/k3s/releases/download/v1.18.8+k3s1/sha256sum-amd64.txt
[INFO] Downloading binary https://github.com/rancher/k3s/releases/download/v1.18.8+k3s1/k3s
[INFO] Verifying binary download
[INFO] Installing k3s to /usr/local/bin/k3s
[INFO] Creating /usr/local/bin/kubectl symlink to k3s
[INFO] Creating /usr/local/bin/crictl symlink to k3s
[INFO] Creating /usr/local/bin/ctr symlink to k3s
[INFO] Creating killall script /usr/local/bin/k3s-killall.sh
[INFO] Creating uninstall script /usr/local/bin/k3s-uninstall.sh
[INFO] env: Creating environment file /etc/systemd/system/k3s.service.env
[INFO] systemd: Creating service file /etc/systemd/system/k3s.service
[INFO] systemd: Enabling k3s unit
Created symlink /etc/systemd/system/multi-user.target.wants/k3s.service → /etc/systemd/system/k3s.service.
[INFO] systemd: Starting k3s

$ export K3S_LEAD_URL="https://$(multipass info k3s | grep "IPv4" | awk -F' ' '{print $2}'):6443"
$ export \
    K3S_TOKEN="$(multipass exec k3s -- /bin/bash -c "sudo cat /var/lib/rancher/k3s/server/node-token")"

```

With that, our leader is created and the leader URL as well as the node token has been exported to variables. Let’s set up our nodes and add them to the cluster.

```
$ multipass exec \
    k3s-node1 \
    -- /bin/bash -c \
    "curl -sfL https://get.k3s.io | K3S_TOKEN=${K3S_TOKEN} K3S_URL=${K3S_LEAD_URL} sh -"

[INFO] Finding release for channel stable
[INFO] Using v1.18.8+k3s1 as release
[INFO] Downloading hash https://github.com/rancher/k3s/releases/download/v1.18.8+k3s1/sha256sum-amd64.txt
[INFO] Downloading binary https://github.com/rancher/k3s/releases/download/v1.18.8+k3s1/k3s
[INFO] Verifying binary download
[INFO] Installing k3s to /usr/local/bin/k3s
[INFO] Creating /usr/local/bin/kubectl symlink to k3s
[INFO] Creating /usr/local/bin/crictl symlink to k3s
[INFO] Creating /usr/local/bin/ctr symlink to k3s
[INFO] Creating killall script /usr/local/bin/k3s-killall.sh
[INFO] Creating uninstall script /usr/local/bin/k3s-agent-uninstall.sh
[INFO] env: Creating environment file /etc/systemd/system/k3s-agent.service.env
[INFO] systemd: Creating service file /etc/systemd/system/k3s-agent.service
[INFO] systemd: Enabling k3s-agent unit
Created symlink /etc/systemd/system/multi-user.target.wants/k3s-agent.service
  → /etc/systemd/system/k3s-agent.service.
[INFO] systemd: Starting k3s-agent


$ multipass exec \
    k3s-node2 \
    -- /bin/bash -c \
    "curl -sfL https://get.k3s.io | K3S_TOKEN=${K3S_TOKEN} K3S_URL=${K3S_LEAD_URL} sh -"

[INFO] Finding release for channel stable
[INFO] Using v1.18.8+k3s1 as release
[INFO] Downloading hash https://github.com/rancher/k3s/releases/download/v1.18.8+k3s1/sha256sum-amd64.txt
[INFO] Downloading binary https://github.com/rancher/k3s/releases/download/v1.18.8+k3s1/k3s
[INFO] Verifying binary download
[INFO] Installing k3s to /usr/local/bin/k3s
[INFO] Creating /usr/local/bin/kubectl symlink to k3s
[INFO] Creating /usr/local/bin/crictl symlink to k3s
[INFO] Creating /usr/local/bin/ctr symlink to k3s
[INFO] Creating killall script /usr/local/bin/k3s-killall.sh
[INFO] Creating uninstall script /usr/local/bin/k3s-agent-uninstall.sh
[INFO] env: Creating environment file /etc/systemd/system/k3s-agent.service.env
[INFO] systemd: Creating service file /etc/systemd/system/k3s-agent.service
[INFO] systemd: Enabling k3s-agent unit
Created symlink /etc/systemd/system/multi-user.target.wants/k3s-agent.service
  → /etc/systemd/system/k3s-agent.service.
[INFO] systemd: Starting k3s-agent

```

As the last step, we need to copy the `kubeconfig` file created during setup to our local machine so that we’ll be able to access the cluster from our local machine.

```
$ multipass exec k3s \
    -- /bin/bash -c \
    "sudo cat /etc/rancher/k3s/k3s.yaml" \
    > k3s.yaml

```

The kubeconfig file will contain a lot of references to localhost, so we also need to switch those to our leader IP.

```
$ sed -i '' "s/127.0.0.1/$(multipass info k3s | grep IPv4 | awk '{print $2}')/" k3s.yaml

```

Let’s install kubectl locally and move our config file to the right location. If you’re not using macOS, you will need to switch this to the appropriate command for your platform.

```
$ brew install kubectl
$ cp k3s.yaml ~/.kube/config

```

Let’s try a couple of commands to make sure everything works.

```
$ kubectl get nodes

NAME      STATUS ROLES  AGE VERSION
k3s       Ready  master 28m v1.18.8+k3s1
k3s-node2 Ready  <none> 18m v1.18.8+k3s1
k3s-node1 Ready  <none> 26m v1.18.8+k3s1

$ kubectl get pods --all-namespaces

NAMESPACE   NAME                                   READY STATUS    RESTARTS AGE
kube-system metrics-server-7566d596c8-2n65k        1/1   Running   0        29m
kube-system local-path-provisioner-6d59f47c7-z4625 1/1   Running   0        29m
kube-system helm-install-traefik-j26f7             0/1   Completed 0        29m
kube-system coredns-7944c66d8d-gc2r4               1/1   Running   0        29m
kube-system svclb-traefik-f7lrp                    2/2   Running   0        28m
kube-system traefik-758cd5fc85-9zmpq               1/1   Running   0        28m
kube-system svclb-traefik-rrpz4                    2/2   Running   0        27m
kube-system svclb-traefik-cg6s8                    2/2   Running   0        18m

```

If your output looks somewhat along the lines of this, then awesome! Our lab environment is now ready and we should be able to use it just as we would with any Kubernetes cluster.

## Conclusion

In this article, we’ve gone through how to deploy a local Kubernetes lab cluster on our local computer using the incredibly lightweight k3s. We’ve also added two nodes to our new cluster.

Next time, we’ll explore how to do a deployment, how to set up `metallb` for external IP provisioning, as well as how to use load balancing services to allow access to our deployed pods.
