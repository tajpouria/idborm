import * as idb from "idb";
declare type IDBObjectKey = string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange;
export declare class IDBObject {
    private db;
    private storeName;
    constructor(db: idb.IDBPDatabase<unknown>, storeName: string);
    set: (key: IDBObjectKey, value: any) => Promise<string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | undefined>;
    get: (key: IDBObjectKey) => Promise<any>;
    delete: (key: IDBObjectKey) => Promise<undefined>;
    keys: () => Promise<IDBValidKey[] | undefined>;
    values: () => Promise<any[] | undefined>;
    entries: () => Promise<any[] | undefined>;
    clear: () => Promise<undefined>;
}
export {};
