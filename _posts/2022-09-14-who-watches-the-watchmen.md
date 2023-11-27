---
title: 'Observability is becoming mission critical, but who watches the watchmen?'
---


*Before we get started, I just want to get this out of the way: I work at Canonical, and more specifically, I run the observability product team there, currently doing lots of cool stuff [around observability in Juju on both K8s and machines](https://charmhub.io/topics/canonical-observability-stack). In this piece, I'm actively trying to stay neutral, but it is nonetheless information worth disclosing. I'm also hiring, so if you're also super excited about building world-class observability solutions, [don't be shy - apply!](https://canonical.com/careers/2166631)*

The last couple of years, there has been quite a lot of development in the area of lowering the barrier of entry for observability. There are now quite a few, reasonably mature options out there that lets you set up a good monitoring stack either through a few clicks or by a few one-liners in the terminal.

In the managed open-source space, the most successful one so far probably is [Grafana Cloud](https://grafana.com/products/cloud/), but there definitely is no shortage of closed-source vendors providing APM solutions where everything you need to get started is to drop either a single or multiple agents into your cluster or your machine. Even in the case of self-hosted open-source, there are quite a few options available. [Observatorium](https://observatorium.io/), [OpsTrace](https://opstrace.com/) and [COS](https://charmhub.io/topics/canonical-observability-stack) all provide different degrees of out-of-the-box turn-key experiences, even if the most popular option here remains to roll it yourself, picking the tools you think are the best for the job. 

With the increasing interest in observability as a practice, and decreasing barrier of entry, a lot of organisations will, if they haven't already, find out that observability will become more and more critical as their practices improve, to the point where I would argue that it no longer is icing on the cake, making the work of the SREs easier, but mission-critical for their entire business.

## Who watches the watchmen?

As this transition in value happens, a new question is starting to gain in importance: who watches the watchmen? Or to put it in words that speak less of my geeky obsession with comics, and more of the topic at hand: what observes the observability stack? How will we be made aware if it is starting to have issues?

<div style="text-align: center;">
  <img src="/assets/img/who-watches-the-watchmen.png" alt="Who watches the watchmen?" style="margin: auto;" />
  <br/><br/>
</div>

A former colleague of mine used to say that "you only get one chance at making a good impression, but for an observability solution, this is especially true". And I truly think they were (are) right! I mean, let's be honest: if you've been burnt by your production monitoring even once, that solution will have a **REALLY** hard, if not even impossible, time convincing you to trust it again. 

Never getting an expected alert might very well mean your critical business services might end up broken without you knowing. To really twist the knife, also imagine that you've not been alerted that the stacks alerting capabilities are broken, or that no telemetry is being collected anymore. While the value of an observability stack is known, most of us don't really put that much effort into making sure our stack itself stays healthy. What happens, for instance, if our log ingesters suddenly start to choke due to a spike in error logs? If our alerting tool starts to crash loop? Would we even notice? I'll go out on a limb and make an educated guess that for many of us, maybe even the vast majority, the answer would be no.

What I'm trying to say here is that while the stability of course is important, the solution does not need to be fault free - it can't be really, just as no software can. What it does need to be, however, is capable of letting you know when its starting to misbehave, so you can take proper action early. 

## Understanding the failure modes

Before we go into analysing likely failure modes, I just want to make one thing clear: the visualisation tool, like Grafana, is **not** something I consider to be a critical part of the stack.  While useful, as long as the rest of our tooling works, we'd always be able to spin up a new visualisation tool somewhere else and connect our datasources to it.  

To keep it short: as long as our alerting continues to work, and the telemetry signals get collected - we're good.  We should of course monitor our visualisation tool as well, but from a comparative point of view, it's by far the least important one. Instead, let's focus on two really critical, fairly common failure modes:

### Alerts not firing

Let's say we're running a stack where [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) is responsible of alerting. If this (or these) Alertmanager stops working, there will no longer be anything in place to alert us about the fact that it's down (duh). Some would probably argue that this is why you have something like Grafana in place, with dedicated monitoring screens on the wall displaying the state of your solution in realtime. I don't know about you, but I personally forget to look at those screens as soon as I get caught up in something. I also want to be able to get lunch, go to the bathroom every now and then or even refill my cup of coffee.

<div style="text-align: center;">
  <img src="/assets/img/keep-calm-and-alert-on-failure.jpeg" alt="Keep calm and alert on failures" style="margin: auto" />
  <br/><br/>
</div>

The solution to this actually is just as simple as it is elegant! We need to set **something** up, somewhere else, preferably as far away as possible from the stack itself, that continuously receives an always-triggering alert from Alertmanager. In the absence of such an alert, this something will notify you that Alertmanager isn't checking in as expected.

As for any specific tool or service to help you with this, it's totally up to you. Popular solutions include [Dead Man's Snitch](https://deadmanssnitch.com/) , [Cronitor](https://cronitor.io/) and [Healthchecks.io](https://healthchecks.io/) with the last one [being available as open-source](https://github.com/healthchecks/healthchecks) in addition to their managed offering. But in reality, you could very well hack something together yourself that would do the job just fine. The important part here is that it needs to serve as a dead man's switch, immediately firing and alerting if your alerting tool fails to check in.

### Telemetry missing

We can of course monitor the CPU and memory consumption of our ingesters to give us an early warning of when things are about to go south. We may also monitor and alert on the ingestion rate, using for instance the `prometheus_remote_storage_succeeded_samples_total` metric. This metrics however, is leaving us a bit vulnerable, as the ingesters being overloaded naturally also will prevent the very same ingesters to ingest metrics about themselves and their own performance.

Just as for the previous failure mode,  this one will also require us to alert in the **absence** of something expected. In this case, rather than the absence of an alert, we want to alert on the absence of telemetry being ingested. PromQL and LogQL both have facilities for this, using [`absent`](https://charmhub.io/topics/canonical-observability-stack) and [`absent_over_time`](https://charmhub.io/topics/canonical-observability-stack). This will allow us to set up an alert rule that tracks the absence of a metric for a certain time range, and when there no longer is any new data points within that range, the alert will trigger. As for the alerting expression, we could use the ingestion rate metric above, or something even simpler like the `up` metric, wrapping it in an `absent` function. Anything will do really, as long as it is being ingested regularly.

## What's next?

This is by no means an exhaustive list of failure modes for an observability stack. It pinpoints two fairly common and fairly critical scenarios that are easily guarded against.

As your understanding of your observability stack deepens, you'll be able to identify more possible failure modes, and using the telemetry provided by each component of your stack; guard against them. The very same telemetry is not only useful for observing the behaviour of your stack, but also for observing the behaviour of your incident response team. But that will be a topic for some other time.