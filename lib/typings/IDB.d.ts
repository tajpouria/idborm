import { ObjectStoreInitializer } from ".";
import { IDBObject } from "..";
export declare type ObjectStoreInitializerFunction = () => ObjectStoreInitializer | ObjectStoreInitializer[];
export declare type ObjectStoreIteratorCallbackfn = (objectStore: IDBObject, index?: number, ObjectStoresArray?: IDBObject[]) => Promise<any>;
export interface ObjectStoresAndActionMap {
    [objectStoreName: string]: IDBObject;
    methods: {
        iterate: (callbackfn: ObjectStoreIteratorCallbackfn) => void;
    };
}
