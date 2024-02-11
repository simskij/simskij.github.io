---
title: Building a Charm
---
### Relations

Relations solve [[Service Discovery]] and allows the charms to instruct each other on how to connect to each other. The relations are loosely typed and, at runtime, only enforced through relation interfaces.

To relate two apps, we execute:

```
$ juju relate avalanche prometheus
```

Once the relation has been established, juju emits the event `relation_joined`.

#### Data Bags
![[Charm Data Relation.png]]

When the data of a data bag changes, a `relation_changed` event will be fired, triggering the other side of the relation to act on the changes if needed.

### Libraries
Libraries provide actions for other charms to use to make sure they consume capabilities of  you charm in a predictable, and intended, way. For instance:

[[old/10 Concepts/Prometheus]] is able to scrape metric endpoints of other charms. To simplify this, we expose a `prometheus_scrape` function as a library. [[Nginx]], in turn, wants to send off metrics to Prometheus, so it imports the library and uses the scrape function.

Success all around! :tada: