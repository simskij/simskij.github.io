---
title: "An introduction to Redux and Sagas #1"
---


Before we dive into redux and sagas, it might be nice to get some background. 

## What is Redux?
To quote the readme available over at [https://redux.js.org/](https://redux.js.org/):

> Redux is a predictable state container for JavaScript apps. It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test.
<!--more-->

As stated, Redux is a state container for web applications. It provides a simple interface for dispatching actions to reducers (we’ll get there in a bit) which leads to transitions between states that other components (or Sagas) may react to. The most obvious use case for Redux is to use it together with a frontend framework like React or Angular, which both already have established and mature packages for easy integration.

With that said however, Redux should be considered an architectural pattern rather than a product/library. See [Redux.NET](https://github.com/GuillaumeSalles/redux.NET), [godux](https://github.com/luisvinicius167/godux) and [pydux](https://github.com/usrlocalben/pydux) for implementations in other languages than javascript. 

## Parts

Let's look at an illustration. Your immediate reaction might very well be “well, this does not look that complicated”. Fact of the matter is that it really isn’t. The hardesting about Redux, by far, is getting started.

<img alt="Redux flow illustrated" src="/images/redux-flow.png" style="margin: auto" />

### Store
The **store** is really not that different from the local state we already store in some way in each component or component controller (depending on the framework used). It’s a centralized, preferably immutable, object graph that represents the application.

### Component
The **components** in turn react to the state described by the store. This might take the form of views being rendered, items being visualized in a list, call for actions being available and so forth.

Interactions with these components may in turn dispatch actions back to the “dispatcher” which, in contrast to flux, is something we won’t have to think about as it is provided by the library itself.

### Action
The **action** will then flow through the **reducers** that, according to their filter criterias, may create a new state that replaces the one currently stored. Effort should be put into making sure that **reducers never have any side effects**.

## So, to provide a TL;DR:

* The store contains an object graph representing the current application state.
* The components react to the state and provide opportunities to interact that may spawn actions.
* Actions are passed on to the reducers, which will create a new state to replace the previous
* Repeat

---

## What are Sagas?

With that out of the way, let’s make an attempt on understanding the concept of sagas as well.

A saga consists of one or more generator functions that react to certain actions and as a result performs asynchronous work or produces side effects. I like to think of them as background workers available to offload asynchronous work that traditionally would have been performed by each controller and/or service.

<img alt="Redux flow illustrated" src="/images/redux-saga-flow.png" style="margin: auto" />

### Generator functions

Generators (or generator functions) differ from functions in the sense that they dont necessarily run until completion. Instead one may, as many times as needed, pause execution allowing other code to run.

One thing to note is that a generator that has been paused wont be able to resume execution without being instructed to do so. So how do we go about managing this pause and resume behavior of generator functions?

### The yield keyword

Yield was introduced with ES6 (2015) and may be thought of as the equivalent of return for generator functions.

It pauses the execution of the current generator function and returns a IteratorResult object with the two properties value — which contains the yield return — and done which is a boolean value indicating whether the end of the generator function has been reached or not. The generator will then remain paused until its next() function is called, on which it will continue to execute after the previous yield.

For more on generator functions, give [Dace](undefined) a visit and read his [excellent write-up](https://medium.com/@hidace/javascript-es6-generators-part-i-understanding-generators-93dea22bf1b).

## Conclusion

There’s of course a lot more to talk about regarding redux, sagas and generator functions. However, I hope you’ll find this brief introduction helpful in grasping the core concepts.

In [**part two**](/posts/redux-and-sagas-2), we’ll continue to explore redux and sagas by putting it to practice in a typescript react app.