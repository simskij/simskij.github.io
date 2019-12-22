
# An introduction to Redux and Sagas Pt. 2

(If you haven’t already; you most likely want to start with the first part of the article before continuing)

In this part, we’ll set up a react app with redux and make it work with some simple actions. As I’m a big advocate of typescript and its superior readability; we’ll go ahead and use that as well.

## Creating the app

So let’s get started by creating a react app using the typescript template. If you dont have the create-react-app cli already, start with installing it:

    $ npm install -g create-react-app

Then create a react app with the typescript template.

    $ create-react-app demo-app --scripts-version=react-scripts-ts

What you’ll end up is a small react template:

![](https://cdn-images-1.medium.com/max/2028/1*2U-GoQvitCs2CamM1I7LoA.png)

You can run the app on a local dev server by typing npm start. Then open a browser and go to [http://localhost:3000](http://localhost:3000) to check it out.

## Adding Redux

To get started with Redux, we first need to add some additional packages. Go ahead and type the following into your terminal to add both the packages and some types.

    $ npm install -D redux react-redux [@types/react-redux](http://twitter.com/types/react-redux)

With that out of the way, let’s create two component that will be our redux consumers (as well as dispatchers). We’ll do this using the [Presentation/Container component pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) as this will make for cleaner, more maintainable code. If you don’t like this pattern, feel free to go ahead and just put everything together, but I strongly suggest that you at least try it.

![](https://cdn-images-1.medium.com/max/2000/1*1lylSUFjKv8SdGpuOVcWVQ.png)

Our app will consist of two components, beside the root app component, one for adding new todo items, which we’ll call** the todo adder**, and one for listing the existing todo items, which we’ll call** the todo list**. There’s nothing special with this layout:

* **.component.tsx* holds the presentation component, which is a fancy way of saying *all logic related to what we display to the user*.

* **.container.tsx* is a container component, which connects the state and dispatch actions to our presentation component, *isolating any non-presentational content from the rendered component*.

* *index.tsx* re-exports the container component. This is purely for convenience as it lets us use shorter import paths.

I won’t go into detail on these components as it’s mostly common react code. If you feel insecure about anything in this code, feel free to revisit [the reactjs documentation](https://reactjs.org/docs/getting-started.html) at any time.

### The Todo Adder

<iframe src="https://medium.com/media/99a40c067a69b8fac3b2dd72ac60b7c2" frameborder=0></iframe>

<iframe src="https://medium.com/media/a131daeedb1a21335ec8709d8c09851e" frameborder=0></iframe>

### The Todo List

<iframe src="https://medium.com/media/0169d9002aec80113dc9ce81e89539dd" frameborder=0></iframe>

<iframe src="https://medium.com/media/18e41547ba04ba1b78972ab2de2f5545" frameborder=0></iframe>

## The reducer

The purpose of the reducer is to, based on the dispatched action and the current state, create a new state that our components in turn may consume. Although it’s not required, I strongly suggest that you keep the state immutable.

Instead of manipulating the existing state, create a new state with the changes you’d like to perform.

<iframe src="https://medium.com/media/555d5cdb3dab6f249aa6dc274a0f0e80" frameborder=0></iframe>

Let’s go ahead and implement our enum as well as action creators for our two actions.

<iframe src="https://medium.com/media/df7417f7e433d7e86e4100e849b7d114" frameborder=0></iframe>

In most introductions to Redux I’ve seen the scope has been limited to javascript. This is one of the places, albeit just a small one, where typescript really makes a difference to improve both readability and maintainability by introducing enums, which we may use to distinguish actions from each other.

As the last part of the introduction to redux,** **we’ll need to create a **store** and wire it up with our app:

<iframe src="https://medium.com/media/1bd002d49ebc09e703729a9da99663b8" frameborder=0></iframe>

With that out of the way, let’s take a look at what we’ve created.

![](https://cdn-images-1.medium.com/max/2000/1*ZZtTu2otobgiQ37lQ9-2og.gif)

### Summary

To summarize this part of the article, let’s go through what we’ve done so far:

* We’ve added a simple redux store to keep track of our global application state.

* We’ve added a reducer that handles add and toggle actions.

* We’ve bound state data to components

* We’ve dispatched actions from our components to create new global state.

## And now; Sagas

Now, what if we wanted to do something asynchronously as a part of this application? Let’s say our tasks had to go through some server-side crunching before they would be completely ready. **Sagas to the rescue!**

### So, what will be doing?

Going into sagas in detail would be quite an endevour, probably better done [by someone else somewhere else](https://redux-saga.js.org/).

Just to give you a feel of how sagas can be used, we’ll make the addition of new tasks asynchronous and make it use sagas to create our new todo tasks.

To make the example feel a little bit more “alive”, we’ll also use [lorem picsum](https://picsum.photos/) to add a randomly selected image to each task.

Let’s start by installing the needed packages:

    $ npm install -D redux-saga @types/redux-saga

### Creating the Saga

Then we’ll go ahead and create our actual saga:

<iframe src="https://medium.com/media/23205342ae9d60c3983b953bd44d1d0e" frameborder=0></iframe>

So, what we’re doing here is that we’re instructing our generator function (saga) to take every action of the type AddTodo and pass it to the function addTodoAsync. This function in turn calls the picsum service and gets a random image of which we store the url in the todo item.

We’ll then assign an ID for the todo item from the nextNumber variable and then finally increment it so that we’re prepared for the next action.

We also need to modify our reducer so that it only adds todos on actions with the action type AddTodoDone. ..

<iframe src="https://medium.com/media/b99b960327b3e0e805eb8c3648ffca26" frameborder=0></iframe>

…and wire up our app to use the redux saga middleware.

<iframe src="https://medium.com/media/a5ff192e0bd4218ce4dff0ba9a5f8f6f" frameborder=0></iframe>

As a last step, modify the renderTodo function of the todo-list-component to show the images as well:

<iframe src="https://medium.com/media/3d4bb97802b4ab18b507ff7e44d45018" frameborder=0></iframe>

## Stop — Demo time!

![](https://cdn-images-1.medium.com/max/2000/1*aO9WI6yW1bSuqJDdyBQ6yg.gif)

There it is! Our finished demo, using both redux and sagas! The demo source code is [available in its entirety on GitHub](https://github.com/simskij/medium-react-redux-saga-demo). It goes without saying that this is not production grade code and that we’ve simplified things a lot** **by skipping error handling, loading indicators etc. but I hope that it at least got you curious about further experimentation.

## Thanks for reading! 🙏

I’d love your feedback, so feel free to get in touch in the comments below. If you enjoyed this article press the clap button below and make me a happy camper. Also, thanks to Nils Måsén for helping with the edit.
