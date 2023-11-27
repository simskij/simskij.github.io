---
title: Change Advisory Boards are useless
---

The traditional CAB that is part of [[ITIL]]s [[Change Management]] process is unneeded. The rigidity of ITIL is still very real within a lot of organizations, making it impossible for them to hit deadlines and deliver on time and cost. 

If a change board is necessary due to regulations or whatever, make sure it *only gets each type of change request once*. Once it's done and documented, it should in most cases be considered a standard, pre-approved change, maybe requiring some condition to be fulfilled.

## Anecdotal Evidence

### Background

During my time at [[IL Recycling]], we employed the change advisory board, also known as CAB, with great scrutiny. Any change that was to make it to the production environment, or even the test or verification environments, where first to be approved by the CAB.

The CAB consisted of key stakeholders within the IT organization:

- The Change Manager
- The IT Operations manager
- The IT Solution Architect manager

System owners and maintainers were then invited to inform, explain and argue their case as to why the change needed to be pushed through. These meetings usually took half a day, once a week.

### Evidence

A friend and I had submitted a change request where we wanted to deploy a change to the global address book, replacing the current synchronization with a much more sophisticated one. The change was first rejected, with the motivation that we also needed to submit the code we wanted to deploy to the board so they could review it.

We had long suspected they didn't check any submitted code, as no one with development experience was included on the board. To challenge this suspicion, we prepended all code files with ASCII art of Mr. Bean, thinking that we most definitely would hear if they spotted it. 

No one ever mentioned or asked what Mr. Bean was doing in all the source files. On a much later point I even asked the change manager if she liked our Mr. Bean prank. She never even saw it.

### Conclusion

Change Advisory Boards are a total waste of time as no one with the necessary knowledge to have an opinion is represented on the board. Peer reviews and testing practices are by far the most efficient way of catching errors before they make it into production. 

The only situation where it makes sense to have a change advisory board is when the business impact is extremely high. However, in that case, [[The change advisory board should consist of business stakeholders rather than IT]].
