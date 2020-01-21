/* istanbul ignore file */
import { IDBObject } from "..";
import { ObjectStoreInitializer } from "./public";

export type ObjectStoreInitializerFunction = () => ObjectStoreInitializer | ObjectStoreInitializer[];

export type ObjectStoreIteratorCallbackfn = (
  objectStore: IDBObject,
  index?: number,
  ObjectStoresArray?: IDBObject[],
) => Promise<any>;

export interface ObjectStoresAndActionMap {
  [objectStoreName: string]: IDBObject;

  // @ts-ignore
  methods: {
    iterate: (callbackfn: ObjectStoreIteratorCallbackfn) => void;
  };
}
