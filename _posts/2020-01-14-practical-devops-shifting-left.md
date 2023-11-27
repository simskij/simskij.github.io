---
title: "Practical DevOps #3: Shifting Left"
---

One topic I always keep coming back to when it comes to DevOps is shift-left testing. 

## What is shift left testing?
The term was initially coined by Larry Smith in 2001 [in an article in  Dr. Dobbs Journal](https://web.archive.org/web/20140810171940/http://collaboration.cmc.ec.gc.ca/science/rpn/biblio/ddj/Website/articles/DDJ/2001/0109/0109e/0109e.htm) and refers to how we, by testing as early as possible, may deliver both faster and with higher quality.

What if we instead of postponing testing until the sprint is over and we've delivered a new increment to QA were to test all the time; together?

---

## Tests are expensive
Many a manager has expressed their dissatisfaction with engineers spending too much time working on test automation. The usual reasoning is that test automation is expensive, and that Devs shouldn't be doing the job of the QA team. The development team themselves might also reject test automation as too time-consuming, arguing that their time is better spent developing new features.

And they're not entirely wrong. Test automation **IS** expensive. However, it's not nearly as expensive as manual testing. There are a couple of reasons as to why this usually holds:

### Lost context

![forgot](/images/forgot.gif)

The developer(s) who implemented the feature has moved on to other tickets, which eliminates the possible benefit of still being "in that context" mentally as the testing is performed.

This, in turn, means that they'll have to stop whatever they're doing and brush up on the details any time the one performing the manual testing requires assistance.

### Limiting flow

![this is fine](/images/this-is-fine.gif)

Building a feature, just to put it in the `ready for testing` stack until it gets tested is no way to deliver features. What if testing is postponed? Creating a fix might very well be a week or two from now, as sprint scopes seldom change once the sprint has started. The same goes for actually retesting the fix.

You probably wouldn't wait for a burger joint that waits for the cashier to tell the kitchen that the burger's still raw on one side. They could just flip it an additional time as they cook it to make sure it's done before they pass it on. Your features are no different.

### Assurance decay
The only thing we'll be able to guarantee is that it worked *at the exact time of testing*. After that, all bets are off. One could argue that the assurance given by manual tests decays, or rots, with time. Every time we want to increase the assurance again, we'll have to execute the tests again. Automated tests on the other hand, while sometimes requiring some additional development effort, may be executed on every commit or push, without any additional effort.

## When to tests
So, when should we test? Only during the development phase of each feature or ticket?

![when to test](/images/when-to-test.png)

I'd like to argue that we should test all the time. From doing whiteboard simulations together with stakeholders or while designing our feature, all the way to chaos engineering experiments in production.

With that said, it's still important that we aim at testing something as early as possible and reasonable. Otherwise, we'll risk passing the defects on to the next step in our development process, making the process of fixing them a lot more expensive.

![when to test](/images/cost-of-defects.png)

## Every tool has its purpose
It might sound like I'm proposing that we get rid of manual testing completely. That's not the case. There's still an extremely valid use case for manual testing: exploratory testing.

While test automation is great for making sure that what we know, or assume, is indeed still valid, it's very ill-suited for exploring new features, finding unintended ways in which they might break.

So, if you ever find yourself writing a test script (as in instruction, not shell- or javascript), immediately stop what you're doing, take a step back and get started on automating it instead!