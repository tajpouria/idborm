import { IDBPDatabase } from "idb";
import { IDBObject, IDBVersionController } from ".";
import { ObjectStoreInitializer, ObjectStoreInitializerFunction, ObjectStoresAndActionMap } from "./typings";
export declare class IDB {
    dataBaseName: string;
    private db;
    objectStoresMap: Record<string, IDBObject>;
    dbVersionController: IDBVersionController;
    constructor(dataBaseName: string, db: IDBPDatabase<unknown>, objectStoresMap: Record<string, IDBObject>, dbVersionController: IDBVersionController);
    private static objectStoreDictionaryCreator;
    static init: (dataBaseName: string, objectStores: ObjectStoreInitializer | ObjectStoreInitializerFunction | ObjectStoreInitializer[]) => Promise<IDB>;
    get objectStores(): ObjectStoresAndActionMap;
    private iterateOverObjectStores;
    private static closeDBConnection;
    delete: () => Promise<void>;
}
