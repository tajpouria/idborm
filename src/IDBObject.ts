import { openDB, IDBPDatabase } from "idb";

import { IDBVersionController } from ".";
import { IDBORM, ObjectStoreInitializer, IDBObjectKey, Entry, EntriesIteratorCallbackfn } from "./typings";

export class IDBObject {
  private db: IDBPDatabase<unknown>;

  private readonly dbVersionController: IDBVersionController;

  private readonly storeName: string;

  private readonly storeOptions: IDBObjectStoreParameters | undefined;

  constructor(
    db: IDBPDatabase<unknown>,
    { name, options }: ObjectStoreInitializer,
    dbVersionController: IDBVersionController,
  ) {
    this.db = db;
    this.dbVersionController = dbVersionController;
    this.storeName = name;
    this.storeOptions = options;
  }

  private static closeDBConnection = (db: IDBPDatabase): void => db.close();

  public put = async <Value = any>(value: Value, key?: IDBObjectKey): Promise<Value> => {
    const { db, dbVersionController, storeName } = this;
    const { closeDBConnection } = IDBObject;

    try {
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          closeDBConnection(db);
        },
      });

      await idbdb.put(storeName, value, key);

      closeDBConnection(idbdb);

      return value;
    } catch (err) {
      throw new Error(`${IDBORM}: ${storeName}.put(${key}): ${err}`);
    }
  };

  public get = async <Value = any>(key: IDBObjectKey): Promise<Value | undefined> => {
    const { db, dbVersionController, storeName } = this;
    const { closeDBConnection } = IDBObject;

    try {
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          closeDBConnection(db);
        },
      });

      const value = await idbdb.get(storeName, key);

      closeDBConnection(idbdb);

      return value;
    } catch (err) {
      console.error(`${IDBORM}: ${storeName}.get(${key}): ${err}`);
    }

    return undefined;
  };

  public delete = async (key: IDBObjectKey): Promise<boolean | undefined> => {
    const { db, dbVersionController, storeName } = this;
    const { closeDBConnection } = IDBObject;

    try {
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          closeDBConnection(db);
        },
      });

      await idbdb.delete(storeName, key);

      closeDBConnection(idbdb);

      return true;
    } catch (err) {
      console.error(`${IDBORM}: ${storeName}.delete(${key}): ${err}`);
    }

    return undefined;
  };

  public keys = async (): Promise<IDBObjectKey[]> => {
    const { db, storeName, dbVersionController } = this;
    const { closeDBConnection } = IDBObject;

    try {
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          closeDBConnection(db);
        },
      });

      const keys = await idbdb.getAllKeys(storeName);

      closeDBConnection(idbdb);

      return keys;
    } catch (err) {
      console.error(`${IDBORM}: ${storeName}.keys(): ${err}`);
    }

    return [];
  };

  public values = async <Value = any>(): Promise<Value[]> => {
    const { db, storeName, dbVersionController } = this;
    const { closeDBConnection } = IDBObject;

    try {
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          closeDBConnection(db);
        },
      });

      const values = idbdb.getAll(storeName);

      closeDBConnection(idbdb);

      return values;
    } catch (err) {
      console.error(`${IDBORM}: ${storeName}.values(): ${err}`);
    }

    return [];
  };

  public entries = async <Value = any>(): Promise<Entry<Value>[]> => {
    const { storeName } = this;
    try {
      const keyAndValues = await Promise.all([this.keys(), this.values()]);

      return keyAndValues?.[0].map((key: IDBObjectKey, idx: number) => [key, keyAndValues?.[1][idx]]) || [];
    } catch (err) {
      console.error(`${IDBORM}: ${storeName}.entries(): ${err}`);
    }

    return [];
  };

  public clear = async (): Promise<boolean | undefined> => {
    const { db, storeName, dbVersionController } = this;
    const { closeDBConnection } = IDBObject;

    try {
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          closeDBConnection(db);
        },
      });

      await idbdb.clear(this.storeName);

      closeDBConnection(idbdb);

      return true;
    } catch (err) {
      console.error(`${IDBORM}: ${storeName}.clear(): ${err}`);
    }

    return undefined;
  };

  public iterate = async <Value = any>(callbackfn: EntriesIteratorCallbackfn<Value>): Promise<any[]> => {
    const { entries } = this;

    const _entries = await entries();

    return Promise.all(_entries.map(callbackfn));
  };
}
