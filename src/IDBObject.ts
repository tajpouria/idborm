import { IDBPDatabase } from "idb";

import { IDBORM, ObjectStoreInitializer, IDBObjectKey, Entry, EntriesIteratorCallbackfn } from "./typings";

export class IDBObject {
  private db: Promise<IDBPDatabase<unknown>>;

  private readonly storeName: string;

  private readonly storeOptions: IDBObjectStoreParameters | undefined;

  /** @ignore */
  constructor(db: Promise<IDBPDatabase<unknown>>, { name, options }: ObjectStoreInitializer) {
    this.db = db;
    this.storeName = name;
    this.storeOptions = options;
  }

  /**
   * Put a record in the database
   * Replaces items with the same keys
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
  public put = <Value = any>(value: Value, key?: IDBObjectKey): Promise<Value> => {
    const { db, storeName } = this;

    return db
      .then(_db => {
        const tx = _db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        store.put(value, key);
        return tx.done;
      })
      .then(() => value)
      .catch(err => {
        throw new Error(`${IDBORM}: ${storeName}.put(${value}${key ? `, ${key}` : ""}): ${err}`);
      });
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
    const { db, storeName } = this;

    return db
      .then(_db => {
        const tx = _db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        return store.get(key);
      })
      .catch(err => {
        throw new Error(`${IDBORM}: ${storeName}.get(${key}): ${err}`);
      });
  };

  /**
   * Delete a record from database
   *
   * @param key - item's key
   *
   * Delete record with key `task one`
   * ```ts
   * await Todo.delete('task one')
   * ```
   */
  public delete = async (key: IDBObjectKey): Promise<void> => {
    const { db, storeName } = this;

    return db
      .then(async _db => {
        const tx = _db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        store.delete(key);
        return tx.done;
      })
      .catch(err => {
        throw new Error(`${IDBORM}: ${storeName}.get(${key}): ${err}`);
      });
  };

  /**
   * Retrieves the keys of records in an object store
   *
   * @returns A list containing all object store keys
   *
   * ```ts
   * await Todo.keys()
   * ```
   */
  public keys = async (): Promise<IDBObjectKey[]> => {
    const { db, storeName } = this;

    return db
      .then(async _db => {
        const tx = _db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        return store.getAllKeys();
      })
      .catch(err => {
        throw new Error(`${IDBORM}: ${storeName}.keys(): ${err}`);
      });
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
  public values = <Value = any>(): Promise<Value[]> => {
    const { db, storeName } = this;

    return db
      .then(async _db => {
        const tx = _db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        return store.getAll();
      })
      .catch(err => {
        throw new Error(`${IDBORM}: ${storeName}.values(): ${err}`);
      });
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
      throw new Error(`${IDBORM}: ${storeName}.entries(): ${err}`);
    }
  };

  /**
   * Delete all records stored in an object store
   *
   * ```ts
   * await Todo.clear()
   * ```
   */
  public clear = async (): Promise<void> => {
    const { db, storeName } = this;

    return db
      .then(_db => {
        const tx = _db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        store.clear();
        return tx.done;
      })
      .catch(err => {
        throw new Error(`${IDBORM}: ${storeName}.clear(): ${err}`);
      });
  };

  /**
   * Iterate over all the record in an object store and perform an async action on each one
   *
   * @param callbackfn - async callback(action)
   *
   * @typeparam Value - async callback returns type
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
  public iterate = async <Value = any>(callbackfn: EntriesIteratorCallbackfn<Value>): Promise<Value[]> => {
    const { entries } = this;

    const _entries = await entries();

    return Promise.all(_entries.map(callbackfn));
  };
}
