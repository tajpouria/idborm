import { IDBPDatabase } from "idb";
import { IDBObject } from "./IDBObject";
export declare class IDB {
    private dbName;
    private db;
    constructor(dbName: string, db: IDBPDatabase<unknown>);
    static init: (dataBaseName: string) => Promise<IDB>;
    get objectStores(): string[];
    createObjectStore: (objectStoreName: string, options?: IDBObjectStoreParameters) => Promise<IDBObject>;
    delete: () => Promise<void>;
}
