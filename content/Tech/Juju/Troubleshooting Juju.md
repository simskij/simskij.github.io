---
title: Troubleshooting Juju
---
### Set controller log levels to debug

```shell
$ juju model-config \
    -m controller \
		logging-config="<root>=DEBUG;juju.apiserver=INFO;juju.mgo=INFO;juju.mongo=INFO;juju.rpc=INFO;juju.worker.httpserver=INFO"
```
