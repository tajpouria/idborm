import { openDB, IDBPDatabase } from "idb";

import { IDBVersionController } from ".";
import { IDBORM } from "./typings";

type IDBObjectKey = string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange;

export class IDBObject {
  private db: IDBPDatabase<unknown>;

  private dbVersionController: IDBVersionController;

  private storeName: string;

  constructor(db: IDBPDatabase<unknown>, storeName: string, dbVersionController: IDBVersionController) {
    this.db = db;
    this.dbVersionController = dbVersionController;
    this.storeName = storeName;
  }

  public put = async (key: IDBObjectKey, value: any): Promise<any> => {
    const { db, dbVersionController } = this;

    const closeDBConnection = (): void => db.close();

    try {
      const idbdb = await openDB(this.db.name, dbVersionController.incDbVersion(), {
        blocked() {
          return closeDBConnection();
        },
      });

      await idbdb.put(this.storeName, value, key);

      return this.get(key);
    } catch (err) {
      console.error(err);
      return undefined;
    }
  };

  public get = async (key: IDBObjectKey) => {
    const closeDBConnection = (): void => this.db.close();

    try {
      const db = await openDB(this.db.name, this.db.version + 1, {
        blocked() {
          closeDBConnection();
        },
      });

      return db.get(this.storeName, key);
    } catch (err) {
      console.error(IDBORM, err);
    }
  };

  public delete = async (key: IDBObjectKey) => {
    const closeDBConnection = () => this.db.close();

    try {
      const db = await openDB(this.db.name, this.db.version + 1, {
        blocked() {
          closeDBConnection();
        },
      });

      return db.delete(this.storeName, key);
    } catch (err) {
      console.error(IDBORM, err);
    }
  };

  public keys = async () => {
    const closeDBConnection = () => this.db.close();

    try {
      const db = await openDB(this.db.name, this.db.version + 1, {
        blocked() {
          closeDBConnection();
        },
      });

      return db.getAllKeys(this.storeName);
    } catch (err) {
      console.error(IDBORM, err);
    }
  };

  public values = async () => {
    try {
      const entries = await this.entries();

      return entries && entries.length ? entries.map(entry => entry) : [];
    } catch (err) {
      console.error(IDBORM, err);
    }
  };

  public entries = async () => {
    const closeDBConnection = () => this.db.close();

    try {
      const db = await openDB(this.db.name, this.db.version + 1, {
        blocked() {
          closeDBConnection();
        },
      });

      return db.getAll(this.storeName);
    } catch (err) {
      console.error(IDBORM, err);
    }
  };

  public clear = async () => {
    const closeDBConnection = () => this.db.close();

    try {
      const db = await openDB(this.db.name, this.db.version + 1, {
        blocked() {
          closeDBConnection();
        },
      });

      return db.clear(this.storeName);
    } catch (err) {
      console.error(IDBORM, err);
    }
  };
}
