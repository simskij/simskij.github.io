---
title: Juju
feed: show
---
Juju is an application management tool. It consists of Juju itself, the [[Ops Framework]], as well as a vast collection of [[Charms]]. 
### What is Juju?

In a way, it could be thought of as a tool combining concepts from tools for [[GitOps]] and [[Infrastructure as Code]] (like Argo and Terraform) with service and configuration management. In contrast to the mentioned tools, its usable on other infrastructure platforms than Kubernetes, like [[OpenStack]], and even Bare-metal.

### Characteristics

- Enables repeatability of complex workload deployments
- Encourages us to codify our operational knowledge into encapsulated, reusable components, or charms.
- Enables modelling of deployments and relationships
- Enables portability across different clouds, Kubernetes, as well as bare-metal.

### Benefits

- Saves time
- Reduces cost
- Introduces repeatability and predictability

### Thoughts

- [[Juju is model-first]]
- [[The open-source movement is shifting costs from license fees to operational costs]]
- [[Juju aims to excel at day 2 operations]]
### Concepts

- [[The Juju Model]]
- [[The Juju Lifecycle]]
- [[Charms]]
- [[Troubleshooting Juju]]
### Key Points

- [[The order of Juju Lifecycle events is not guaranteed]]
- [[In Juju, a cloud is whatever provides computing and storage resources]]

### Reference

- [📖 Removing things in Juju](https://juju.is/docs/olm/removing-things)
