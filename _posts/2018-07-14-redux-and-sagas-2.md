---
title: "An introduction to Redux and Sagas #2"
---

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

    $ npm install -D redux react-redux @types/react-redux

With that out of the way, let’s create two component that will be our redux consumers (as well as dispatchers). We’ll do this using the [Presentation/Container component pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) as this will make for cleaner, more maintainable code. If you don’t like this pattern, feel free to go ahead and just put everything together, but I strongly suggest that you at least try it.

![](https://cdn-images-1.medium.com/max/2000/1*1lylSUFjKv8SdGpuOVcWVQ.png)

Our app will consist of two components, beside the root app component, one for adding new todo items, which we’ll call** the todo adder**, and one for listing the existing todo items, which we’ll call** the todo list**. There’s nothing special with this layout:

* **.component.tsx* holds the presentation component, which is a fancy way of saying *all logic related to what we display to the user*.

* **.container.tsx* is a container component, which connects the state and dispatch actions to our presentation component, *isolating any non-presentational content from the rendered component*.

* *index.tsx* re-exports the container component. This is purely for convenience as it lets us use shorter import paths.

I won’t go into detail on these components as it’s mostly common react code. If you feel insecure about anything in this code, feel free to revisit [the reactjs documentation](https://reactjs.org/docs/getting-started.html) at any time.

### The Todo Adder

```jsx
import * as React from "react";
import { Component } from "react";

export
  class TodoAdderComponent
  extends Component<ITodoAdderProps> {

  public state: any = {
    title: '',
  }

  public render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" value={this.state.title} onChange={this.handleChange} />
        <button type="submit">
          Add
        </button>
      </form>
    );
  }

  private handleSubmit = (event: any) => {
    const title = this.state.title;
    if (title) {
      this.props.onSubmit(this.state.title)
      this.setState({ title: '' })
    }
    event.preventDefault();
  }

  private handleChange = (event: any) => {
    this.setState({ title: event.target.value })
  }
}

interface ITodoAdderProps {
  onSubmit: (title: string) => any
}
```

```jsx
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { addTodo } from "../../actions";
import { TodoAdderComponent } from "./todo-adder.component";


const mapDispatchToProps = (dispatch: Dispatch) => ({
  onSubmit: (title: string) => dispatch(addTodo(title))
});

export const TodoAdder = connect
  (null, mapDispatchToProps)
  (TodoAdderComponent);
```

### The Todo List

{% raw %}
```jsx
import * as React from "react";

import { Component } from "react";
import { ITodo } from "../../models/todo";

export class TodoListPresentationComponent extends Component<ITodoListProps> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div>
        <h1>Things to do:</h1>
        {this.props.todos.length > 0 ? this.renderList() : this.renderPlaceholder()}
      </div>
    );
  }

  private renderList = () => (
    <ul id="todoList" style={styles.list}>
      {this.props.todos.map(this.renderTodo)}
    </ul>
  );

  private renderTodo = (todo: ITodo) => (
    <li
      key={todo.id}
      style={{ textAlign: "left", cursor: 'pointer', ...(todo.done ? styles.todoDone : null) }}
      onClick={this.props.onTodoClick.bind(this, todo.id)}
    >
      {todo.title}
    </li>
  );

  private renderPlaceholder = () => (<div style={styles.placeholder}>The list is empty</div>);
}

export interface ITodoListProps {
  onTodoClick: (id: number) => void;
  todos: ITodo[];
}

const styles = {
  list: {
    margin: "10px auto 10px auto",
    width: "200px"
  },
  placeholder: {
    margin: '10px 0 10px 0'
  },
  todoDone: {
    textDecoration: "line-through"
  },
};
```
{% endraw %}

```jsx
import { connect } from "react-redux";

import { toggleTodo } from "../../actions";
import { TodoListPresentationComponent } from "./todo-list.component";

const mapStateToProps = (state: any) => ({
  todos: state
});

const mapDispatchToProps = (dispatch: any) => ({
  onTodoClick: (id: number) => dispatch(toggleTodo(id))
})

export const TodoList = connect
  (mapStateToProps, mapDispatchToProps)
  (TodoListPresentationComponent);
```

## The reducer

The purpose of the reducer is to, based on the dispatched action and the current state, create a new state that our components in turn may consume. Although it’s not required, I strongly suggest that you keep the state immutable.

Instead of manipulating the existing state, create a new state with the changes you’d like to perform.

```jsx
import { ActionType } from "../enums/action-types";
import { ITodo } from "../models/todo";

let nextId: number = 0;

const addTodo = (state: any, action: any) => [
  ...state,
  {
    done: false,
    id: nextId++,
    title: action.title
  }
];

const toggleTodo = (state: any, action: any): any => [
  ...state.map((todo: ITodo) =>
      todo.id === action.id ? { ...todo, done: !todo.done } : todo
  )];

export const todoReducer = (state: any = [], action: any) => {
  switch (action.type) {
    case ActionType.AddTodo:
      return addTodo(state, action);
    case ActionType.ToggleTodo:
      return toggleTodo(state, action);
    default:
      return state;
  }
}
```


Let’s go ahead and implement our enum as well as action creators for our two actions.

```jsx
export enum ActionType {
  AddTodo,
  ToggleTodo,
};
```

```jsx
import { ActionType } from "../enums/action-types";

export const addTodo = (title: string) => ({
  title,
  type: ActionType.AddTodo
});
```

```jsx
import { ActionType } from "../enums/action-types";

export const toggleTodo = (id: number) => ({
  id,
  type: ActionType.ToggleTodo,
});
```

In most introductions to Redux I’ve seen the scope has been limited to javascript. This is one of the places, albeit just a small one, where typescript really makes a difference to improve both readability and maintainability by introducing enums, which we may use to distinguish actions from each other.

As the last part of the introduction to redux,we’ll need to create a **store** and wire it up with our app:

```jsx
import * as React from 'react';
import './App.css';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { TodoAdder } from './components/todo-adder';
import { TodoList } from './components/todo-list';
import { todoReducer } from './reducers/todos';


const rootStore = createStore(todoReducer);

class App extends React.Component {
  public render() {
    return (
      <Provider store={rootStore}>
        <div className="App">
          <TodoList />
          <TodoAdder />
        </div>
      </Provider>
    );
  }
}

export default App;
```

With that out of the way, let’s take a look at what we’ve created.

<img alt="saga demo" src="https://cdn-images-1.medium.com/max/2000/1*ZZtTu2otobgiQ37lQ9-2og.gif" style="margin: auto" />

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

```jsx
import { call, put, takeEvery } from 'redux-saga/effects';
import { IAddTodo } from "../actions/add-todo";
import { addTodoDone} from '../actions/add-todo-done';
import { ActionType } from "../enums/action-types";

const randomPictureUrl = 'https://picsum.photos/25/20/?random';
let nextNumber = 0;

function* addTodoAsync(action: IAddTodo): IterableIterator<any> {
  const { url } = yield call(fetch, randomPictureUrl);
  yield put(addTodoDone(nextNumber++, action.title, url));
}

export function* watchAddTodoSaga() {
  yield takeEvery(
    ActionType.AddTodo as any,
    addTodoAsync as any
  );
}
```

So, what we’re doing here is that we’re instructing our generator function (saga) to take every action of the type AddTodo and pass it to the function addTodoAsync. This function in turn calls the picsum service and gets a random image of which we store the url in the todo item.

We’ll then assign an ID for the todo item from the nextNumber variable and then finally increment it so that we’re prepared for the next action. We also need to modify our reducer so that it only adds todos on actions with the action type AddTodoDone:

```jsx
export enum ActionType {
  AddTodo = 'ADD_TODO',
  AddTodoDone = 'ADD_TODO_DONE',
  ToggleTodo = 'TOGGLE_TODO',
};
```

```jsx
import { ActionType } from "../enums/action-types";

export const addTodoDone = (id: number, title: string, imageUrl: string): IAddTodoDone => ({
  id,
  imageUrl,
  title,
  type: ActionType.AddTodoDone
});

export interface IAddTodoDone {
  id: number,
  imageUrl: string,
  title: string,
  type: ActionType,
};
```

```jsx
export interface ITodo {
  id: number;
  title: string;
  done: boolean;
  imageUrl?: string;
}
```

```jsx
import { ActionType } from "../enums/action-types";
import { ITodo } from "../models/todo";

const addTodo = (state: any, action: any) => [
  ...state,
  {
    done: false,
    id: action.id,
    imageUrl: action.imageUrl,
    title: action.title,
  }
];

const toggleTodo = (state: any, action: any): any => [
  ...state.map((todo: ITodo) =>
      todo.id === action.id ? { ...todo, done: !todo.done } : todo
  )];

export const todoReducer = (state: any = [], action: any) => {
  switch (action.type) {
    case ActionType.AddTodoDone:
      return addTodo(state, action);
    case ActionType.ToggleTodo:
      return toggleTodo(state, action);
    default:
      return state;
  }
}
```

…and wire up our app to use the redux saga middleware.

```jsx
import * as React from 'react';
import './App.css';

import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga'

import { TodoAdder } from './components/todo-adder';
import { TodoList } from './components/todo-list';
import { todoReducer } from './reducers/todos';
import { watchAddTodoSaga } from './sagas/add-todo-saga';

const middleware = createSagaMiddleware()
const rootStore = createStore(
  todoReducer,
  applyMiddleware(middleware));

middleware.run(watchAddTodoSaga);

class App extends React.Component {
  public render() {
    return (
      <Provider store={rootStore}>
        <div className="App">
          <TodoList />
          <TodoAdder />
        </div>
      </Provider>
    );
  }
}

export default App;
```

As a last step, modify the renderTodo function of the todo-list-component to show the images as well:

{% raw %}
```jsx
private renderTodo = (todo: ITodo) => (
    <li
      key={todo.id}
      style={{
        display: 'flex',
        textAlign: 'left',
        ...(todo.done
          ? styles.todoDone
          : null)
      }}
      onClick={this.props.onTodoClick.bind(this, todo.id)}
    >
      <div style={styles.todoImage}>
        <img src={todo.imageUrl} style={styles.image} />
      </div>
      <div style={styles.todoTitle}>
        <span>
          {todo.title}
        </span>
      </div>
    </li>
  );
```
{% endraw %}

## Stop — Demo time!

<img alt="saga demo" src="https://cdn-images-1.medium.com/max/2000/1*aO9WI6yW1bSuqJDdyBQ6yg.gif" style="margin: auto" />

There it is! Our finished demo, using both redux and sagas! The demo source code is [available in its entirety on GitHub](https://github.com/simskij/medium-react-redux-saga-demo). It goes without saying that this is not production grade code and that we’ve simplified things **a lot** by skipping error handling, loading indicators etc. but I hope that it at least got you curious about further experimentation.