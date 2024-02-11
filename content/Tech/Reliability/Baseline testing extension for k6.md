---
title: Baseline testing extension for k6
---


When I worked at k6, I had an idea of allowing users to run a test and generate a baseline from the metrics, like `k6 run test.js --create-baseline baseline.json`, which could then be used in subsequent tests, allowing users to express relative thresholds, like `within 20% of baseline`.