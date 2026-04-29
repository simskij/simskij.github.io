---
title: The end of "Just ask Sarah"
date: 2026-04-29
tags:
  - Leadership
  - AI
  - Software Health
  - Writing
summary: >
    Documentation used to back up organizational memory. With agents, it becomes execution context: the durable surface where intent survives the context window. 
description: >
    Sarah is the person who knows why a service was split, why an abstraction exists, why a strange constraint shaped the current design, and why the obvious fix was rejected three quarters ago.
---

Every engineering organization has a Sarah.

Humans can ask her - agents won't. 

That changes what documentation is. If [boring code is an organizational tell](https://simme.dev/posts/boring-code-is-an-organizational-tell/), the absence of documentation is an even sharper one. Documentation is no longer a courtesy to future humans. It is a durable artifact that ensures intent reaches execution.

Imagine: an agent opens a task. There's a codebase, a prompt, a ticket. No ADR explaining why the service is structured the way it is. No spec describing the intent. The agent does what it's built to do: finds the dominant pattern and extends it. That's not an actual bug but rather intent debt propagating. A decision **was** made, it just wasn't written down. So, the agent inherits the output without the reasoning, and fills in the blanks.

## Humans carry state

Organizational memory has always been a social structure just as much as a technical one. It's been living with the engineer who has been on the team for seven years. It's ingrained in the phrase "just ask Sarah", or in the context handed off in one-on-ones and accumulated across stand-ups. Writing was meant as a backup. It was always supposed to be there, but rarely maintained to the point where it could actually stand in for the human who held the original context.

This was survivable as the cost was deferred, not permanent. The penalty of the bus factor only ever incurred through staffing changes. The engineer who made the decision last quarter is still on the team, allowing you to reconstruct the intent by just walking over to their desk and ask.

The cost of undocumented decisions was always real but used to be recoverable. At worst it resulted in slower onboarding or an awkward investigation session before touching a brittle component. We've all been in that 30-minute messaging thread that could have been a two-paragraph ADR. 

Organizations learned to run on oral tradition because the alternative required discipline that was hard to reward. With agents, the full cost of a missing paper trail is paid every time the session terminates.

## Agents don't have Sarah

Agents have whatever is in the context window, and when that closes, it's gone. The next session starts from zero.

Retrieval and agent memory do not change this dramatically. It's convenient that the agent remembers some context between sessions, but it only helps if the organization has produced something worth retrieving. A vector database full of stale tickets and half-written specs, and decisions that only happened in Slack, is not institutional memory. It's just code archaeology with better search.

A human engineer can accumulate unwritten context over time by carrying it forward, updating it, and passing it on. Agents on the other hand can't form the kind of institutional memory that makes oral tradition viable. The knowledge that used to live between sessions now has to live *somewhere* that survives the session ending.

The codebase carries the *result* of decisions: the code that shipped, the abstractions that stuck, and the patterns that propagated, but it doesn't carry the reasoning. Why did we pick this module boundary and not the other one? What was evaluated and ruled out before the current approach was chosen? What constraint produced a design that looks strange now because the constraint that made us introduce it no longer exists?

Without that reasoning, an agent encountering the code only has the output to work from. It doesn't know whether the pattern is intentional or an accident, so it treats it as intentional and extends it. And we can't really blame it - it's the correct behavior given what it has access to, even if it's the wrong behavior given what actually matters.

An agent sees that every customer integration has its own service, so it creates another one. What it cannot see is that the pattern came from a scaling constraint that happened two years ago, before the shared integration layer existed. The constraint disappeared but the agent treats it as a pattern and keeps reproducing it.

## Intent should be durable

For agents, the value of ADRs, specs, and playbooks is not completeness but friction. They interrupt the default move from "this pattern exists" to "this pattern should be extended".

The ADR is where intent debt gets paid down. Its job is to record not just what was decided, but what was considered and why the alternatives lost. It should tell the reader what the constraint was that drove the choice and the tradeoffs that were accepted. When an agent reads it, the decision isn't an arbitrary historical fact - it's the conclusion of an argument the agent can now evaluate and extend. 

The longer time horizon is a concern best fit for the spec. Without it, an agent optimizing a billing pipeline would be inclined to remove what looks like redundant retry logic. The spec would have told it the retries were a required idempotency guarantee rather than an oversight. The code didn't say why they were there - only that they were. If written before the code, it serves as a goalpost or target. If written afterwards, it serves as a statement of work. Both have their place.  

The playbook is the operational artifact. Its time horizon is the incident. An agent responding to a memory spike restarts the affected pod. The playbook would have told it to check the upstream rate limiter configuration first. While the restart **would** clear the symptom, the playbook clears the cause. The human SRE at 3am would find it a much needed safety net. For an agent it might very well be the only structured reasoning available.

None of the three can easily be captured in code, but are trivial to capture as documentation.

## The unwritten decision is still a decision

The absence of documentation is not neutral. It answers a question about what the organization treats as output. The incentive structure likely treats the time spent writing as overhead rather than output with real value. This makes the absence of an ADR a sharper tell than anything you'll find in the codebase. Code can be clever for reasons that are hard to see from the outside: inherited constraints, reasonable tradeoffs, or historical accidents.

These organizations often claim that their engineers don't like writing, but in reality they're revealing a priority order: Shipping is more important than explaining. The increment itself is more important than the decision record. The friction was never **really** in the prose.

## Concentration of cost

The cost of not writing concentrates in exactly the place where it's hardest to recover from: the agent that picked up the task and found no ADR, no spec, and was forced to proceed with what it had.

That means writing is now the primary surface through which organizational intent becomes part of the context. 

If the decision was worth making, it was likely also worth recording. Likewise: If it wasn't, that's a choice the organization made, and agents will execute on it the same way they execute on everything else.