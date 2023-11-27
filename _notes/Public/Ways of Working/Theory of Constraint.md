---
title: Theory of Constraint
---


The theory of constraints describes a workflow of how to work with constraints to increase the overall efficiency of a system. The theory was originally described by [[Elijahu M Goldratt]] in the book [[The Goal]], and then further elaborated upon in the context of [[Technology]] and [[DevOps]] by [[Gene Kim]] in [[The Phoenix Project]].

The workflow described is divided into five separate steps:

- [[#Identify]]
- [[#Exploit]]
- [[#Subordinate]]
- [[#Elevate]]
- [[#Repeat]]

By using the workflow below, the idea is to gain additional understanding about a system's weaknesses and where time is best spent to further increase its efficiency. Ideas like [[Optimizations should be made at the bottleneck]] origin from this theory.

```

.-> Identify -> Exploit -> Subordinate -> Elevate -.
'--------------------- Repeat ---------------------'
```

## Steps

### Identify

- What needs to be changed?
- What should it be changed to?
- What will cause the change?

### Exploit

- Create a buffer to avoid running out of work
- Check quality before reaching the constraint
- Ensure continuous operation
- Move maintenance outside of production time
- Offload, either internally or externally

### Subordinate
- Upstream
- Downstream

Synchronize to the constraint capacity

### Elevate

- Performance Data
- Top Losses
- Reviews
- Setup Reduction
- Updates/Upgrades
- Equipment

### Repeat

- Constraint has been broken: Find and eliminate the new constraint.
- Constraint has not been broken: Run the process again with fresh eyes.


## Related
- [[Lean]]
- [[The Three Ways of DevOps]]
- [[The Four Types of Work]]