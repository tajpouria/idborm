import React from "react";
import { IDB, Entry } from "idborm";

import "./App.css";


import idbormReactTodoIntro from "./assets/idbormReactTodoIntro.png";

interface Todo {
  id: string;
  content: string;
  completed: boolean;
}

const App: React.FC = () => {
  // Initializing dataBase and objectStore
  const DB = IDB.init("TodoDataBase", 1, { name: "Todo", options: { keyPath: "id" } });

  // Destructors ObjectStore
  const { Todo } = DB.objectStores;

  const [values, setValues] = React.useState({ newTodo: "" });
  const [todos, setTodos] = React.useState<Entry<Todo>[]>([]);

  const updateTodos = async () => {
    const entries = await Todo.entries();

    setTodos(entries.reverse());
  };

  React.useEffect(() => {
    updateTodos();
  });

  return (
    <body>
      <section className="todoapp">
        <header className="header">
          <img src={idbormReactTodoIntro} className="intro" alt="how it's works" />
          <p className="intro__text">
            A simple example in order to interact with <a href="https://tajpouria.github.io/idborm/">idborm</a> API on{" "}
            <b>Application</b> and&nbsp;<b>serviceworker</b>; obviously no body use this pattern in real world
            applications!!
          </p>
          <hr />
          <input
            name="newTodo"
            value={values.newTodo}
            onChange={event => setValues({ newTodo: event.target.value })}
            onKeyDown={async event => {
              /**
               * Adding todo
               *
               * 1. Send a fake request
               * 2. Request body received by service worker ("src/public/serviceworker.js") fetch lifeCycle
               * 3. Adding request body as new todo to database
               */

              if (event.keyCode === 13 && values.newTodo) {
                await fetch("ADD_TODO", { method: "POST", body: values.newTodo });

                await updateTodos();

                setValues({ newTodo: "" });
              }
            }}
            className="new-todo"
            placeholder="What needs to be done?"
          />
        </header>
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>

          <ul className="todo-list">
            {todos.length
              ? todos.map(([key, todo]) => (
                  <li key={key as string}>
                    <div className="view">
                      <input
                        className="toggle"
                        type="checkbox"
                        checked={todo.completed}
                        onClick={async () => {
                          // Manipulating todo

                          const targetTodo = await Todo.get(key);

                          await Todo.put({ ...targetTodo, completed: !targetTodo.completed });

                          await updateTodos();
                        }}
                      />

                      <label>{todo.content}</label>

                      <button
                        className="destroy"
                        onClick={async () => {
                          // Removing todo

                          await Todo.delete(key);

                          await updateTodos();
                        }}
                      />
                    </div>
                  </li>
                ))
              : null}
          </ul>
        </section>
        <footer className="footer">
          <span className="todo-count"></span>
          <button
            className="clear-completed"
            onClick={async () => {
              // Async iterator

              await Todo.iterate(([key, value]) => {
                if (value.completed) {
                  return Todo.delete(key);
                }
              });

              await updateTodos();
            }}
          >
            Clear completed
          </button>
        </footer>
      </section>

      <footer className="info">
        <p>
          A simple <a href="https://github.com/tajpouria/idborm">idborm</a> example by
          <a href="https://github.com/tajpouria"> Pouria Tajdivand</a>
        </p>
        <p>
          Extended from <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </body>
  );
};

export default App;
