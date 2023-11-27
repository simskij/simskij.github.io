---
title: Running distributed k6 tests on Kubernetes
canonical_url: https://k6.io/blog/running-distributed-tests-on-k8s
---

One of the questions we often get in the forum is how to run distributed k6 tests on your own infrastructure. While we believe that [running large load tests](https://k6.io/docs/testing-guides/running-large-tests) is possible even when running on a single node, we do appreciate that this is something some of our users might want to do.

<!--more-->

> ### 📖What you will learn
> 
> - What the operator pattern is and when it is useful
> - Deploying the k6 operator in your kubernetes cluster
> - Running a distributed k6 test in your own cluster

> #### ⚠️ Experimental
> 
> The project used in this article is experimental and changes a lot between commits. Use at your own discretion .

  

[![operator](https://k6.io/blog/static/49d58b70df40a0fa1aa75dd1f6d1f670/7842b/operator.png "operator")](/blog/static/49d58b70df40a0fa1aa75dd1f6d1f670/acdd1/operator.png)

## Introduction

There are at least a couple of reasons why you would want to do this:

- You run everything else in Kubernetes and would like k6 to be executed in the same fashion as all your other infrastructure components. 

- You have access to a couple of high-end nodes and want to pool their resources into a large-scale stress test.

- You have access to multiple low-end or highly utilized nodes and need to pool their resources to be able to reach your target VU count or Requests per Second (RPS).

## Prerequisites

To be able to follow along in this guide, you’ll need access to a Kubernetes cluster, with enough privileges to apply objects.

You’ll also need:

- [Kustomize](https://github.com/kubernetes-sigs/kustomize/)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [Make](https://www.gnu.org/software/make/)

## The Kubernetes Operator pattern

The [operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) is a way of extending Kubernetes so that you may use [custom resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) to manage applications running in the cluster. The pattern aims to automate the tasks that a human operator would usually do, like provisioning new application components, changing the configuration, or resolving problems that occur.

This is accomplished using custom resources which, for the scope of this article, could be compared to the traditional service requests that you would file to your system operator to get changes applied to the environment.

  
  
  

[![operator pattern](https://k6.io/blog/static/8bc25b5fb3de365092d17de6121c3280/7842b/pattern.png "operator pattern")](/blog/static/8bc25b5fb3de365092d17de6121c3280/d9c41/pattern.png)

The operator will listen for changes to, or creation of, K6 custom resource objects. Once a change is detected, it will react by modifying the cluster state, spinning up k6 test jobs as needed. It will then use the parallelism argument to figure out how to split the workload between the jobs using [execution segments](https://k6.io/docs/using-k6/options#execution-segment).

## Using the k6 operator to run a distributed load test in your Kubernetes cluster

We'll now go through the steps required to deploy, run, and clean up after the k6 operator.

### Cloning the repository

Before we get started, we need to clone the operator repository from GitHub and navigate to the repository root:

```
$ git clone https://github.com/k6io/operator && cd operator

```

### Deploying the operator

Deploying the operator is done by running the command below, with kubectl configured to use the context of the cluster that you want to deploy it to.

First, make sure you are using the right context:

```
$ kubectl config get-contexts

CURRENT NAME CLUSTER AUTHINFO NAMESPACE
* harley harley harley
          jean jean jean
          ripley ripley ripley

```

Then deploy the operator bundle using make. This will also apply the roles, namespaces, bindings and services needed to run the operator.

```
$ make deploy

/Users/simme/.go/bin/controller-gen "crd:trivialVersions=true" rbac:roleName=manager-role webhook paths="./..." output:crd:artifacts:config=config/crd/bases
cd config/manager && /Users/simme/.go/bin/kustomize edit set image controller=ghcr.io/k6io/operator:latest
/Users/simme/.go/bin/kustomize build config/default | kubectl apply -f -
namespace/k6-operator-system created
customresourcedefinition.apiextensions.k8s.io/k6s.k6.io created
role.rbac.authorization.k8s.io/k6-operator-leader-election-role created
clusterrole.rbac.authorization.k8s.io/k6-operator-manager-role created
clusterrole.rbac.authorization.k8s.io/k6-operator-proxy-role created
clusterrole.rbac.authorization.k8s.io/k6-operator-metrics-reader created
rolebinding.rbac.authorization.k8s.io/k6-operator-leader-election-rolebinding created
clusterrolebinding.rbac.authorization.k8s.io/k6-operator-manager-rolebinding created
clusterrolebinding.rbac.authorization.k8s.io/k6-operator-proxy-rolebinding created
service/k6-operator-controller-manager-metrics-service created
deployment.apps/k6-operator-controller-manager created

```

### Writing our test script

Once that is done, we need to create a config map containing the test script. For the operator to pick up our script, we need to name the file `test.js`. For this article, we’ll be using the test script below:

```
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { target: 200, duration: '30s' },
    { target: 0, duration: '30s' },
  ],
};

export default function () {
  const result = http.get('https://test-api.k6.io/public/crocodiles/');
  check(result, {
    'http response status code is 200': result.status === 200,
  });
}

```

Before we continue, we'll run the script once locally to make sure it works:

```
$ k6 run test.js

```

If you’ve never written a k6 test before, we recommend that you start by reading [this getting started article from the documentation](https://k6.io/docs/getting-started/running-k6), just to get a feel for how it works.

Let’s walk through this script and make sure we understand what is happening: We’ve set up two stages that will run for 30 seconds each. The first one will ramp up to linearly to 200 VUs over 30 seconds. The second one will ramp down to 0 again over 30 seconds.

In this case the operator will tell each test runner to run only a portion of the total VUs. For instance, if the script calls for 40 VUs, and `parallelism` is set to 4, the test runners would have 10 VUs each.

Each VU will then loop over the default function as many times as possible during the execution. It will execute an HTTP GET request against the URL we’ve configured, and make sure that the responds with HTTP Status 200. In a real test, we'd probably throw in a sleep here to emulate the think time of the user, but as the purpose of this article is to run a distributed test with as much throughput as possible, I've deliberately skipped it.

### Deploying our test script

Once the test script is done, we have to deploy it to the kubernetes cluster. We’ll use a `ConfigMap` to accomplish this. The name of the map can be whatever you like, but for this demo we'll go with `crocodile-stress-test`.

If you want more than one test script available in your cluster, you just repeat this process for each one, giving the maps different names.

```
$ kubectl create configmap crocodile-stress-test --from-file /path/to/our/test.js

configmap/crocodile-stress-test created

```

> #### ⚠️ Namespaces
> 
> For this to work, the k6 custom resource and the config map needs to be deployed in the same namespace.

Let’s have a look at the result:

```
$ kubectl describe configmap crocodile-stress-test

Name: crocodile-stress-test
Namespace: default
Labels: <none>
Annotations: <none>

Data
====
test.js:
----
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { target: 200, duration: '30s' },
    { target: 0, duration: '30s' },
  ],
};

export default function () {
  const result = http.get('https://test-api.k6.io/public/crocodiles/');
  check(result, {
    'http response status code is 200': result.status === 200,
  });
}

Events: <none>

```

The config map contains the content of our test file, labelled as test.js. The operator will later search through our config map for this key, and use its content as the test script.

### Creating our custom resource (CR)

To communicate with the operator, we’ll use a custom resource called `K6`. Custom resources behave just as native kubernetes objects, while being fully customizable. In this case, the data of the custom resource contains all the information necessary for k6 operator to be able to start a distributed load test:

```
apiVersion: k6.io/v1alpha1
kind: K6
metadata:
  name: k6-sample
spec:
  parallelism: 4
  script: crocodile-stress-test

```

For Kubernetes to know what to do with this custom resource, we first need to specify what API Version we want to use to interpret its content, in this case `k6.io/v1alpha1`. We’ll then set the kind to K6, and give our resource a name.

As the specification for our custom resource, we now have the option to use a couple of different properties:

#### Parallelism

Configures how many k6 test runner jobs the operator should spawn.

#### Script

The name of the config map containing our `script.js` file.

#### Separate

Whether the operator should allow multiple k6 jobs to run concurrently at the same node. The default value for this property is `false`, allowing each node to run multiple jobs.

#### Arguments

Allowing you to pass arguments to each k6 job, just as you would from the CLI. For instance `--tag testId=crocodile-stress-test-1`,`--out cloud`, or `—no-connection-reuse`.

### Deploying our Custom Resource

We will now deploy our custom resource using kubectl, and by that, start the test:

```
$ kubectl apply -f /path/to/our/k6/custom-resource.yml

k6.k6.io/k6-sample created

```

Once we do this, the k6 operator will pick up the changes and start the execution of the test. This looks somewhat along the lines of what is shown in this diagram:

  
  

[![k6 pattern](https://k6.io/blog/static/8c12a4c120f2f4feed3d7284df4be089/14945/pattern-k6.png "k6 pattern")](/blog/static/8c12a4c120f2f4feed3d7284df4be089/14945/pattern-k6.png)

  
  

Let’s make sure everything went as expected:

```
$ kubectl get k6 

NAME AGE
k6-sample 2s

$ kubectl get jobs

NAME COMPLETIONS DURATION AGE
k6-sample-1 0/1 12s 12s
k6-sample-2 0/1 12s 12s
k6-sample-3 0/1 12s 12s
k6-sample-4 0/1 12s 12s

$ kubectl get pods
NAME READY STATUS RESTARTS AGE
k6-sample-3-s7hdk 1/1 Running 0 20s
k6-sample-4-thnpw 1/1 Running 0 20s
k6-sample-2-f9bbj 1/1 Running 0 20s
k6-sample-1-f7ktl 1/1 Running 0 20s

```

The pods have now been created and put in a paused state until the operator has made sure they’re all ready to execute the test. Once that’s the case, the operator deploys another job, k6-sample-starter which is responsible for making sure all our runners start execution at the same time.

Let’s wait a couple of seconds and then list our pods again:

```
$ kubectl get pods

NAME READY STATUS RESTARTS AGE
k6-sample-3-s7hdk 1/1 Running 0 76s
k6-sample-4-thnpw 1/1 Running 0 76s
k6-sample-2-f9bbj 1/1 Running 0 76s
k6-sample-1-f7ktl 1/1 Running 0 76s
k6-sample-starter-scw59 0/1 Completed 0 56s

```

All right! The starter has completed and our tests are hopefully running. To make sure, we may check the logs of one of the jobs:

```
$ kubectl logs k6-sample-1-f7ktl

[...]

Run [100%] paused
default [0%]

Run [100%] paused
default [0%]

running (0m00.7s), 02/50 VUs, 0 complete and 0 interrupted iterations
default [1%] 02/50 VUs 0m00.7s/1m00.0s

running (0m01.7s), 03/50 VUs, 13 complete and 0 interrupted iterations
default [3%] 03/50 VUs 0m01.7s/1m00.0s

running (0m02.7s), 05/50 VUs, 41 complete and 0 interrupted iterations
default [4%] 05/50 VUs 0m02.7s/1m00.0s

[...]

```

And with that, our test is running! 🎉 After a couple of minutes, we’re now able to list the jobs again to verify they’ve all completed:

```
$ kubectl get jobs

NAME COMPLETIONS DURATION AGE
k6-sample-starter 1/1 8s 6m2s
k6-sample-3 1/1 96s 6m22s
k6-sample-2 1/1 96s 6m22s
k6-sample-1 1/1 97s 6m22s
k6-sample-4 1/1 97s 6m22s

```

### Cleaning up

To clean up after a test run, we delete all resources using the same yaml file we used to deploy it:

```
$ kubectl delete -f /path/to/our/k6/custom-resource.yml

k6.k6.io "k6-sample" deleted

```

Which deletes all the resources created by the operator as well, as shown below:

```
$ kubectl get jobs
No resources found in default namespace.

$ kubectl get pods
No resources found in default namespace.

```

> #### ⚠️ Deleting the operator
> 
> If you for some reason would like to delete the operator altogether, just run make delete from the root of the project..
> 
> The idea behind the operator however, is that you let it remain in your cluster between test executions, only applying and deleting the actual K6 custom resources used to run the tests.

## Things to consider

While the operator makes running distributed load tests a lot easier, it still comes with a couple of drawbacks or gotchas that you need to be aware of and plan for. For instance, the lack of metric aggregation.

We’ll go through in detail how to set up the monitoring and visualisation of these test runs in a future article, but for now, here’s a list of things you might want to consider:

### Metrics will not be automatically aggregated

Metrics generated by running distributed k6 tests using the operator won’t be aggregated, which means that each test runner will produce its own results and end-of-test summary.

**To be able to aggregate your metrics and analyse them together, you’ll either need to:**

1) Set up some kind of monitoring or visualisation software and configure your K6 custom resource to make your jobs output there.

2) Use [logstash](https://github.com/elastic/logstash), [fluentd](https://github.com/fluent/fluentd), splunk, or similar to parse and aggregate the logs yourself.

### Thresholds are not evaluated across jobs at runtime

As the metrics are not aggregated at runtime, your thresholds won’t be evaluated using aggregation either. Currently, the best way to solve this is by setting up alarms for passed thresholds in your monitoring or visualisation software instead.

### Overpopulated nodes might create bottlenecks

You want to make sure your k6 jobs have enough cpu and memory resources to actually perform your test. Using parallelism alone might not be sufficient. If you run into this issue, experiment with using the separate property.

### Experimental

As mentioned in the beginning of the article, the operator _is_ experimental, and as such it might change a lot from commit to commit.

### Total cost of ownership

The k6 operator significantly simplifies the process of running distributed load tests in your own cluster. However, there still is a maintenance burden associated with self-hosting. If you'd rather skip that, as well as the other drawbacks listed above, and instead get straight to load testing, you might want to have a look at the [k6 cloud offering](https://k6.io/cloud).

## See also

- [The k6 operator project on GitHub](https://github.com/k6io/operator)