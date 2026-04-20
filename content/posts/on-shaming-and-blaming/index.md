---
title: "On shaming and blaming"
series: "Practical DevOps"
date: 2019-12-21
tags:
  - Engineering Culture
  - Post Mortems
summary: |
  There are severe consequences of allowing shaming and blaming in your engineering culture. In this
  essay, I'll suggest a few small things you can do instead.
description: |
  As I often state when I do talks or courses on the topic of DevOps, I'm a firm believer that DevOps has very little to do with technology, and a whole lot to do with culture.
---

## Engineers are great at Root Cause Analysis

We, as engineers, are often very good at performing root cause analysis and present a conclusion whenever things go south. Unfortunately, we're usually also as good at pinning that mistake onto someone, whether it's a colleague or ourselves.

I get it, we're analytically inclined and wont rest until we've found the root cause. This in itself is something positive that we should keep on doing. However, when even our tools use terms as blame (`git blame` anyone?), it's clear that we might need to change how we do this.

Throughout the years, I've been in many organisations where, when someone detected an outage or bug in our production systems, everyone got real busy trying to find out who was "responsible" or "caused" it. This is a super-effective way to ensure a culture
dominated by fear of punishment and missed learning opportunities.

### Fear of punishment

If every failure is met with punishment, whether it's intended or not, the organisation will quickly become less prone to take risks or experiment. This stands in direct contradiction to the DevOps goal of promoting experimentation and collaboration.

No one wants to be called out as a failure. If the possible outcomes of trying something new ranges between silence or blame, why would anyone ever try to do something differently?

### Missed learning opportunities

Picture yourself learning something new. Maybe a new language, or an instrument. Every time you make a mistake, your friends or partner would call that out and tell you how your mistake ruined the whole song.

Even if they followed that up by giving constructive, actionable feedback on how you could improve. Would you be inclined to listen and learn from it? I know I wouldn't. Likely, I'd even stop trying altogether if it happened frequently.

## So what should we do?

A former colleague of mine had such an excellent saying on blame and shame:

> Focus on making it easier to succeed, not harder to fail

### Blameless post-mortems

Make sure you take every chance you get to inspect the outcome and make sure to understand _why_ it happened and how to improve, not _who_ did it and how to punish them.

### Practice acceptance

Things go south and mistakes happen. Until we learn to accept this fact, the expectations we have of ourselves and others won't be reasonable and will only lead to unnecessary stress and disappointment. With that said, human error is a poor explanation if we
want to make improvements, which is exactly why this whole idea becomes so important.

If a human is able to introduce an error, the system is flawed and need fixing - you should invest into solving that instead.

### Encourage change

Someone, unfortunately I don't really remember who, told me that they've actually renamed git blame to git praise, as in `finding out who to praise for having the courage to change something`. While it might not be feasible to replace the word in your tools, the sentiment is great and deserves more thought.
