import { openDB, IDBPDatabase, deleteDB } from "idb";

import { IDBObject, IDBVersionController } from ".";
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

  private db: IDBPDatabase<unknown>;

  private objectStoresMap: Record<string, IDBObject> = {};

  private dbVersionController: IDBVersionController;

  private static closeDBConnection = (db: IDBPDatabase): void => db.close();

  constructor(
    dataBaseName: string,
    db: IDBPDatabase<unknown>,
    objectStoresMap: Record<string, IDBObject>,
    dbVersionController: IDBVersionController,
  ) {
    this.dataBaseName = dataBaseName;
    this.db = db;
    this.dbVersionController = dbVersionController;
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
   * @returns Promise<IDB>
   *
   * @example
   * ```ts
   * // e.g. Creating single object Store
   * const DB = await IDB.init("TodoDataBase", { name: "Todo", options: { keyPath: "id" } });
   * // e.g Create multiple object Stores
   * const DB = await IDB.init("TodoDataBase", [ { name: "Todo" }, {name: "Notes", options: { keyPath: "id" }} ]);
   * // e.g Use a callback function to create object stores
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

    const dbVersionController = new IDBVersionController(dataBaseName);

    const objectStoreDictionary = IDB.objectStoreDictionaryCreator(objectStores);

    const objectStoresMap: Record<string, IDBObject> = {};

    try {
      const idbdb = await openDB(dataBaseName, dbVersionController.incDbVersion(objectStoreDictionary), {
        upgrade(db) {
          Object.values(objectStoreDictionary).forEach(os => {
            const { name, options } = os;

            if (!db.objectStoreNames.contains(name)) {
              db.createObjectStore(name, options);
            }

            if (dbVersionController.shouldUpdateStores[name]) {
              db.deleteObjectStore(name);

              db.createObjectStore(name, options);
            }

            objectStoresMap[os.name] = new IDBObject(db, { name, options }, dbVersionController);
          });

          Object.values(db.objectStoreNames).forEach(os => {
            if (!objectStoresMap[os]) {
              db.deleteObjectStore(os);
            }
          });
        },
      });

      idbdb.close();

      return new IDB(dataBaseName, idbdb, objectStoresMap, dbVersionController);
    } catch (error) {
      throw new Error(`${IDBORM}: ${error}`);
    }
  };

  /**
   * Retrieves data base object stores and methods map
   *
   * @returns Promise<{[ objectStoreName: string ]: IDBObject, methods: { iterate(callbackfn){} }}>
   *
   * @example
   * ```ts
   * // Access a object store
   * const { Todo } = DB.objectStores;
   *
   * // Iterate over data base object stores
   * DB.objectStores.methods.iterate((objectStore) => {})
   * ```
   */
  get objectStores(): ObjectStoresAndActionMap {
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
   * @returns Promise<void>
   *
   * @example
   * ```ts
   * const DB = IDB.init("TodoDataBase", { name: "Todo" });
   *
   * iDB.delete()
   * ```
   */
  public delete = async (): Promise<void> => {
    const { db, dbVersionController } = this;

    await deleteDB(this.dataBaseName, {
      blocked() {
        IDB.closeDBConnection(db);
      },
    });

    dbVersionController.deleteDbVersion();
  };
}
