---
title: Managing repos at scale
date: 2023-02-16
---

Managing repository settings at scale on GitHub is often a hassle. There are many reasons as to why that is
the case, ranging anywhere from company policies to just the strength in numbers.

While you might look at something like organizations as something to relieve your pain, that comes with a 
whole new set of problems, like:

- What if some repository shouldn't have the organization level files or secrets you are pushing out?
- What if you want to have different branch-protection rules, policies, or issue labels, on different set of repos?

Let me paint a picture...

### The before

So, in `the before`, I managed a set of repos over at Canonical related to observability. The list of repos
that I managed quickly grew quite large, as we started to flesh out our stack and the things it was capable of.
After a year or so, I finally found myself in a situation where my team managed a small set of **almost 50 repos**.

As you might know, we're heavily into open-source, and the observability stack isn't any exception, so things 
like issue templates, labels, secrets, and what not, really makes a difference both to how smoothly we're able 
to run things, and how welcoming a repo is for a first-time contributor.

Imagine having to do an issue template update across all these repositories. You would do the change, open a 
PR and ask for reviews before comitting it. Now imagine replicating this 50 times, across all the repos, with 
potentially different reviewers having different opinions on different parts of the change. 🤯

### The before after the before but before the after

This, naturally, felt like it must have been a solved problem already. I started window-shopping GitHub for different
solutions, and finally stumbled upon [`roobre/reposettings`](https://github.com/txqueuelen/reposettings) which allowed 
us to accomplish some of these tasks from a central location by running a script. Excellent, one step closer to
automation nirvana!

We ran happily with this setup for a while, syncing labels and making sure review policies and branch protection
rules were being applied across all of our repos. We quite quickly started to notice some rough edges however, and
it just felt like this wasn't a sustainable way of doing it long-term. Support for certain operations were missing
from the python client library used became a headache. All in all, it felt like while it was a really competent tool,
it had a single use case in mind, and we had grown behind that.

We started talking about whether to fork it and start to contribute extended functionality upstream, and was so close
to putting our shovels to the ground and get started.

### The actual after
Suddenly, with no prior warning, our dear colleague [@merkata](https://github.com/merkata) published a blog post 
about his recent work exploring the use of terraform to accomplish something similar to what we had.

He had gotten a really promising proof of concept working to the point where I got really excited about it and spent 
a couple of hours leasure-hacking (yes, that's a real thing) on what it would look like if we instead managed to
do everything `reposettings` could do using terraform.

Turned out [the terraform provider for github](https://registry.terraform.io/providers/integrations/github/latest/docs)
is quite capable. Stringing together some terragrunt list of repos with a terraform module with reasonable defaults
got us all of the functionality we already had, but allowed for some quite impressive future improvements as well!

```terraform
# ...

locals {
  repos = {
    "charm-relation-interfaces": {
        homepage: "https://canonical.github.io/charm-relation-interfaces/",
        description: <<-EOT
          Opinionated and standardized interface specifications
          for charmed operator relations.
        EOT
    },
    "alertmanager-k8s-operator": {
        homepage: "https://charmhub.io/alertmanager-k8s"
        description: <<-EOT
          This charmed operator automates operation procedures of
          Alertmanager, the alerting component of Prometheus and
          Loki, among others.
        EOT
    },
    # ...
  }
  labels = [
    { name: "Status: Blocked",          color: "d93f0b" },
    { name: "Status: Cannot Reproduce", color: "3f3887" },
    { name: "Status: Confirmed",        color: "bfd4f2" },
    { name: "Status: Draft",            color: "81b056" },
    { name: "Status: Duplicate",        color: "cfd3d7" },
    { name: "Status: Help Wanted",      color: "008672" },
    { name: "Status: Testing Needed",   color: "76ea93" },
    { name: "Status: Triage",           color: "d15141" },
    { name: "Status: Won't Fix",        color: "ffffff" }
    # ...
  ]
}
```

```terraform
# ...

resource "github_repository" "this" {
  name                   = var.name 
  homepage_url           = var.homepage_url
  description            = replace(chomp(var.description), "\n", " ")

  allow_merge_commit     = false
  allow_squash_merge     = true
  allow_rebase_merge     = false
  allow_auto_merge       = false
  allow_update_branch    = true
  delete_branch_on_merge = true

  
  has_issues             = true
  has_discussions        = false
  has_projects           = var.has_projects 
  has_wiki               = false
  has_downloads          = false
  
  vulnerability_alerts   = true

  lifecycle {
      ignore_changes = [ topics, visibility, pages ]
  }
}

resource "github_issue_label" "label" {
  for_each = {
      for l in var.labels : l.name => l
  }
  repository = var.name
  name = each.value.name
  color = each.value.color
}
```

Look at that! I've redacted some var declarations and templating silliness from the snippets above,
so if you'd like to check the solution out in it's entirety, jump over to [the github repo](https://github.com/canonical/enterprise-engineering-repos/).

All in all, it started to feel like we approached something useful and scalable. As we uncover new config options that might
need to be tweaked on a per-repo level, we'll extend the amount of available input variables, while providing defaults that make
sense to us as a general rule-of-thumb. 

### The future after the after

Let's fast-forward a bit here, and think about what this will look like if we continue investing some time into the project. Not only
will we have a peer-reviewed process for changing repository settings, but we'll also be able to:

- Enforce and propagate changes to common files like issue templates, code owners, and similar.
- Extend the project to cater to the needs of other teams, outside of observability.
- Extend the type of resources we provide reasonable defaults for, effectively giving us GaC (Github as Code) for other resources like teams.