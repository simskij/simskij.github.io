# ADR 0001: Initial Project Understanding

**Date:** 2026-02-23
**Status:** Accepted

## Context

This ADR captures the baseline understanding of the simskij.github.io project as
it exists today, before any new work begins. It serves as the foundational
reference for all future decisions.

## Current State

### What it is

A minimal personal landing page / digital vcard hosted on GitHub Pages at
**simme.dev**. The site presents Simon Aronsson's professional identity in a
terminal-inspired aesthetic.

### Tech stack

- Single static HTML file (`index.html`, ~60 lines)
- No build process, no dependencies, no frameworks
- Inline CSS using the Catppuccin Mocha color scheme
- Monospace/terminal visual style with ASCII art and a blinking cursor animation
- GitHub Pages hosting with custom domain via `CNAME`

### File inventory

```
├── CNAME          # Custom domain: simme.dev
├── index.html     # The entire site
└── .gitignore     # Legacy Jekyll/Obsidian excludes
```

### History

The project has gone through three distinct phases, each reflecting a different
idea of what a personal site should be:

1. **Blog era (multiple years, pre-2023):** A traditional blog. Served its
   purpose for a time but eventually lost momentum.

2. **Second brain era (Nov 2023 - Apr 2025):** Pivoted to publishing most of
   an Obsidian vault publicly as a Jekyll-based digital garden. 120+ notes,
   17 blog posts, full-text search, backlinks, reading lists, extensive CSS
   (~3900 lines). The workflows never became habitual — the friction of
   maintaining it meant it was never regularly interacted with.

3. **Vcard era (Apr 2025 - present):** All Jekyll infrastructure and content
   removed in commit `dc493a1` ("replace blog with low-tech vcard"). Reduced
   to a single static HTML page as a placeholder.

The recurring pattern: each iteration either had too much friction or too
little reason to return to it, leading to neglect.

### Design principles (inferred)

- **Minimalism over features** - the pivot from a full knowledge base to a
  single HTML file signals a strong preference for simplicity.
- **Low-tech aesthetic** - terminal-inspired design, ASCII art, monospace fonts.
- **Zero dependencies** - no build tools, no JavaScript, no external resources.
- **Performance by default** - nothing to load means nothing to slow down.

## Decision

Document this understanding as the baseline. All future ADRs will reference
this as the starting point and describe changes relative to it.

## Consequences

- Future work should respect the minimalist, low-tech philosophy unless
  explicitly directed otherwise.
- The `.gitignore` contains stale entries from the Jekyll era that could be
  cleaned up if desired.
- The `docs/adr/` directory is now established for tracking architectural
  decisions going forward.
