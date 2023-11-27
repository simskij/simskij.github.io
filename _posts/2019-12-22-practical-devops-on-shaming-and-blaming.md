---
title: "Practical Devops #2: On Shaming and Blaming"
---

![people taking notes](/images/practical-devops-2-cover.jpeg)

# Finding the root cause
As I often state when I do talks or courses on the topic of DevOps, I'm a firm believer that DevOps has very little to do with technology, and a whole lot to do with culture.

We, as developers, are often very good at performing root cause analysis and present a conclusion whenever things go south. Usually, we're also as good at pinning that mistake onto someone, whether it's a colleague or ourselves.

I get it, we're analytically inclined and wont rest until we've found the root cause. This in itself is something positive that we should keep on doing. However, when even our tools use terms as blame (git blame anyone), it's clear that we might need to change how we do this.

Throughout the years, I've been in many organisations where, when someone detected an outage or bug in our production systems, everyone got real busy trying to find out who was "responsible" or "caused" it. This is a super-effective way to make sure that there is:

# Fear of punishment

If every failure is met with punishment, whether it's intended or not, the organisation will quickly become less prone to take risks or experiment. This stands in direct contradiction to the DevOps goal of promoting experimentation and collaboration.

No one wants to be called out as a failure. If the possible outcomes of trying something new ranges between silence or blame, why would anyone ever try to do something differently?

# Missed learning opportunities

Picture yourself learning something new. Maybe a new language, or an instrument. Every time you make a mistake, your friends or partner would call that out and tell you how your mistake ruined the whole song.

Even if they followed that up by giving constructive, actionable feedback on how you could improve. Would you be inclined to listen and learn from it? I know I wouldn't. Likely, I'd even stop trying altogether if it happened frequently.

---

# So what should we do?

A former colleague of mine had such an excellent saying on blame and shame:

> Focus on making it easier to do things the right way, not harder to do it the wrong way.

## Blameless post-mortems

Make sure you take every chance you get to inspect the outcome and make sure to understand *why* it happened and how to improve, not *who* did it and how to punish them.

## Practice acceptance

Things go south and mistakes happen. Until we learn to accept this fact, the expectations we have of ourselves and others won't be reasonable and will only lead to unnecessary stress and disappointment.

## Encourage change

Someone, unfortunately I don't really remember who, told me that they've actually renamed git blame to git praise, as in `finding out who to praise for having the courage to change something`. While it might not be feasible to replace the word in your tools, the sentiment is great. 
