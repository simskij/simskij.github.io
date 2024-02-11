---
title: Using k6 for Distributed Tracing
---


Given that k6 does load generation really well, and has scripting support, it should be a nice fit for distributed tracing as well. [[Daniel González Lopes]] showed in his presentation about distributed tracing that it indeed works beautifully. 

One thing that tripped me up however, was that he had to extend the k6 core to do this. According to both Daniel and [[Mihail Stoikov]], it wouldn't be possible without extending the k6 core. After a couple of hours of struggling, I finally managed to get it working without any core modifications, and published the code at https://github.com/k6io/xk6-distributed-tracing.