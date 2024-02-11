---
title: Deep cleaning Git Repositories
---
While [[Analysing the total size of a Git Repository]], you will sometimes come to the conclusion that 

Deep cleaning git repositories usually requires you to go through the whole commit history, searching for big and/or junk files further down the tree. One tool that may assist you in analysing the health of your git repo is [`git-repo-analysis`](https://github.com/larsxschneider/git-repo-analysis).

## Analysis

```shell
$ git cat-file —batch-all-objects —batch-check
$ git rev-list —all —objects
```

`git-find-large-files` does this automatically and sorts them by size.

## Purge

```shell
$ git filter-branch —index-filter \
    ‘git rm —cached —ignore-unmatch tool.exe’ — \
    —all
```

`git-purge-files` does this considerably faster.
[^1]: 