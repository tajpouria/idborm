import { IDBPDatabase } from "idb";
import { IDBVersionController } from ".";
import { ObjectStoreInitializer, IDBObjectKey, Entry, EntriesIteratorCallbackfn } from "./typings";
export declare class IDBObject {
    private db;
    private readonly dbVersionController;
    private readonly storeName;
    private readonly storeOptions;
    /** @ignore */
    constructor(db: IDBPDatabase<unknown>, { name, options }: ObjectStoreInitializer, dbVersionController: IDBVersionController);
    private static closeDBConnection;
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
     * @returns true if record successfully deleted
     *
     * Delete record with key `task one`
     * ```ts
     * await Todo.delete('task one')
     * ```
     */
    delete: (key: IDBObjectKey) => Promise<true | undefined>;
    /**
     * Retrieves the keys of records in an object store
     *
     * @returns An list containing all object store keys
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
    entries: <Value = any>() => Promise<Entry<Value>[]>;
    /**
     * Delete all records stored in an object store
     *
     * @returns true if all records successfully deleted
     *
     * ```ts
     * await Todo.clear()
     * ```
     */
    clear: () => Promise<true | undefined>;
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
    iterate: <Value = any>(callbackfn: EntriesIteratorCallbackfn<Value>) => Promise<any[]>;
}
