import { IDBPDatabase } from "idb";
import { IDBObject } from "./IDBObject";
export interface ObjectStoreInitializer {
    name: string;
    options?: IDBObjectStoreParameters;
}
export declare class IDB {
    private dbName;
    private db;
    objectStoresMap: Record<string, IDBObject>;
    constructor(dbName: string, db: IDBPDatabase<unknown>, objectStoresMap: Record<string, IDBObject>);
    static init: (dataBaseName: string, objectStores: ObjectStoreInitializer | ObjectStoreInitializer[]) => Promise<IDB>;
    get objectStores(): Record<string, IDBObject>;
    delete: () => Promise<void>;
}
