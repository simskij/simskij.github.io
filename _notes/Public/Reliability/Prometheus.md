---
title: Prometheus
---
Prometheus is a systems monitoring and alerting tool used to ingest, process, serve, visualize, and alert on metric telemetry. By default, Prometheus operates in a [[share-nothing]] fashion, meaning it's not capable of scaling horizontally with maintained data consistency across replicas.

In contrast to prior similar tools, like Nagios and NRPE, Prometheus only concerns itself with numerical measurements stored as time series.
## Concepts
- [[Metrics]]
- [[Time Series]]
- [[PromQL]]
- [[Prometheus Exporters]]

## Thoughts
- [[Adding selector labels using a PromQL Parser]]
- [[Pushing or Pulling Metrics]]
- [[Scaling your metrics backend]]