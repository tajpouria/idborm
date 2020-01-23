/**
 * Access idborm.IDB Using idborm binary script:
 *
 * $ node_modules/bin/idborm --serviceworker <PATH_TO_SERVICE_WORKER>
 */

/** "idborm": Following code snippet is required to access the "IDB"*/
importScripts("./idborm.iife.js");
const { IDB } = idborm;

// Initializing dataBase and objectStore
const DB = IDB.init("TodoDataBase", 1, { name: "Todo", options: { keyPath: "id" } });

// Destructors ObjectStore
const { Todo } = DB.objectStores;

self.addEventListener("fetch", async event => {
  const { request } = event;

  if (request.method === "POST") {
    const content = await request.text();
    const newTodo = { id: Date().valueOf(), content, completed: false };

    await Todo.put(newTodo);
  }
});
