import { openDB, IDBPDatabase } from "idb";

import { IDBVersionController } from ".";
import { IDBORM, ObjectStoreInitializer, IDBObjectKey, Entry, EntriesIteratorCallbackfn } from "./typings";

export class IDBObject {
  private db: IDBPDatabase<unknown>;

  private readonly dbVersionController: IDBVersionController;

  private readonly storeName: string;

  private readonly storeOptions: IDBObjectStoreParameters | undefined;

  /** @ignore */
  constructor(
    db: IDBPDatabase<unknown>,
    { name, options }: ObjectStoreInitializer,
    dbVersionController: IDBVersionController,
  ) {
    this.db = db;
    this.dbVersionController = dbVersionController;
    this.storeName = name;
    this.storeOptions = options;
  }

  private static closeDBConnection = (db: IDBPDatabase): void => db.close();

  /**
   * Put a record in the database
   *
   * @param value - item's value
   *
   * @param key - item's key **when no option (keyPath or autoIncrement) specified this argument is required**
   *
   * @typeparam Value - value's type
   *
   * @returns Recorded value
   *
   * Using `id` as objectStore keyPath option :
   * ```ts
   * await Todo.put({ id: 1, content: 'Pet my cat' })
   * ```
   * Using autoIncrement option :
   * ```ts
   * await Todo.put({ content: 'Pet my cat' })
   * ```
   * No option (keyPath or autoIncrement) provided :
   * ```ts
   * await Todo.put({ content: 'Pet my cat' }, 'task one')
   * ```
   */
  public put = async <Value = any>(value: Value, key?: IDBObjectKey): Promise<Value> => {
    const { db, dbVersionController, storeName } = this;
    const { closeDBConnection } = IDBObject;

    try {
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          closeDBConnection(db);
        },
      });

      await idbdb.put(storeName, value, key);

      closeDBConnection(idbdb);

      return value;
    } catch (err) {
      throw new Error(`${IDBORM}: ${storeName}.put(${key}): ${err}`);
    }
  };

  /**
   * Get a record from database
   *
   * @param key - item's key
   *
   * @typeparam Value - value's type
   *
   * @returns Recorded value
   *
   * Get record with key `task one`
   * ```ts
   * await Todo.get('task one')
   * ```
   */
  public get = async <Value = any>(key: IDBObjectKey): Promise<Value | undefined> => {
    const { db, dbVersionController, storeName } = this;
    const { closeDBConnection } = IDBObject;

    try {
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          closeDBConnection(db);
        },
      });

      const value = await idbdb.get(storeName, key);

      closeDBConnection(idbdb);

      return value;
    } catch (err) {
      console.error(`${IDBORM}: ${storeName}.get(${key}): ${err}`);
    }

    return undefined;
  };

  /**
   * Delete a record from database
   *
   * @param key - item's key
   *
   * @returns true if record successfully deleted
   *
   * Delete record with key `task one`
   * ```ts
   * await Todo.delete('task one')
   * ```
   */
  public delete = async (key: IDBObjectKey): Promise<true | undefined> => {
    const { db, dbVersionController, storeName } = this;
    const { closeDBConnection } = IDBObject;

    try {
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          closeDBConnection(db);
        },
      });

      await idbdb.delete(storeName, key);

      closeDBConnection(idbdb);

      return true;
    } catch (err) {
      console.error(`${IDBORM}: ${storeName}.delete(${key}): ${err}`);
    }

    return undefined;
  };

  /**
   * Retrieves the keys of records in an object store
   *
   * @returns An list containing all object store keys
   *
   * ```ts
   * await Todo.keys()
   * ```
   */
  public keys = async (): Promise<IDBObjectKey[]> => {
    const { db, storeName, dbVersionController } = this;
    const { closeDBConnection } = IDBObject;

    try {
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          closeDBConnection(db);
        },
      });

      const keys = await idbdb.getAllKeys(storeName);

      closeDBConnection(idbdb);

      return keys;
    } catch (err) {
      console.error(`${IDBORM}: ${storeName}.keys(): ${err}`);
    }

    return [];
  };

  /**
   * Retrieves the values of records in an object store
   *
   * @typeparam Value - value's type
   *
   * @returns An list containing all object store values
   *
   * ```ts
   * await Todo.values()
   * ```
   */
  public values = async <Value = any>(): Promise<Value[]> => {
    const { db, storeName, dbVersionController } = this;
    const { closeDBConnection } = IDBObject;

    try {
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          closeDBConnection(db);
        },
      });

      const values = idbdb.getAll(storeName);

      closeDBConnection(idbdb);

      return values;
    } catch (err) {
      console.error(`${IDBORM}: ${storeName}.values(): ${err}`);
    }

    return [];
  };

  /**
   * Retrieves an 2D matrix containing keys and values of records in an object store
   *
   * @typeparam Value - value's type
   *
   * @returns List of arrays that each array contains record's key and value
   *
   * ```ts
   * await Todo.entries()
   * ```
   */
  public entries = async <Value = any>(): Promise<Entry<Value>[]> => {
    const { storeName } = this;
    try {
      const keyAndValues = await Promise.all([this.keys(), this.values()]);

      return keyAndValues?.[0].map((key: IDBObjectKey, idx: number) => [key, keyAndValues?.[1][idx]]) || [];
    } catch (err) {
      console.error(`${IDBORM}: ${storeName}.entries(): ${err}`);
    }

    return [];
  };

  /**
   * Delete all records stored in an object store
   *
   * @returns true if all records successfully deleted
   *
   * ```ts
   * await Todo.clear()
   * ```
   */
  public clear = async (): Promise<true | undefined> => {
    const { db, storeName, dbVersionController } = this;
    const { closeDBConnection } = IDBObject;

    try {
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          closeDBConnection(db);
        },
      });

      await idbdb.clear(this.storeName);

      closeDBConnection(idbdb);

      return true;
    } catch (err) {
      console.error(`${IDBORM}: ${storeName}.clear(): ${err}`);
    }

    return undefined;
  };

  /**
   * Iterate over all the record in an object store and perform an async action on each one
   *
   * @param callbackfn - async callback (action)
   *
   * @typeparam Value - value's type
   *
   * @returns A list contains async action results
   *
   * Delete all completed task :
   * ```ts
   * await Todo.iterate(([key, value], index, entries) => {
   *  if (value.completed) return Todo.delete(key);
   * })
   * ```
   */
  public iterate = async <Value = any>(callbackfn: EntriesIteratorCallbackfn<Value>): Promise<any[]> => {
    const { entries } = this;

    const _entries = await entries();

    return Promise.all(_entries.map(callbackfn));
  };
}
