import { openDB, IDBPDatabase, deleteDB } from "idb";

import {
  IDBObject,
  IDBErrors,
  IDBORM,
  ObjectStoreInitializer,
  ObjectStoreInitializerFunction,
  ObjectStoresAndActionMap,
  ObjectStoreIteratorCallbackfn,
} from ".";

export class IDB {
  private dataBaseName: string;

  private db: Promise<IDBPDatabase<unknown>>;

  private objectStoresMap: Record<string, IDBObject> = {};

  /** @ignore */
  constructor(dataBaseName: string, db: Promise<IDBPDatabase<unknown>>, objectStoresMap: Record<string, IDBObject>) {
    this.dataBaseName = dataBaseName;
    this.db = db;
    this.objectStoresMap = objectStoresMap;
  }

  private static objectStoreDictionaryCreator = (
    objectStores: ObjectStoreInitializer | ObjectStoreInitializer[] | ObjectStoreInitializerFunction,
  ): Record<string, ObjectStoreInitializer> => {
    const _objectStores = typeof objectStores === "function" ? objectStores() : objectStores;

    const objectStoresDictionary: Record<string, ObjectStoreInitializer> = {};

    if (Array.isArray(_objectStores)) {
      _objectStores.forEach(os => {
        objectStoresDictionary[os.name] = os;
      });
    } else {
      objectStoresDictionary[_objectStores.name] = _objectStores;
    }

    return objectStoresDictionary;
  };

  /**
   * Initialize an indexed data base
   *
   * @param dataBaseName - Data base name
   * @param dataBaseVersion - Data base Version
   * @param objectStores - Initialize objectStore(s)
   *
   * @returns An indexed data base that contains defined object store
   *
   * Creating single object Store :
   * ```ts
   * const DB = IDB.init("TodoDataBase", 1, { name: "Todo", options: { keyPath: "id" } });
   * ```
   * Create multiple object Stores :
   * ```ts
   * const DB = IDB.init("TodoDataBase", 1, [ { name: "Todo" }, {name: "Notes", options: { keyPath: "id" }} ]);
   * ```
   * Use a callback function to initialize object stores :
   * ```ts
   * const DB = IDB.init("TodoDataBase", 1, () => {
   *  return { name: "Todo", options: { autoIncrement: true } };
   *  // or returns objectStores list:
   *  return [ { name: "Todo" }, { name: "Note" } ]
   * });
   * ```
   */
  public static init = (
    dataBaseName: string,
    dataBaseVersion: number,
    objectStores: ObjectStoreInitializer | ObjectStoreInitializer[] | ObjectStoreInitializerFunction,
  ): IDB => {
    if (!dataBaseName) {
      throw new Error(IDBErrors.noDatabaseName);
    } else if (!objectStores || (Array.isArray(objectStores) && !objectStores.length)) {
      throw new Error(IDBErrors.noObjectStore);
    }

    const objectStoreDictionary = IDB.objectStoreDictionaryCreator(objectStores);

    const objectStoresMap: Record<string, IDBObject> = {};

    try {
      const idbdb = openDB(dataBaseName, dataBaseVersion, {
        upgrade(db) {
          Object.values(objectStoreDictionary).forEach(os => {
            const { name, options } = os;

            if (!db.objectStoreNames.contains(name)) {
              db.createObjectStore(name, options);
            }
          });

          Object.values(db.objectStoreNames).forEach(os => {
            if (!objectStoreDictionary[os]) {
              db.deleteObjectStore(os);
            }
          });
        },
      });

      Object.values(objectStoreDictionary).forEach(os => {
        const { name, options } = os;
        objectStoresMap[os.name] = new IDBObject(idbdb, { name, options });
      });

      return new IDB(dataBaseName, idbdb, objectStoresMap);
    } catch (error) {
      throw new Error(`${IDBORM}: ${error}`);
    }
  };

  /**
   * Retrieves data base object stores and methods map
   *
   * @returns An map containing defined object stores, and methods to perform action on object stores
   *
   * Access object stores :
   * ```ts
   * const { Todo } = DB.objectStores;
   * ```
   * Iterate over data base object stores :
   * ```
   * await DataBase.objectStores.methods.iterate((objectStore) => { /\* Some async operation *\/ })
   * ```
   */
  public get objectStores(): ObjectStoresAndActionMap {
    const iterateOverObjectStores = (callbackfn: ObjectStoreIteratorCallbackfn): Promise<any[]> =>
      this.iterateOverObjectStores(callbackfn);

    // @ts-ignore
    return {
      ...this.objectStoresMap,

      /**
       * Iterate over all the object stores and perform an async action on each one
       *
       * @param callbackfn - async callback(action)
       *
       * @typeparam Value - async callback returns type
       *
       * @returns A list contains async action results
       *
       * Put some data in the all objectStore of a database:
       * ```ts
       * await Todo.objectStores.methods.iterate((ObjectStore , index, objectStoresArrays) => {
       *   return ObjectStore.put("some data");
       * })
       * ```
       */
      methods: {
        iterate<Value = any>(callbackfn: ObjectStoreIteratorCallbackfn): Promise<Value[]> {
          return iterateOverObjectStores(callbackfn);
        },
      },
    };
  }

  private iterateOverObjectStores = <Value = any>(callbackfn: ObjectStoreIteratorCallbackfn): Promise<Value[]> =>
    Promise.all(Object.values(this.objectStoresMap).map(callbackfn));

  /**
   * Delete an indexed database
   *
   * ```ts
   * await DataBase.delete("task one")
   * ```
   */
  public delete = async (): Promise<void> => {
    const { dataBaseName, db } = this;
    return deleteDB(dataBaseName, {
      blocked() {
        db.then(_db => _db.close());
      },
    });
  };
}
