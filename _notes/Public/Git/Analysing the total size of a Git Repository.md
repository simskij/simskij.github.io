---
title: Analysing the total size of a Git Repository
---
Keeping track of the total size of a git repository can be challenging, especially since big files often linger further down the tree without being visible from `HEAD`. 

This is especially useful when  [[Deep cleaning Git Repositories]].
## Using git-sizer

```sh
$ brew install git-sizer
```

Computes various size metrics for a Git repository, flagging those that might cause you problems or inconvenience. In some cases, we've been able to identify a small number of files that would reduce git project sizes as much as 60-70%.
