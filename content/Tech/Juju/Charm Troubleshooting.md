---
title: Charm Troubleshooting
---

### `apt-get` is not reachable
Problem is Docker resetting the iptable rule to drop all outbound traffic. Solved by running

```
sudo iptables -I DOCKER-USER -j ACCEPT
```
