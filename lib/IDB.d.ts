import { IDBPDatabase } from "idb";
import { IDBObject, IDBVersionController } from ".";
import { ObjectStoreInitializer } from "./typings";
export declare class IDB {
    dataBaseName: string;
    private db;
    objectStoresMap: Record<string, IDBObject>;
    dbVersionController: IDBVersionController;
    constructor(dataBaseName: string, db: IDBPDatabase<unknown>, objectStoresMap: Record<string, IDBObject>, dbVersionController: IDBVersionController);
    private static objectStoreDictionaryCreator;
    static init: (dataBaseName: string, objectStores: ObjectStoreInitializer | ObjectStoreInitializer[]) => Promise<IDB>;
    get objectStores(): Record<string, IDBObject>;
    iterateOverObjectStores: (callbackfn: (objectStore?: IDBObject | undefined, index?: number | undefined, ObjectStoresArray?: IDBObject[] | undefined) => any) => void;
    delete: () => Promise<void>;
}
