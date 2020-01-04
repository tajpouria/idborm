import { IDBPDatabase } from "idb";
declare type IDBObjectKey = string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange;
export declare class IDBObject {
    private db;
    private trackingVersion;
    private storeName;
    constructor(db: IDBPDatabase<unknown>, storeName: string);
    put: (key: IDBObjectKey, value: any) => Promise<any>;
    get: (key: IDBObjectKey) => Promise<any>;
    delete: (key: IDBObjectKey) => Promise<undefined>;
    keys: () => Promise<IDBValidKey[] | undefined>;
    values: () => Promise<any[] | undefined>;
    entries: () => Promise<any[] | undefined>;
    clear: () => Promise<undefined>;
}
export {};
