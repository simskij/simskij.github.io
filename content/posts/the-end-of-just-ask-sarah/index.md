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

Humans can ask her.

Agents won't. 

That changes what documentation is. If [boring code is an organizational tell](https://simme.dev/posts/boring-code-is-an-organizational-tell/), the absence of documentation is an even sharper one. Documentation is no longer a courtesy to future humans. It is the durable surface through which organizational intent reaches execution.

An agent opens a task. There's a codebase, a prompt, a ticket. No ADR explaining why the service is structured the way it is. No spec describing the intent. The agent does what it's built to do: finds the dominant pattern and extends it.

That's not a bug. That's intent debt propagating. A decision **was** made, it just wasn't written down. So the agent inherits the output without the reasoning, and fills in the blanks.

## Humans carry state

Organizational memory has always been a social structure as much as a technical one. It lived with the engineer who'd been on the team for seven years. In the phrase "just ask Sarah". In the context handed off in one-on-ones and accumulated across stand-ups. Writing was the backup - always supposed to be there, but rarely maintained to the point where it could actually stand in for the human who held the original context.

This was survivable as the cost was deferred, not permanent. The penalty of the bus factor was only ever incurred through staffing changes. The engineer who made the decision last quarter is still on the team, allowing you to reconstruct the intent by asking.

The cost of undocumented decisions was real but recoverable: slower onboarding, an awkward investigation session before touching a brittle component, a 30-minute messaging thread that could have been a two-paragraph ADR. 

Organizations learned to run on oral tradition because the alternative required discipline that was hard to reward. With agents, the full cost of a missing paper trail is paid every time the session terminates.

## Agents don't have Sarah

Agents have whatever is in the context window, and when that closes, it's gone. The next session starts from zero.

Retrieval and agent memory do not change this. They only help if the organization has produced something worth retrieving. A vector database full of stale tickets, half-written specs, and decisions that only happened in Slack is not institutional memory.

It is archaeology with better search.

This makes intent debt structurally different for agents than it was for people. A human engineer can accumulate unwritten context over time by carrying it forward, updating it, and passing it on. Agents can't form the kind of institutional memory that makes oral tradition viable. The knowledge that used to live between sessions now has to live *somewhere* that survives the session ending.

The codebase carries the *result* of decisions: the code that shipped, the abstractions that stuck, the patterns that propagated. It doesn't carry the reasoning. Why this module boundary and not that one? What was evaluated and ruled out before the current approach was chosen? What constraint produced a design that looks strange now because the constraint no longer exists?

Without that reasoning, an agent encountering the code has only the output to work from. It doesn't know whether the pattern is intentional or a historical accident. So it treats it as intentional and extends it - which is the correct behavior given what it has access to, and the wrong behavior given what actually matters.

An agent sees that every customer integration has its own service, so it creates another one. What it cannot see is that the pattern came from a scaling constraint two years ago, before the shared integration layer existed. 

The constraint disappeared. The architecture kept reproducing.

## Intent needs a format

For agents, the value of ADRs, specs, and playbooks is not completeness. It is friction. They interrupt the default move from "this pattern exists" to "this pattern should be extended".

The ADR is where intent debt gets paid down. Its job is to record not just what was decided, but what was considered and why the alternatives lost. The constraint that drove the choice and the tradeoffs that were accepted. When an agent reads it, the decision isn't an arbitrary historical fact - it's the conclusion of an argument the agent can now evaluate and extend.

The spec operates on a longer time horizon. An agent optimizing a billing pipeline removes what looks like redundant retry logic. The spec would have told it the retries were a required idempotency guarantee - not an oversight. The code didn't say why they were there. Only that they were. A spec written before code is a target. A spec written after code is a description.

The playbook is the operational artifact. Its time horizon is the incident. An agent responding to a memory spike restarts the affected pod. The playbook would have told it to check the upstream rate limiter configuration first - the restart clears the symptom, the playbook clears the cause. For a human SRE at 3am, the playbook is a spine. For an agent, it's the only structured reasoning available.

All three operate at different layers - the decision, the direction, and the operation. None of that lives in the code itself.

## The unwritten decision is still a decision

The absence of documentation is not neutral. It answers a question about what the organization treats as output. The incentive structure treated the time spent writing as overhead, not output.

The absence of an ADR is a sharper tell than anything you'll find in the codebase. Code can be clever for reasons that are hard to see from the outside: inherited constraints, reasonable tradeoffs, or historical accidents.

The organization that resists ADRs isn't resisting a writing style - it's revealing a priority order. Shipping before explaining. Code before context. The decision, but not the decision record. The friction was never in the prose.

## A concentration of cost

The cost of not writing concentrates in exactly the place where it's hardest to recover from: the agent that picked up the task, found no ADR, found no spec, and proceeded with what it had.

That means writing is now the primary surface through which organizational intent becomes part of the context. 

The boring organization writes everything down. If the decision was worth making, it was worth recording. If it wasn't, that's a choice the organization made, and agents will execute on it the same way they execute on everything else: faithfully, without judgment, at scale.