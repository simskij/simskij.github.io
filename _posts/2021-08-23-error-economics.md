---
title: Error Economics - How to avoid breaking the budget
---

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/holx6xqyohocf2w1qwmy.png)

At [SLOConf 2021](https://www.sloconf.com/) I talked about how we may use error budgets to add pass/fail criterias to reliability tests we run as part of our CI pipelines.

As Site Reliability Engineers, one of our primary goals is to reduce manual labor, or toil, to a minimum while at the same time keeping the systems we manage as reliable and available as possible. To be able to do this in a safe way, it's really important that we're able to easily inspect the state of the system.

To measure whether we're successful in this endeavour, we establish service level agreements (SLA), service level indicators (SLI) and service level objectives (SLO). Traditional monitoring is really helpful in doing this, but it won't allow you to take action until the issue is already present, likely already affecting your users, in prod.

To be able to take action proactively, we may use something like a load generator or reliability testing tool to simulate load in our system, measuring how it behaves even before we've released anything in production. While we'll never will be able to compensate fully for the fact that it won't be running in production, we can still simulate production-like load, possibly even while injecting real-world turbulence into the system, giving us a pretty good picture of what we can expect in production as well.

## How do we measure success for site reliability?

When we start out creating these service level artifacts, it's usually tempting to over-engineer them, trying to take every edge case into account. My recommendation is that you try to avoid this to the extent possible.

Instead, aim for a simple set of indicators and objectives, that are generic enough so that you may use them for multiple systems. You may then expand on them and make them more specific as your understanding of the systems you manage increase over time. Doing this is likely to save you a lot of time, as we otherwise tend to come up with unrealistic or irrelevant measurements or requirements, mainly due to our lack of experience.

## Service Level Indicators

Service level indicators are quantitative measures of a system's health. To make it easy to remember, we may think of this as what we are measuring. If we, for instance, try to come up with some SLIs for a typical web application, we are likely to end up with things like request duration, uptime, and error rates.

## Creating SLIs and SLOs

What should be included? In most cases, we only want to include valid requests. A good formula to follow when crafting SLIs is available in the [Google SRE docs](https://sre.google/). Those state that an SLI equals the amount of good events, divided by the amount of valid events, times a hundred, expressed as percentages.

As an example: if a user decides to send us a request that is not within the defined constraints of the service, we should of course handle it gracefully, letting the user know the request is unsupported. However, we shouldn't be held responsible for the request not being processed properly.

## Service Level Objectives

Service level objectives on the other hand, are the targets we set for our SLIs. Think of it as what the measures should show to be OK. For instance, if our SLI is based on request duration, and shows how many percent of all requests are below 500ms, our SLO would express how big a percentage we expect to be below 500ms for our service to be considered to be within the limits.

## What is an error budget?

An error budget is the remainder of the SLI once the SLO has been applied. For instance, if our SLO is 99.9%, that would mean our error budget is the remaining .1% up to a 100%. To not breach our SLOs, we then need to be able to fit all events that would not adhere to the criteria we set up into that .1%. This includes outages, service degradations and even planned maintenance windows.

What I'm trying to say is that while it might feel tempting to go for four nines, or even three as your SLO (99.99%, 99,9%), this has astronomic impact on the engineering effort needed. For a downtime/unavailability SLI, a three nine SLO basically means that you can afford as little as:

- Daily: 1m 26s
- Weekly: 10m 4s
- Monthly: 43m 49s
- Quarterly: 2h 11m 29s
- Yearly: 8h 45m 56s

For comparing "nines", navigate to [uptime.is](https://uptime.is).

In my experience, very few systems are critical enough to motivate this level of availability. With an SLO like this, even with rolling restarts and zero downtime deploys, we can't really afford to make any mistakes at all.

## Burning the budget

When would it be acceptable to burn the budget on purpose? I like to use the following sentence as a rule of thumb:

> It is only acceptable to burn error budget on purpose if the goal of the activity causing the burn is to reduce the burn-rate going forward.

## Setting expectations

### Picking our SLIs

In this demo, we'll be testing a made-up online food ordering service called Hipster Pizza. As service level indicators, we'll be using the response time of requests and the HTTP response status success rate.

[![hipster pizza](https://k6.io/blog/static/b61c2d22b2b553d2a050bfefec97a066/37e03/hipster-pizza.jpg 'hipster pizza')](/blog/static/b61c2d22b2b553d2a050bfefec97a066/37e03/hipster-pizza.jpg)

### Picking our SLOs

What would be reasonable SLOs for these SLIs? First we got to ask ourselves if we already have commitments to our customers or users in the form of SLAs. If we do, we at the very least need to stay within that.

However, it's also good to agree on our internal ambitions. And usually, these ambitions turn out to be far less forgiving than whatever we dare to promise our users.

In this example, we'll use the following SLOs:

- 95% of all valid requests will have a response time below 300ms
- 99.9% of all valid requests will reply with a successful HTTP Response status.

This means that the error budget for response time is 5%, while the error budget for HTTP success is 0.1%.

## Measuring

To know whether we are able to stay within budget, we need to measure this in production. And we also need to assign a time window to our SLOs. For instance, that the SLO is measured on a month-to-month basis, or a sliding 7-day window.

We also need to test this somehow continuously to make sure whether a certain change introduces regression, preventing us from hitting our target. This is where k6, or load generators in general, come in.

Most of the time we only speak about monitoring our SLOs. I would like to propose that we take this one step further. With the traditional approach of monitoring, we're not really equipped to react prior to consuming the budget, especially with the extremely tight budgets we had a look at earlier. Instead we're only going to be alerted once we're already approaching SLO game over.

Don't get me wrong here, I still believe we need, and should, monitor our production SLOs, but we should also complement this with some kind of indicative testing, allowing us to take action before the budget breach has occured. Possibly even stopping the release altogether until the issue has been resolved.

By running a test that simulates the traffic and behavior of users in production, we're able to extrapolate the effect a change would have over time and use that as an indicator of how the change would affect production SLOs.

Before we get into that, however, we also need to talk a bit about scheduled downtime, or maintenance windows.

## Accounting for scheduled downtime

In a real-world production system, these likely occur all the time. In some cases, this is possible without requiring any downtime whatsoever, but for the vast majority, some downtime every now and then is unavoidable, even with rolling restarts, canaries, feature flags and red-green deployments in place.

We should put some time into identifying what activities we do that actually require downtime, and account for that in our test. If our SLOs are measured on a month to month basis, and we usually have 10 minutes of downtime every workday, we also need to deduct a corresponding amount from our error budget.

For a month with 31 one days, 22 of them being workdays, 10 minutes of downtime every workday would mean we have a planned downtime of 220 minutes per 744 hours, or 0.0049%.

```plain
220/(744*60) = 0,0049%
```

We'll now adjust the SLOs we use in our test accordingly, prior to calculating the error budget. Heavily simplified, not taking usage volume spread and such into account, this would in our case mean the actual error budgets for our test would be 0,0951% and 4,9951%.

## Demo

By using these calculated error budgets, we may then express them as thresholds in our tests, and use them as pass/fail criteria for whether our build was successful or not. And once we have those in our CI workflow, we'll also be able to increase our confidence in product iterations not breaking the error budget.

Let's have a look at how this could look in k6. k6 is available for free and as open-source. Hooking it up with your pre-existing CI pipelines is usually done without any additional cost or significant time investment.

If you're using some other load testing tool that also support setting runtime thresholds, this will likely work just as well there. For this demo, we're gonna use this small test script.

```javascript
import http from 'k6/http'

export const options = {
  vus: 60,
  duration: '30s'
}

export default function() {
  const res = http.get('https://test-api.k6.io')
}
```

So what does this script actually do? For a duration of 30 seconds, it will run 50 virtual users in parallel, all visiting the page [https://test-api.k6.io](https://test-api.k6.io) as many times as possible. In a real world scenario, this test would most likely be a lot more extensive, and try to mimic a user's interaction with the service we're defining our SLO for.

Let's run our test and have a look at the stats it returns:

```plain
http_req_duration..............: avg=132.05ms min=101.44ms med=127.55ms max=284.2ms p(90)=156.19ms p(95)=165.75ms
http_req_failed................: 0.00% ✓ 0 ✗ 6576

```

As you can see, we already get all the information we need to be able to make out whether we fulfil our SLOs. Let's also define some thresholds to automatically detect whether our test busted our error budget or not.

Let's set those as our thresholds in our k6 script.

{% raw %}
```plain
  export const options = {
    thresholds: {
      http_req_duration: ['p(95.0049)<300'], // 95% below 300ms, accounting for planned downtime
      http_req_failed: ['rate<0.00951'], // 99,99049% successful, accounting for planned downtime
    }
  }
```
{% endraw %}

That's it! By using your SLOs and SLIs as pass/fail thresholds in your CI workflow you'll be able to increase your confidence in product iterations not breaking the error budget.
