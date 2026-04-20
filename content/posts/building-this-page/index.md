---
title: "How I built this page"
date: 2026-02-23
tags:
  - Development
  - Writing
summary: |
  This site has needed a facelift for years. Not because the technology was outdated, but because 
  every previous version of this blog eventually died. Quietly.
description: |
  I've started blogs before. Many of them. They all followed the same lifecycle: excitement → a few posts → silence. Over the years, those genuine attempts quietly turned into a blog graveyard. Apparently, enthusiasm alone isn't a sustainable publishing system.
---

## What went wrong before

Before touching the implementation, I wanted to clarify the goals — mostly to avoid the same problems as before. Specifically:

- Publishing felt like work
- There was too much maintenance involved
- The workflow was too dependent on tools and clunky integrations
- Focus drifted away from the content itself

From that came a few design goals:

### Minimal friction

Writing and publishing should have minimal friction. If publishing is annoying, it simply won't happen.

### Worth coming back to

The project should be worth coming back to. Not necessarily for readers, though that would of course be a bonus. Rather for me — encouraging me to refine it and write more. It should pull me back in, not push me away.

## What I did different this time

### Agentic

Instead of wiring everything together myself, I let AI agents generate most of the glue code.

With that my role becomes more reviewer than implementer: I write specifications, the agent proposes changes, and I approve them before they land. For this I’m using Claude, specifically the Opus 4.6 model through Claude Code.

I’ll cover that in more detail in a later post.

### Tech Stack

The obvious choice would be to go with something like Wordpress, or some other hosted blog platform. It solves a lot of problems — mostly problems I don't really have.

What I really want is:

- Writing in Markdown, since that’s already how I write most things.
- A minimal workflow. Publishing should be automated so I can focus on writing instead of logging into UIs, formatting posts, managing schedules, or thinking about SEO.
- Something that won't break in six months.

I briefly considered building a small CMS, but quickly realized it would come with far too much maintenance overhead, thus jeopardizing the goal of making it _worth coming back to_.

Instead, I opted for a Static Site Generator, allowing me to write my content in Markdown, which I was already doing anyway. For me, the obvious choice was Hugo, as I already have experience with it and generally like working in Go.

## Outcome

The first version took about an hour to put together — which is exactly the point. If publishing ever starts feeling heavy again, the whole experiment has already failed.
