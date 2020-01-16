/* istanbul ignore file */
export type IDBObjectKey = string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange;

export type Entry<Value> = [IDBObjectKey, Value];

export type EntriesIteratorCallbackfn<Value> = (
  entry: Entry<Value>,
  index?: number,
  entries?: Entry<Value>[],
) => Promise<any>;
