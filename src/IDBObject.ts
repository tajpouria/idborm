import { openDB, IDBPDatabase } from "idb";

import { IDBVersionController } from ".";
import { IDBORM, ObjectStoreInitializer } from "./typings";

type IDBObjectKey = string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange;

export class IDBObject {
  private db: IDBPDatabase<unknown>;

  private dbVersionController: IDBVersionController;

  private storeName: string;

  private storeOptions: IDBObjectStoreParameters | undefined;

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
    const { db, dbVersionController } = this;

    const closeDBConnection = (): void => db.close();

    try {
      closeDBConnection();
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          console.log("blocked put");
          closeDBConnection();
        },
      });

      this.db = idbdb;

      await idbdb.put(this.storeName, value, key).then(() => {
        db.close();
      });

      return value;
    } catch (err) {
      console.error(IDBORM, err);
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

      return idbdb.get(this.storeName, key).then(value => {
        idbdb.close();
        return value;
      });
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

      return idbdb.delete(this.storeName, key).then(() => idbdb.close());
    } catch (err) {
      console.error(IDBORM, err);
      return undefined;
    }
  };

  public keys = async (): Promise<IDBObjectKey[]> => {
    const { db, storeName, dbVersionController } = this;

    const closeDBConnection = (): void => db.close();

    try {
      closeDBConnection();
      const idbdb = await openDB(db.name, dbVersionController.incDbVersion(), {
        blocked() {
          console.log("blocked keys");
          closeDBConnection();
        },
      });

      return idbdb.getAllKeys(storeName).then(keys => {
        idbdb.close();
        return keys;
      });
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
          console.log("blocked values");
          closeDBConnection();
        },
      });

      return idbdb.getAll(storeName).then(values => {
        idbdb.close();
        return values;
      });
    } catch (err) {
      console.error(IDBORM, err);
      return [];
    }
  };

  public entries = async (): Promise<[IDBObjectKey, any][]> => {
    try {
      const keyAndValues = await Promise.all<IDBObjectKey[], any[]>([this.keys(), this.values()]);

      return keyAndValues?.[0].map((key: IDBObjectKey, idx: number) => [key, keyAndValues?.[1][idx]]);
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

      return idbdb
        .clear(this.storeName)
        .then(() => {
          idbdb.close();
          return true;
        })
        .catch(() => {
          idbdb.close();
          return false;
        });
    } catch (err) {
      console.error(IDBORM, err);
      return undefined;
    }
  };
}
