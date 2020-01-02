import * as idb from "idb";
import { IDBObject } from "./IDBObject";
export default class IDB {
    private dbName;
    private db;
    protected objectStoresOptions: Record<string, IDBObjectStoreParameters>;
    constructor(dbName: string, db: idb.IDBPDatabase<unknown>);
    static init: (dataBaseName: string) => Promise<IDB>;
    get objectStores(): string[] | undefined;
    createObjectStore: (objectStoreName: string, options?: IDBObjectStoreParameters) => Promise<IDBObject | undefined>;
    delete: () => Promise<void>;
}
