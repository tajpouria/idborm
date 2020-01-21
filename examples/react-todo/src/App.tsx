import React from "react";
import { IDB, Entry } from "../../../lib";

import "./App.css";

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

  React.useEffect(() => {
    Todo.entries().then(entries => setTodos(entries));
  }, [todos]);

  return (
    <body>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            name="newTodo"
            onChange={event => setValues({ newTodo: event.target.value })}
            onKeyDown={async event => {
              if (event.keyCode === 13 && values.newTodo) {
                const newTodo = { id: Date().valueOf(), content: values.newTodo, completed: false };

                await Todo.put(newTodo);

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
              ? todos.reverse().map(([key, value]) => (
                  <li key={key as string}>
                    <div className="view">
                      <input data-id={key} className="toggle" type="checkbox" />
                      <label>{value.content}</label>
                      <button data-id={key} className="destroy" />
                    </div>
                  </li>
                ))
              : null}
          </ul>
        </section>
        <footer className="footer">
          <span className="todo-count"></span>
          <button className="clear-completed">Clear completed</button>
        </footer>
      </section>
      <footer className="info">
        <p>
          A simple <a href="https://github.com/tajpouria/idborm">idborm</a> example by
          <a href="https://github.com/tajpouria">Pouria Tajdivand</a>
        </p>
        <p>
          Extended from <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </body>
  );
};

export default App;

// ${value.completed ? "checked" : ""}
