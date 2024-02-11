---
title: ArgoCD
---


ArgoCD is a [[Continuous Delivery]] tool for [[Kubernetes]], allowing you to declaratively define your workloads and have them be deployed automatically whenever they get pushed to your [[Version Control System]], ie [[GitOps]]. 

Quote from the [official documentation](https://argoproj.github.io/projects/argo-cd).

> Application definitions, configurations, and environments should be declarative and version controlled. Application deployment and lifecycle management should be automated, auditable, and easy to understand.

### Getting Started

1. Deploy ArgoCD in Kubernetes cluster
2. Change the default password for the administrator account to something safer
3. Log into ArgoCD and set up the repositories you want to sync from
4. Create app manifests using the `Application` kind available in the `argoproj.io/v1lalpha1` apiVersion. Set apps to autosync to have them autodeploy whenever their definitions in git are updated.
5. Apply `Application` manifests
6. Profit 🚀