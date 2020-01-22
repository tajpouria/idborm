# IDBORM &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/tajpouria/idborm/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/idborm?style=flat)](https://www.npmjs.com/package/idborm) [![Build Status](https://travis-ci.org/tajpouria/idborm.svg?branch=master)](https://travis-ci.org/tajpouria/idborm) [ ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg) ](#Contribute!)

### [ Homepage ](https://tajpouria.github.io/idborm/)

A super simple and minimalist ORM built on top of IndexedDB powered by [ idb ](https://github.com/jakearchibald/idb) that makes IndexedDB in bot **service worker** an **application**

## Table of Contents

- [ Installation ](#Installation)
- [configuration with service worker](#configuration-with-service-worker)
- [API](#api)
  - [ init ](#init)
  - [ ObjectStores](#objectstores)
  - [ put ](#put)
  - [ get ](#get)
  - [ delete ](#delete)
  - [ keys ](#keys)
  - [ values ](#values)
  - [ entries ](#entries)

## Installation

This is a Node.js module available through the npm registry.

Before installing, download and install Node.js.

Installation is done using the npm install command:

```sh
$ npm install idborm
# or yarn
$ yarn add idborm
```

## <a name="configuration-with-service-worker"></a>Configuration with service worker

In order to use this module inside the `service worker` use `--serviceworker` flag provided by idborm binary script :

```sh
$ ./node_modules/.bin/idborm --serviceworker <PATH_TO_YOUR_SERVICE_WORKER>
```

you'll see it create `idborm.iife.js` containing immediately invoked idborm function expression next to your service worker _(provided after --serviceworker flag)_ and generate following code snippet on top of the service worker file:

```js
/** "idborm": Following code snippet is required to access the "IDB"*/
importScripts("./idborm.iife.js");
const { IDB } = idborm;
```

now, you can access idborm utility functions using destructed <a href="https://tajpouria.github.io/idborm/classes/_idb_.idb.html" target="_blank">IDB</a> class

## <a name="api"></a>API

Assuming you're using a module-compatible system (like webpack, Rollup etc):

## <a name="init"></a>init

#### Initialize database and object stores

```js
import IDB from "idborm";

const DB = await IDB.init(database_name, database_version, object_store(s)_Initializer);
```

- `database_name`: Name of the database
- `database_version`:
- `object_store(s)_Initializer`: Represent database object store(s)_( something like `Table` or `Model` in relational or non-relational databases )_; you can initialize your database object store(s) using one of the following methods:

  1. Create single object store:

  ```js
  const DB = await IDB.init(database_name, database_version, {
    name: object_store_name,
    options: object_store_options,
  });
  ```

  2. Create multiple object stores

  ```js
  const DB = await IDB.init(database_name, database_version, [
    { name: object_store_one_name, options: object_store_one_options },
    { name: object_store_two_name },
    .
    .
    .
  ]);
  ```

  3. Create object store(s) using a callback function:

  ```js
  const DB = await IDB.init(database_name, database_version, () => {
    return { name: object_store_name, options: object_store_options };
    // or
    return [
      { name: object_store_one_name, options: object_store_one_options },
      { name: object_store_two_name, options: object_store_two_options },
    ];
  });
  ```

  - `object_store_name`: Name of object store

  - `object_store_options` _optional_ : You can specify **one** of the following options:

    1. no_options: You should manually provide key for each record when [putting](#`put`-·-Put-record-in-the-database) it in the database

    2. `keyPath`: Uses specified keyPath as record's key therefore records should contains specified keyPath

    3. `autoIncrement`: Uses autoIncrement integers as record's key

```js
// Create a dataBase contains three object stores
(async () => {
  const MyDB = await IDB.init("MyDB", 1, [
    { name: "User", options: { keyPath: "email" } },
    { name: "Post", options: { autoIncrement: true } },
    { name: "Article" },
  ]);
})();
```

## <a name="objectstores"></a>objectStores

### Destructor objectStores

Once you define your object stores you can destructor them from your `database.objectStores`

```js
// Make sure that destructor object stores using exact same name the you defined them
const { User, Post, Article } = MyDB.objectStores;
```

## <a name="put"></a>put

### Put record in the database

Based on the options you specified to related object store you can put record in the database using `ObjectStore.put(value, optional_key)`

```js
(async () => {
  const MyDB = await IDB.init("MyDB", 1, [
    { name: "User", options: { keyPath: "email" } },
    { name: "Post", options: { autoIncrement: true } },
    { name: "Article" },
  ]);

  const { User, Post, Article } = MyDB.objectStores;

  await User.put({ email: "bob@bob.com", name: "bob" }); // email property is required because we're used email as object store keyPath

  await Post.put("post"); // Uses autoIncrement integer as record's keys

  await Article.put(["article"], "article one"); // Key is required because we not specified any option
})();
```

## <a name="get"></a>get

### Retrieve a specific record from database

```js
(async () => {
  const MyDB = await IDB.init("MyDB", 1, [
    { name: "User", options: { keyPath: "email" } },
    { name: "Post", options: { autoIncrement: true } },
    { name: "Article" },
  ]);

  const { User, Post, Article } = MyDB.objectStores;

  // Use specified keyPath property as keyto retrieve the record
  const user = await User.get("bob@bob.com");

  // AutoIncrement integer as key to retrieve the record
  const post = await Post.get(1);

  // Use manually specified key to retrieve the record
  const article = await Article.get("article one");
})();
```

## <a name="delete"></a>delete

### Delete a specific record from database

```js
(async () => {
  const MyDB = await IDB.init("MyDB", 1, { name: "User", options: { keyPath: "email" } });

  const { User } = MyDB.objectStores;

  await User.delete("bob@bob.com");
})();
```

## <a name="keys"></a>keys

### Retrieve all records keys from database

```js
(async () => {
  const MyDB = await IDB.init("MyDB", 1, { name: "User" });

  const { User } = MyDB.objectStores;

  await User.put("bob one", "user one");
  await User.put("bob 2", 2);
  await User.put("bob three", "user three");

  const keys = await User.keys();

  console.log(keys);
  /*
    output:
      [ "user one", 2, "user three" ]
  */
})();
```

## <a name="values"></a>values

### Retrieve all records values from database

```js
(async () => {
  const MyDB = await IDB.init("MyDB", 1, { name: "User", options: { autoIncrement: true } });

  const { User } = MyDB.objectStores;

  await User.put("bob one");
  await User.put({ name: "bob two" });
  await User.put(3);

  const values = await User.values();

  console.log(value);
  /*
    output:
      [ "bob one", { name: "bob two" }, 3 ]
  */
})();
```

## <a name="entries"></a>entries

### Retrieve all records keys and values from database

```js
(async () => {
  const MyDB = await IDB.init("MyDB", 1, { name: "User", options: { keyPath: "id" } });

  const { User } = MyDB.objectStores;

  await User.put({ id: "user one", name: "bob one" });
  await User.put({ id: "user two", name: "bob two" });

  const entries = await User.entries();

  console.log(value);
  /*
    output:
      [ ["user one", { id: "user one", name: "bob one" }], ["user two", { id: "user two", name: "bob two" }] ]
  */
})();
```

## Examples

#### Vanilla JS

[![](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/wizardly-saha-q4lct?fontsize=13&hidenavigation=1&module=%2Findex.js)

#### React-ServiceWorker

[![](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/idborm-react-serviceworker-example-ent45?fontsize=14&hidenavigation=1&theme=dark)

## Contribute!

I always welcome help. Please just stick to the lint rules and write tests with each feature/fix

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/tajpouria/idborm/tags)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
