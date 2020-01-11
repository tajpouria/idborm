import { openDB, IDBPDatabase } from "idb";

import { IDBVersionController } from ".";
import { IDBORM, ObjectStoreInitializer } from "./typings";

type IDBObjectKey = string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange;

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

  public put = async <Value = any>(key: IDBObjectKey, value: Value): Promise<Value | undefined> => {
    const { db, dbVersionController, storeName } = this;

    const closeDBConnection = (): void => db.close();

    try {
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          closeDBConnection();
        },
      });

      await idbdb.put(storeName, value, key);

      idbdb.close();

      return value;
    } catch (err) {
      console.error(`${IDBORM}: ${storeName}.put(${key}) ${err}`);
      return undefined;
    }
  };

  public get = async <Value = any>(key: IDBObjectKey): Promise<Value | null> => {
    const { db, dbVersionController } = this;

    const closeDBConnection = (): void => db.close();

    try {
      const idbdb = await openDB(this.db.name, dbVersionController.incDbVersion(), {
        blocked() {
          closeDBConnection();
        },
      });

      const value = await idbdb.get(this.storeName, key);

      idbdb.close();

      return value;
    } catch (err) {
      console.error(IDBORM, err);
      return null;
    }
  };

  public delete = async (key: IDBObjectKey): Promise<void> => {
    const closeDBConnection = (): void => this.db.close();

    try {
      const idbdb = await openDB(this.db.name, this.db.version + 1, {
        blocked() {
          closeDBConnection();
        },
      });

      await idbdb.delete(this.storeName, key);

      idbdb.close();
    } catch (err) {
      console.error(IDBORM, err);
    }

    return undefined;
  };

  public keys = async (): Promise<IDBObjectKey[]> => {
    const { db, storeName, dbVersionController } = this;

    const closeDBConnection = (): void => db.close();

    try {
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          closeDBConnection();
        },
      });

      const keys = await idbdb.getAllKeys(storeName);

      idbdb.close();

      return keys;
    } catch (err) {
      console.error(IDBORM, err);
      return [];
    }
  };

  public values = async (): Promise<any[]> => {
    const { db, storeName, dbVersionController } = this;

    const closeDBConnection = (): void => db.close();

    try {
      closeDBConnection();
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          closeDBConnection();
        },
      });

      const values = idbdb.getAll(storeName);

      idbdb.close();

      return values;
    } catch (err) {
      console.error(IDBORM, err);
      return [];
    }
  };

  public entries = async (): Promise<[IDBObjectKey, any][]> => {
    try {
      const keyAndValues = await Promise.all<IDBObjectKey[], any[]>([this.keys(), this.values()]);

      return keyAndValues?.[0].map((key: IDBObjectKey, idx: number) => [key, keyAndValues?.[1][idx]]) || [];
    } catch (err) {
      console.error(IDBORM, err);
      return [];
    }
  };

  public clear = async (): Promise<boolean | undefined> => {
    const closeDBConnection = (): void => this.db.close();

    try {
      const idbdb = await openDB(this.db.name, this.db.version + 1, {
        blocked() {
          closeDBConnection();
        },
      });

      await idbdb.clear(this.storeName);

      idbdb.close();

      return true;
    } catch (err) {
      console.error(IDBORM, err);
      return undefined;
    }
  };
}
