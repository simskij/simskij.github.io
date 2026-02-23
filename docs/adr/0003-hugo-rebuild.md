# ADR 0003: Rebuild with Hugo

## Status

Accepted

## Context

The site needs to serve four goals (ADR 0002): hassle-free blogging, resume,
virtual business card, and being fun to tinker with. The single `index.html`
vcard satisfies the business card goal but nothing else. Adding content pages
to a single HTML file doesn't scale, and the lack of structure discourages
blogging.

## Decision

Rebuild the site using Hugo with a custom theme (`themes/simme/`). No
third-party themes — the terminal/Catppuccin aesthetic carries forward in a
hand-built theme, and tinkering with the theme itself is part of the fun.

Deployment moves from a static `index.html` committed to the repo to a GitHub
Actions workflow that builds with Hugo and deploys to GitHub Pages.

## Consequences

- **Blogging is now possible** — `content/posts/` with Markdown files, git push
  to publish
- **Resume and links pages** are first-class content sections
- **Custom theme** means full control but also full responsibility for
  maintenance
- **Build step required** — the site no longer works by just serving the repo
  root; GitHub Actions handles this transparently
- **Hugo dependency** — contributors (just me) need Hugo installed locally for
  previewing, but the CI handles production builds
