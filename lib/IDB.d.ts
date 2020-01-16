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
    static init: (dataBaseName: string, objectStores: ObjectStoreInitializer | ObjectStoreInitializerFunction | ObjectStoreInitializer[]) => Promise<IDB>;
    get objectStores(): ObjectStoresAndActionMap;
    private iterateOverObjectStores;
    delete: () => Promise<void>;
}
