---
title: "Boring code is an organizational tell"
date: 2026-04-18
tags:
  - AI
  - Software Health
  - Boring Code
cover: cover.png
summary: "Why clever code is an organizational output, not an engineering one — and how agents turn a slow-moving problem into a fast one."
description: "If boring code is good, why is it so rare? Clever code is not the result of clever engineers. It's the consequence of organizations that reward cleverness."
---

Most teams have survived clever code because it accumulated slowly. That margin is now closing. Boring code is an organizational tell: the codebase doesn't just reflect the organization - it gives it away.

## The causality is backwards

The standard career advice frames boring code as a hard-won virtue of seniority. That gets the causality backwards.
It emerges where leaders remove the incentives for cleverness, and it won't survive if those incentives return.

Most performance reviews reward delivery, velocity, features shipped. Simplification rarely appears. When someone
simplifies a system, it should show up in the review - not just the team retrospective.

## Boring code is a structural property, not an aesthetic

Readability is not a sufficient definition. It measures appearance, not comprehension. You follow the references, chase
the abstractions, and the actual logic is nowhere. The ceremony ate the code.

Even when you find it, it doesn't tell you what it knows. A file can be perfectly readable and still require you to
hold five invariants in your head to be able to safely touch it. That makes boring code a property of the system, not
of any single file.

The simplest diagnostic: how many files a change requires you to open, and how many invariants live in someone's head
rather than in the code.

The first is legible in version control - co-change patterns, dependency reach. Files that always co-change without
depending on each other in the type system are organizational boundaries made visible in code. They change together
not because the domain demanded the coupling, but because the same implicit knowledge requirement governs both. The
commit graph is the org chart asserting itself. That's not a readability problem - it's context. And it shows up in
version control before it shows up anywhere else.

The second is observable through onboarding and on-call: time to first unassisted change, and how long before on-call
understands what they're looking at. Context debt isn't invisible - it shows up in calendar time and incident duration.

## The organizational tell

[Conway's Law](https://www.melconway.com/Home/pdf/committees.pdf) gave us the first half of the organizational effect
decades ago.

> Organizations which design systems \[...\] are constrained to produce designs which are copies of the communication
> structures of these organizations.

The second half took empirical work to show: those structures do not just shape architecture; they also correlate with
software quality and failure risk.

Nagappan's [study](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/tr-2008-11.pdf) of the Windows
Vista codebase found that organizational metrics - not code complexity, churn, or coverage - were the strongest
predictors of which subsystems would fail.

When no single person or team feels accountable for a piece of code, it doesn't drift - it compounds. You'll see it
in the abstractions that exist, not because the domain demanded them, but because two teams couldn't agree on a common
interface. You'll see it in the component nobody dares to touch because the person who wrote it left six months ago
and took the context with them.

Diffuse ownership produces defects. Worse: it makes complexity uncancellable. The person with enough context to
simplify rarely has the authority; the person with authority rarely has the context. Nobody with both is in a
position to kill it.

[Bird](https://www.researchgate.net/publication/221560133_Don't_Touch_My_Code_Examining_the_Effects_of_Ownership_on_Software_Quality)
measured this through ownership concentration: the fraction of changes made by a single owner, and how many minor
contributors touched the code. More contributing hands, more defects - especially in frequently-changed code. Nobody
owned the outcome.

Ownership needs to be narrow enough that the team introducing complexity is the team living with it. If no single
team can veto a change to a component, the component has no real owner. Diffuse ownership is a choice, not an
accident of scale.

## You build it, you run it

The person who introduced the complexity never gets to experience the cost of their decision. The people who do often lack
the authority to change the code.

The fastest way to make an engineer value boring code is to hand them a pager. When the person who wrote the clever abstraction
is also the one debugging it at 3 am on a Saturday, the feedback loop closes.

_You build it, you run it_ is not a DevOps principle - it's an incentive structure.

Breaking that link is a subsidy for complexity.

## Review norms

Code review is the last checkpoint before cleverness ships and hits production. What matters is not the ritual of review,
but who can say no without penalty.

Most teams review for correctness; fewer review for complexity. And even when they do, the push-back flows only in one
direction, downward from senior to junior.

When someone's seniority becomes synonymous with whether their work can safely be criticized, the most senior engineer's
aesthetic becomes the ceiling. If questioning complexity gets you labeled as blocking progress, or as not senior enough
to understand, people stop questioning.

If a senior engineer's code is above criticism, you don't have code review. You have approval theater.

## The agent era as a stress test

Agents didn't introduce these problems - they removed the friction that was containing them. The pace of clever code
accumulation was limited by the cost of producing, reviewing, and shipping it. That throttle is now gone. Code arrives
faster than teams can absorb, reverse or fully understand.

Agents have no institutional memory. They optimize for local coherence with the code, prompt, and examples in front of
them - which is not the same as exercising [architectural judgment](https://www.researchgate.net/publication/403610885_A_Multi-Agent_LLM_Experiment_Revealing_Architect-Level_Failure_Modes_in_Scientific_Software_Development). They
will [reproduce whatever patterns they find](https://lethain.com/what-can-agents-do/), and in a codebase that rewards
cleverness, they will find plenty.

Engineers using agents are no longer just implementing local changes. They are making dozens of architectural micro-decisions
per day - through prompts, examples and acceptance criteria - and their agents execute every one without hesitation or judgment.

[Storey](https://arxiv.org/abs/2603.22106)'s triple debt model names the failure modes from agentic workflows: cognitive debt,
intent debt, and the more classical - technical debt. When shared understanding can't keep pace with production because of
human limits in comprehension speed, you get cognitive debt. Similarly, when decisions start to live in the prompt, rationale
disappears with the context window, generating intent debt. The bus factor moves from staffing changes to session changes,
amplifying the team tax.

Technical debt we are all familiar with. It's a debt you can measure and pay down. The other two you find in the incident.

A clever culture that ships clever code slowly is recoverable. The same culture with agents is not - because intent debt doesn't accumulate, it evaporates.
