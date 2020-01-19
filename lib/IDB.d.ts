import { IDBPDatabase } from "idb";
import { IDBObject } from ".";
import { ObjectStoreInitializer, ObjectStoreInitializerFunction, ObjectStoresAndActionMap } from "./typings";
export declare class IDB {
    private dataBaseName;
    private db;
    private objectStoresMap;
    /** @ignore */
    constructor(dataBaseName: string, db: Promise<IDBPDatabase<unknown>>, objectStoresMap: Record<string, IDBObject>);
    private static objectStoreDictionaryCreator;
    /**
     * Retrieves an indexed data base
     *
     * @param dataBaseName - Data base name
     * @param dataBaseVersion - Data base Version
     * @param objectStores - Initialize objectStore(s)
     *
     * @returns An indexed data base that contains defined object store
     *
     * Creating single object Store :
     * ```ts
     * const DB = await IDB.init("TodoDataBase", 1, { name: "Todo", options: { keyPath: "id" } });
     * ```
     * Create multiple object Stores :
     * ```ts
     * const DB = await IDB.init("TodoDataBase", 1, [ { name: "Todo" }, {name: "Notes", options: { keyPath: "id" }} ]);
     * ```
     * Use a callback function to initialize object stores :
     * ```ts
     * const DB = await IDB.init("TodoDataBase", 1, () => {
     *  return { name: "Todo", options: { autoIncrement: true } };
     * });
     * ```
     */
    static init: (dataBaseName: string, dataBaseVersion: number, objectStores: ObjectStoreInitializer | ObjectStoreInitializerFunction | ObjectStoreInitializer[]) => Promise<IDB>;
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
    get objectStores(): ObjectStoresAndActionMap;
    private iterateOverObjectStores;
    /**
     * Delete an indexed database
     *
     * ```ts
     * await DataBase.delete()
     * ```
     */
    delete: () => Promise<void>;
}
