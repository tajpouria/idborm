/* istanbul ignore file */
import { ObjectStoreInitializer } from ".";
import { IDBObject } from "..";

export type ObjectStoreInitializerFunction = () => ObjectStoreInitializer | ObjectStoreInitializer[];

export type ObjectStoreIteratorCallbackfn = (
  objectStore?: IDBObject,
  index?: number,
  ObjectStoresArray?: IDBObject[],
) => any;

export interface ObjectStoresAndActionMap {
  [objectStoreName: string]: IDBObject;

  // @ts-ignore
  methods: {
    iterate: (callbackfn: ObjectStoreIteratorCallbackfn) => void;
  };
}
