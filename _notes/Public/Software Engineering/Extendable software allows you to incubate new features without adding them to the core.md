---
title: Extendable software allows you to incubate new features without adding them to the core
---
A typical problem while building software is where to draw the line for what should be included or not. Fringe functionality required for some use case might seem like stretching it, but may down the line prove to be the most valued functionality of what you're building.

At the same time, it might prove to be the complete opposite, something that collects dust in your code base, used only by a handful of users, while adding a whole lot of maintenance for your team.

To make this cleaner, and make it easier down the line to deprecate unsuccessful or tangential functionality, we may consider adding support for extending the core software using plugins or extensions.

## In practice

[[k6]] recently added support for extensions through the [[xk6]] project, heavily inspired (read: forked) by the [[Caddy]] project and their [[xcaddy]] tool. 

This gives k6 an excellent opportunity to incubate new features, allowing them to mature on their own before they are brought into the core. At the same time, if the feature stays fringe and fails to attract any following, they won't have to maintain it forever. Instead, they may let it sit and allow the community to maintain and evolve it on their own as they see fit.

## Related Topics
- [[Hexagonal Architecture]]
- [[Plugin Architecture]]