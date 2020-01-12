import { IDBPDatabase } from "idb";
import { IDBVersionController } from ".";
import { ObjectStoreInitializer } from "./typings";
declare type IDBObjectKey = string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange;
export declare class IDBObject {
    private db;
    private readonly dbVersionController;
    private readonly storeName;
    private readonly storeOptions;
    constructor(db: IDBPDatabase<unknown>, { name, options }: ObjectStoreInitializer, dbVersionController: IDBVersionController);
    private static closeDBConnection;
    put: <Value = any>(key: IDBObjectKey, value: Value) => Promise<Value | undefined>;
    get: <Value = any>(key: IDBObjectKey) => Promise<Value | null>;
    delete: (key: IDBObjectKey) => Promise<void>;
    keys: () => Promise<IDBObjectKey[]>;
    values: () => Promise<any[]>;
    entries: () => Promise<[IDBObjectKey, any][]>;
    clear: () => Promise<boolean | undefined>;
}
export {};
