---
title: GitHub Filters
---
### Issues lacking status
```
is:issue -label:”Status: Abandoned” -label:”Status: Awaiting user” -label:”Status: Available” -label:”Status: Blocked” -label:”Status: Accepted” -label:”Status: Completed” -label:”Status: In Progress” -label:”Status: On Hold” -label:”Status: Pending” -label:”Status: Review Needed” -label:”Status: Revision Needed” is:open
```

### Issues lacking priority
```
is:open is:issue -label:”Priority: Critical” -label:”Priority: High” -label:”Priority: Low” -label:”Priority: Medium”
```
