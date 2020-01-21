import { IDB } from "../../lib";

(async (): Promise<void> => {
  // Initializing dataBase and objectStore
  const DB = IDB.init("TodoDataBase", 1, { name: "Todo", options: { keyPath: "id" } });

  // Destructors ObjectStore
  const { Todo } = DB.objectStores;

  const render = async (): Promise<void> => {
    // Render todos
    const todoList = document.querySelector(".todo-list");

    const todos = await Todo.entries();

    todoList.innerHTML = "";

    todos.reverse().forEach(([key, value]) => {
      const todoItem = `
      <li>
        <div class="view">
          <input data-id="${key}" class="toggle" type="checkbox" ${value.completed ? "checked" : ""}>
          <label>${value.content}</label>
          <button data-id="${key}" class="destroy"></button>
        </div>
      </li>`;

      todoList.innerHTML += todoItem;
    });

    // Removing todo
    const destroyButtons = document.querySelectorAll(".destroy");

    if (destroyButtons.length) {
      destroyButtons.forEach(destroy => {
        destroy.addEventListener("click", async (event: MouseEvent) => {
          const id = (event.target as any).getAttribute("data-id");

          await Todo.delete(id);

          await render();
        });
      });
    }

    // Manipulating todo
    const toggleButtons = document.querySelectorAll(".toggle");

    if (toggleButtons.length) {
      toggleButtons.forEach(toggle => {
        toggle.addEventListener("click", async (event: MouseEvent) => {
          const id = (event.target as any).getAttribute("data-id");

          const targetTodo = await Todo.get(id);

          await Todo.put({ ...targetTodo, completed: !targetTodo.completed });

          await render();
        });
      });
    }

    // Async iterator
    const clearCompleted = document.querySelector(".clear-completed");

    clearCompleted.addEventListener("click", async () => {
      await Todo.iterate(([key, value]) => {
        if (value.completed) {
          return Todo.delete(key);
        }
      });

      await render();
    });
  };

  // Adding todo
  const input: HTMLInputElement = document.querySelector(".new-todo");

  input.addEventListener("keyup", async (event: KeyboardEvent) => {
    if (event.keyCode === 13 && input.value) {
      await Todo.put({ id: Date().valueOf(), content: input.value, completed: false });

      await render();

      input.value = "";
    }
  });

  await render();
})();
