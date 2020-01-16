import { IDBPDatabase } from "idb";
import { IDBObject, IDBVersionController } from ".";
import { ObjectStoreInitializer, ObjectStoreInitializerFunction, ObjectStoresAndActionMap } from "./typings";
export declare class IDB {
    private dataBaseName;
    private db;
    private objectStoresMap;
    private dbVersionController;
    private static closeDBConnection;
    constructor(dataBaseName: string, db: IDBPDatabase<unknown>, objectStoresMap: Record<string, IDBObject>, dbVersionController: IDBVersionController);
    private static objectStoreDictionaryCreator;
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
    static init: (dataBaseName: string, objectStores: ObjectStoreInitializer | ObjectStoreInitializerFunction | ObjectStoreInitializer[]) => Promise<IDB>;
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
    get objectStores(): ObjectStoresAndActionMap;
    private iterateOverObjectStores;
    /**
     * Delete an indexed database
     *
     * @returns Promise<void>
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
    delete: () => Promise<void>;
}
