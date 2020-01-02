import * as idb from "idb";

const IDBORM = "idborm";

type IDBObjectKey = string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange;

export class IDBObject {
  constructor(private db: idb.IDBPDatabase<unknown>, private storeName: string) {}

  public set = async (key: IDBObjectKey, value: any) => {
    const closeDBConnection = () => {
      this.db.close();

      this.set(key, value);
    };
    try {
      const db = await idb.openDB(this.db.name, this.db.version + 1, {
        blocked() {
          closeDBConnection();
        },
      });

      return db.put(this.storeName, value, key);
    } catch (err) {
      console.error(`${IDBORM}: unknown exception "${this.storeName}.set(${key})".`, err);
    }
  };

  public get = async (key: IDBObjectKey) => {
    const closeDBConnection = () => this.db.close();

    try {
      const db = await idb.openDB(this.db.name, this.db.version + 1, {
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
      const db = await idb.openDB(this.db.name, this.db.version + 1, {
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
      const db = await idb.openDB(this.db.name, this.db.version + 1, {
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
      const db = await idb.openDB(this.db.name, this.db.version + 1, {
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
      const db = await idb.openDB(this.db.name, this.db.version + 1, {
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
