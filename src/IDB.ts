import { openDB, IDBPDatabase, deleteDB } from "idb";

import { IDBObject } from ".";
import {
  IDBErrors,
  IDBORM,
  ObjectStoreInitializer,
  ObjectStoreInitializerFunction,
  ObjectStoresAndActionMap,
  ObjectStoreIteratorCallbackfn,
} from "./typings";

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
   * Retrieves an indexed data base
   *
   * @param dataBaseName - Data base name
   * @param objectStores - Initialize objectStore(s)
   *
   * @returns An indexed data base that contains defined object store
   *
   * Creating single object Store :
   * ```ts
   * const DB = await IDB.init("TodoDataBase", { name: "Todo", options: { keyPath: "id" } });
   * ```
   * Create multiple object Stores :
   * ```ts
   * const DB = await IDB.init("TodoDataBase", [ { name: "Todo" }, {name: "Notes", options: { keyPath: "id" }} ]);
   * ```
   * Use a callback function to initialize object stores :
   * ```ts
   * const DB = await IDB.init("TodoDataBase", () => {
   *  return { name: "Todo", options: { autoIncrement: true } };
   * });
   * ```
   */
  public static init = async (
    dataBaseName: string,
    objectStores: ObjectStoreInitializer | ObjectStoreInitializer[] | ObjectStoreInitializerFunction,
  ): Promise<IDB> => {
    if (!dataBaseName) {
      throw new Error(IDBErrors.noDatabaseName);
    } else if (!objectStores || (Array.isArray(objectStores) && !objectStores.length)) {
      throw new Error(IDBErrors.noObjectStore);
    }

    const objectStoreDictionary = IDB.objectStoreDictionaryCreator(objectStores);

    const objectStoresMap: Record<string, IDBObject> = {};

    try {
      const idbdb = openDB(dataBaseName, 1, {
        upgrade(db) {
          Object.values(objectStoreDictionary).forEach(os => {
            console.log(os);
            const { name, options } = os;

            if (!db.objectStoreNames.contains(name)) {
              db.createObjectStore(name, options);
            }

            if (1) {
              db.deleteObjectStore(name);

              db.createObjectStore(name, options);
            }
          });

          Object.values(db.objectStoreNames).forEach(os => {
            if (!objectStoresMap[os]) {
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
   * DataBase.objectStores.methods.iterate((objectStore) => {})
   * ```
   */
  public get objectStores(): ObjectStoresAndActionMap {
    const iterateOverObjectStores = (callbackfn: ObjectStoreIteratorCallbackfn): void => {
      this.iterateOverObjectStores(callbackfn);
    };

    // @ts-ignore
    return {
      ...this.objectStoresMap,

      methods: {
        iterate(callbackfn: ObjectStoreIteratorCallbackfn): void {
          iterateOverObjectStores(callbackfn);
        },
      },
    };
  }

  private iterateOverObjectStores = (callbackfn: ObjectStoreIteratorCallbackfn): void =>
    Object.values(this.objectStoresMap).forEach(callbackfn as any);

  /**
   * Delete an indexed database
   *
   * ```ts
   * await DataBase.delete()
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
