import { IDBPDatabase } from "idb";
import { IDBVersionController } from ".";
import { ObjectStoreInitializer, IDBObjectKey } from "./typings";
export declare class IDBObject {
    private db;
    private readonly dbVersionController;
    private readonly storeName;
    private readonly storeOptions;
    constructor(db: IDBPDatabase<unknown>, { name, options }: ObjectStoreInitializer, dbVersionController: IDBVersionController);
    private static closeDBConnection;
    put: <Value = any>(value: Value, key?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | undefined) => Promise<Value | undefined>;
    get: <Value = any>(key: IDBObjectKey) => Promise<Value | null>;
    delete: (key: IDBObjectKey) => Promise<boolean | undefined>;
    keys: () => Promise<IDBObjectKey[]>;
    values: <Value = any>() => Promise<Value[]>;
    entries: <Value = any>() => Promise<[IDBObjectKey, Value][]>;
    clear: () => Promise<boolean | undefined>;
}
