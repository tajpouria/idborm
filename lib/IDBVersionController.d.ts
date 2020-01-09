import { ObjectStoreInitializer } from "./typings";
interface StorageDbInstance {
    objectStores: Record<string, ObjectStoreInitializer>;
    version: number;
}
export declare class IDBVersionController {
    private dataBaseName;
    private localStorage;
    shouldUpdateStores: Record<string, any>;
    constructor(dataBaseName: string);
    get idbormStorage(): Record<string, StorageDbInstance>;
    getIdbormStorageCurrentDb: (selector: {
        objectStores?: boolean | undefined;
        version?: boolean | undefined;
    }) => number | StorageDbInstance | Record<string, ObjectStoreInitializer>;
    incDbVersion(objectStores?: Record<string, ObjectStoreInitializer>): number;
    deleteDbVersion: () => void;
}
export {};
