import { IDBObject } from "..";
import { ObjectStoreInitializer } from "./public";
export declare type ObjectStoreInitializerFunction = () => ObjectStoreInitializer | ObjectStoreInitializer[];
export declare type ObjectStoreIteratorCallbackfn = (objectStore: IDBObject, index?: number, ObjectStoresArray?: IDBObject[]) => Promise<any> | undefined;
export interface ObjectStoresAndActionMap {
    [objectStoreName: string]: IDBObject;
    methods: {
        iterate: (callbackfn: ObjectStoreIteratorCallbackfn) => void;
    };
}
