import IDB from "../../src";

(async (): Promise<void> => {
  // Initializing dataBase
  const DB = await IDB.init("TodoDataBase", { name: "Todo", options: { keyPath: "id" } });

  // Destructors ObjectStore
  const { Todo } = DB.objectStores;

  // Render todos
  const render = async (): Promise<void> => {
    const todoList = document.querySelector(".todo-list");

    const todos = await Todo.entries();

    todos.forEach(([key, value]) => {
      const todoItem = `
    <li data-id="${key}" >
      <div class="view">
        <input class="toggle" type="checkbox" checked="">
        <label>${value.content}</label>
        <button class="destroy"></button>
      </div>
    </li>`;

      todoList.innerHTML += todoItem;
    });
  };

  render();

  // Adding todo
  const input = document.querySelector(".new-todo");

  input.addEventListener("keyup", async (event: KeyboardEvent) => {
    if (event.keyCode === 13) {
      await Todo.put({ id: Math.random(), content: input.value, done: false });
      await render();
    }
  });
})();
