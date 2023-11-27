---
title: GitHub
---
GitHub is the company behind the popular code collaboration service [[GitHub.com]]. In 2018, GitHub got acquired by [[Microsoft]]. So far, this has not had any significant impact on how GitHub operates visible to external spectators.

### Useful filters

#### Issues lacking status
```
is:issue -label:”Status: Abandoned” -label:”Status: Awaiting user” -label:”Status: Available” -label:”Status: Blocked” -label:”Status: Accepted” -label:”Status: Completed” -label:”Status: In Progress” -label:”Status: On Hold” -label:”Status: Pending” -label:”Status: Review Needed” -label:”Status: Revision Needed” is:open
```

#### Issues lacking priority
```
is:open is:issue -label:”Priority: Critical” -label:”Priority: High” -label:”Priority: Low” -label:”Priority: Medium”
```

