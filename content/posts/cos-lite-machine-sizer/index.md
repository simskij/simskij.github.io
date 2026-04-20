---
title: "COS Lite Machine Sizer"
date: 2026-04-09
tags:
  - SRE
  - Juju
  - Observability
  - Canonical Observability Stack
---

This is a sizing tool for COS Lite deployments. It used to live here but got lost in one of my many blog migrations.

Use the sliders above to interactively adjust your log and metric ingestion rates and retention period, and get an estimate of the CPU, memory, and disk sizing you may need for your COS Lite deployment.

Based on [this](https://discourse.charmhub.io/t/cos-lite-ingestion-limits-for-8cpu-16gb-ssd/13005) discourse post.

## The Tool

{{< sizer >}}

## Formulas

The formulas used, courtesy of @sed-i, are the following:

```
disk = 3.011e-4 * L + 3.823e-6 * M + 1.023
cpu = 1.89 * atan(1.365e-4 * L) + 1.059e-7 * M + 1.644
mem = 2.063 * atan(2.539e-3 * L) + 1.464e-6 * M + 3.3

recommended = ceil(raw * 1.10)
```
