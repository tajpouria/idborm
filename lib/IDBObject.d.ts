import { IDBPDatabase } from "idb";
import { IDBVersionController } from ".";
import { ObjectStoreInitializer, IDBObjectKey, Entry, EntriesIteratorCallbackfn } from "./typings";
export declare class IDBObject {
    private db;
    private readonly dbVersionController;
    private readonly storeName;
    private readonly storeOptions;
    constructor(db: IDBPDatabase<unknown>, { name, options }: ObjectStoreInitializer, dbVersionController: IDBVersionController);
    private static closeDBConnection;
    /**
     * Put a record in the database
     *
     * @param value - item's value
     *
     * @param key - item's key _optional_ **when no option (keyPath or autoIncrement) specified this argument is required**
     *
     * @returns Promise<Value>
     *
     * @example
     * ```ts
     * const { Todo } = DB.objectStores;
     *
     * // e.g Using `id` as objectStore keyPath option
     * await Todo.put({ id: 1, content: 'Pet my cat' })
     * // e.g Using autoIncrement option
     * await Todo.put({ content: 'Pet my cat' })
     * // e.g No option (keyPath or autoIncrement) provided
     * await Todo.put({ content: 'Pet my cat' }, 'task one')
     * });
     * ```
     */
    put: <Value = any>(value: Value, key?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | undefined) => Promise<Value>;
    /**
     * Get a record from database
     *
     * @param key - item's key
     *
     * @returns Promise<Value | undefined>
     *
     * @example
     * ```ts
     * const { Todo } = DB.objectStores;
     *
     * await Todo.get('task one')
     * ```
     */
    get: <Value = any>(key: IDBObjectKey) => Promise<Value | undefined>;
    /**
     * Delete a record from database
     *
     * @param key - item's key
     *
     * @returns Promise<true | undefined>
     *
     * @example
     * ```ts
     * const { Todo } = DB.objectStores;
     *
     * await Todo.delete('task one')
     * ```
     */
    delete: (key: IDBObjectKey) => Promise<true | undefined>;
    /**
     * Retrieves the keys of records in an object store
     *
     * @returns Promise<IDBObjectKey[]>
     *
     * @example
     * ```ts
     * const { Todo } = DB.objectStores;
     *
     * await Todo.keys()
     * ```
     */
    keys: () => Promise<IDBObjectKey[]>;
    /**
     * Retrieves the values of records in an object store
     *
     * @returns Promise<Value[]>
     *
     * @example
     * ```ts
     * const { Todo } = DB.objectStores;
     *
     * await Todo.values()
     * ```
     */
    values: <Value = any>() => Promise<Value[]>;
    /**
     * Retrieves the an 2D matrix of keys and values of records in an object store
     *
     * @returns Promise<[IDBObjectKeys, Value][]>
     *
     * @example
     * ```ts
     * const { Todo } = DB.objectStores;
     *
     * await Todo.entries()
     * ```
     */
    entries: <Value = any>() => Promise<Entry<Value>[]>;
    /**
     * Remove all records stored previously in an object store
     *
     * @returns Promise<true | undefined>
     *
     * @example
     * ```ts
     * const { Todo } = DB.objectStores;
     *
     * await Todo.clear()
     * ```
     */
    clear: () => Promise<true | undefined>;
    /**
     * Iterate over all the record in an object store and perform an async action on each one
     *
     * @param callbackfn - async callback (action)
     *
     * @returns Promise<any[]>
     *
     * @example
     * ```ts
     * const { Todo } = DB.objectStores;
     *
     * await Todo.iterate(([key, value], index, entries) => {
     *  if (value.completed) return Todo.delete(key);
     * })
     * ```
     */
    iterate: <Value = any>(callbackfn: EntriesIteratorCallbackfn<Value>) => Promise<any[]>;
}
