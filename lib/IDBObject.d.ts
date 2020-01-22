import { IDBPDatabase } from "idb";
import { ObjectStoreInitializer, IDBObjectKey, Entry, EntriesIteratorCallbackfn } from ".";
export declare class IDBObject {
    private db;
    private readonly storeName;
    private readonly storeOptions;
    /** @ignore */
    constructor(db: Promise<IDBPDatabase<unknown>>, { name, options }: ObjectStoreInitializer);
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
    put: <Value = any>(value: Value, key?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | undefined) => Promise<Value>;
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
    get: <Value = any>(key: IDBObjectKey) => Promise<Value | undefined>;
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
    delete: (key: IDBObjectKey) => Promise<void>;
    /**
     * Retrieves the keys of records in an object store
     *
     * @returns A list containing all object store keys
     *
     * ```ts
     * await Todo.keys()
     * ```
     */
    keys: () => Promise<IDBObjectKey[]>;
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
    values: <Value = any>() => Promise<Value[]>;
    /**
     * Retrieves an array of a given object's own enumerable string-keyed property `[key, value]` pairs
     *
     * @typeparam Value - value's type
     *
     * @returns an array of a given object's own enumerable string-keyed property `[key, value]` pairs
     *
     * ```ts
     * await Todo.entries()
     * ```
     */
    entries: <Value = any>() => Promise<Entry<Value>[]>;
    /**
     * Delete all records stored in an object store
     *
     * ```ts
     * await Todo.clear()
     * ```
     */
    clear: () => Promise<void>;
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
    iterate: <Value = any>(callbackfn: EntriesIteratorCallbackfn<Value>) => Promise<Value[]>;
}
