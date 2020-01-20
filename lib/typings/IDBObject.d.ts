export declare type IDBObjectKey = string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange;
export declare type Entry<Value> = [IDBObjectKey, Value];
export declare type EntriesIteratorCallbackfn<Value> = (entry: Entry<Value>, index?: number, entries?: Entry<Value>[]) => Promise<any>;
