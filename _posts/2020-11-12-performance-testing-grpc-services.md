---
title: Performance testing gRPC services
canonical_url: https://k6.io/blog/performance-testing-grpc-services
---

In this article, we'll go through how to use k6 to performance test your gRPC services.

<!--more-->

> ### 📖 What you will learn
> 
> - What gRPC is.
> - How gRPC differs from JSON-based REST.
> - Creating and executing your first gRPC performance test using k6.

## Outline

- [What is gRPC](#what-is-grpc)
- [API Types](#api-types)
- [The proto definition](#the-proto-definition)
- [Getting started](#getting-started)
- [Summary](#summary)
- [See also](#see-also)

## What is gRPC

gRPC is a light-weight open-source RPC framework. It was originally developed by Google, with 1.0 being released in August 2016. Since then, it's gained a lot of attention as well as a wide adoption.

In comparison to JSON, which is transmitted as human-readable text, gRPC is binary, making it both faster to transmit and more compact. In the benchmarks we've seen between gRPC and JSON-based REST, gRPC has proved to be a lot faster than its more traditional counterpart.

[A benchmark by Auth0](https://auth0.com/blog/beating-json-performance-with-protobuf/) reported up to 6 times higher performance, while other benchmarks, like[this one by Alex Pliutau](https://dev.to/plutov/benchmarking-grpc-and-rest-in-go-565) or[this one by Ruwan Fernando](https://medium.com/@EmperorRXF/evaluating-performance-of-rest-vs-grpc-1b8bdf0b22da), suggests improvements of up to 10 times.

For chatty, distributed systems, these improvements accumulate quickly, making the difference not only noticeable in benchmarks, but also by the end-user.

## API types

gRPC supports four different types of RPCs, unary, server streaming, client streaming, and bi-directional streaming. In reality, the messages are multiplexed using the same connection, but in the spirit of keeping things simple and approachable, this is not illustrated in the gRPC service model diagrams below.

### Unary

Unary calls work the same way as a regular function call: a single request is sent to the server which in turn replies with a single response.

[![unary call](https://k6.io/blog/static/c48fc5ca8336d9cd8b98618c4b9d86ec/7842b/grpc-unary.png "unary call")](/blog/static/c48fc5ca8336d9cd8b98618c4b9d86ec/7842b/grpc-unary.png)

### Server Streaming

In server streaming mode, the client sends a single request to the server, which in turn replies with multiple responses.

[![server streaming](https://k6.io/blog/static/fbc08c79e035da81aca99e4bc220f95e/7842b/grpc-server.png "server streaming")](/blog/static/fbc08c79e035da81aca99e4bc220f95e/7842b/grpc-server.png)

### Client Streaming

The client streaming mode is the opposite of the server streaming mode. The client sends multiple requests to the server, which in turn replies with a single response.

[![client streaming](https://k6.io/blog/static/ebdd5a0dedb7bdae80e59ceba69c6b75/7842b/grpc-client.png "client streaming")](/blog/static/ebdd5a0dedb7bdae80e59ceba69c6b75/7842b/grpc-client.png)

### Bi-directional streaming

In bi-directional streaming mode, both the client and the server may send multiple messages.

[![bi-directional streaming](https://k6.io/blog/static/094a57810030c8df50d05a8c87a1dee1/7842b/grpc-bidirectional.png "bi-directional streaming")](/blog/static/094a57810030c8df50d05a8c87a1dee1/7842b/grpc-bidirectional.png)

## The `.proto` definition

The messages and services used for gRPC are described in .proto files, containing[Protocol buffers](https://en.wikipedia.org/wiki/Protocol_Buffers), or protobuf, definitions.

The definition file is then used to generate code which can be used by both senders and receivers as a contract for communicating through these messages and services. As the binary format used by gRPC lacks any self-describing properties, this is the only way for senders and receivers to know how to interpret the messages.

Throughout this article, we'll use the `hello.proto` definition available for download on the[k6 grpcbin website](https://grpcbin.test.k6.io/). For details on how to build your own grpc proto definition, see [this excellent article from the official gRPC docs](https://grpc.io/docs/what-is-grpc/core-concepts/).

```proto
// ./definitions/hello.proto

// based on https://grpc.io/docs/guides/concepts.html

syntax = "proto2";

package hello;

service HelloService {
  rpc SayHello(HelloRequest) returns (HelloResponse);
  rpc LotsOfReplies(HelloRequest) returns (stream HelloResponse);
  rpc LotsOfGreetings(stream HelloRequest) returns (HelloResponse);
  rpc BidiHello(stream HelloRequest) returns (stream HelloResponse);
}

message HelloRequest {
  optional string greeting = 1;
}

message HelloResponse {
  required string reply = 1;
}

```

## Getting started

With k6 v0.29.0, we're happy to introduce a native client for gRPC communication. In this early release, we've settled for providing a solid experience for unary calls. If any of the other modes would be particularly useful for you, we'd love to hear about your use case so we can move it up our backlog.

The current API for working with gRPC in k6 using the native client is as follows:

| Method | Description |
| --- | --- |
| [Client.load(importPaths, ...protoFiles)](https://k6.io/blog/javascript-api/k6-net-grpc/client/client-load-importpaths----protofiles) | Loads and parses the given protocol buffer definitions to be made available for RPC requests. |
| [Client.connect(address [,params])](https://k6.io/blog/javascript-api/k6-net-grpc/client/client-connect-address-params) | Opens a connection to the given gRPC server. |
| [Client.invoke(url, request [,params])](https://k6.io/blog/javascript-api/k6-net-grpc/client/client-invoke-url-request-params) | Makes an unary RPC for the given service/method and returns a [Response](https://k6.io/blog/javascript-api/k6-net-grpc/response). |
| [Client.close()](https://k6.io/blog/javascript-api/k6-net-grpc/client/client-close) | Close the connection to the gRPC service. |

### Creating the test

The gRPC module is a separate package, available from your test script as `k6/net/grpc`. Before we can use it, we first have to create an instance of the client. Instantiating the client, as well as the `.load` operation, is only available during test initialization, ie. directly in the global scope.

```js
import grpc from 'k6/net/grpc';

const client = new grpc.Client();

```

Next, we'll load a `.proto` definition applicable for the system under test. For the purpose of this article, we'll use [k6 grpcbin](https://grpcbin.test.k6.io/). Feel free to change this to whatever you please but keep in mind that you will also need an appropriate `.proto` definition for the server you're testing. The `.load()` function takes two arguments, the first one being an array of paths to search for proto files, and the second being the name of the file to load.

```js
import grpc from 'k6/net/grpc';

const client = new grpc.Client();
client.load(['definitions'], 'hello.proto');

```

Once that is done, we'll go ahead and write our actual test.

```js
import grpc from 'k6/net/grpc';

const client = new grpc.Client();
client.load(['definitions'], 'hello.proto');

export default () => {
  client.connect('grpcbin.test.k6.io:9001', {
    // plaintext: false
  });

  const data = { greeting: 'Bert' };
  const response = client.invoke('hello.HelloService/SayHello', data);

  check(response, {
    'status is OK': (r) => r && r.status === grpc.StatusOK,
  });

  console.log(JSON.stringify(response.message));

  client.close();
  sleep(1);
};

```

So let's walk through this script to make sure we understand what's happening. First, we use the`.connect()` function to connect to our system under test. By default, the client will set `plaintext` to false, only allowing you to use encrypted connections. If you, for any reason, need to connect to a server that lacks SSL/TLS, just flip this setting to `true`.

We then continue by creating the object we want to send to the remote procedure we're invoking. In the case of `SayHello`, it allows us to specify who the greeting should address using the `greeting` parameter.

Next, we invoke the remote procedure, using the syntax `<package>.<service>/<procedure>`, as described in our proto file. This call is made synchronously, with a default timeout of 60000 ms (60 seconds). To change the timeout, add the key `timeout` to the config object of `.connect()` with the duration as the value, for instance `'2s'` for 2 seconds.

Once we've received a response from the server, we'll then make sure the procedure executed successfully. The grpc module includes constants for this comparison which are listed [here](https://k6.io/docs/javascript-api/k6-net-grpc/constants)

Comparing the response status with `grpc.StatusOK`, which is `200 OK` just like for HTTP/1.1 communication, ensures the call was completed successfully.

We'll then log the message in the response, close the client connection, and sleep for a second.

### Executing the test

The test can be executed just like any other test, although you need to make sure you're on at least version `v0.29.0` to have access to the gRPC module. To check this, run the following command:

```bash
$ k6 version
k6 v0.29.0 ((devel), go1.15.3, darwin/amd64)

```

Anything less than `v0.29.0` here, will require you to first update k6. Instructions on how to do that can be found [here](https://k6.io/docs/getting-started/installation).

Once that's out of the way, let's run our test:

```
$ k6 run test.js

          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: /Users/simme/code/grpc/test.js
     output: -

  scenarios: (100.00%) 1 scenario, 1 max VUs, 10m30s max duration (incl. graceful stop):
           * default: 1 iterations for each of 1 VUs (maxDuration: 10m0s, gracefulStop: 30s)

INFO[0000] {"reply":"hello Bert"} source=console

running (00m01.4s), 0/1 VUs, 1 complete and 0 interrupted iterations
default ✓ [======================================] 1 VUs 00m01.4s/10m0s 1/1 iters, 1 per VU

    ✓ status is OK

    checks...............: 100.00% ✓ 1 ✗ 0
    data_received........: 3.0 kB 2.1 kB/s
    data_sent............: 731 B 522 B/s
    grpc_req_duration....: avg=48.44ms min=48.44ms med=48.44ms max=48.44ms p(90)=48.44ms p(95)=48.44ms
    iteration_duration...: avg=1.37s min=1.37s med=1.37s max=1.37s p(90)=1.37s p(95)=1.37s
    iterations...........: 1 0.714536/s
    vus..................: 1 min=1 max=1
    vus_max..............: 1 min=1 max=1

```

From the output, we can now tell that our script is working and that the server indeed responds with a greeting addressed to who, or what, we supplied in our request body. We can also see that our `check` was successful, meaning the server responded with `200 OK`.

## Summary

In this article, we've gone through some of the fundamentals of gRPC and how it works. We've also had a look at the gRPC client introduced in k6 v0.29.0. Last, but not least, we've created a working test script demonstrating this functionality.

And that concludes this gRPC load testing tutorial. Thank you for reading!

## See Also

- [k6 gRPC Module API](https://k6.io/docs/javascript-api/k6-net-grpc)
- [k6 gRPCBin: A simple request/response service for gRPC](https://grpcbin.test.k6.io/), similar to [k6 httpbin](https://httpbin.test.k6.io/).
- [The official website of the gRPC project](https://grpc.io/).
- [Official examples from the gRPC repo on GitHub](https://github.com/grpc/grpc/tree/master/examples).