import { openDB, IDBPDatabase } from "idb";

const IDBORM = "idborm";

type IDBObjectKey = string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange;

export class IDBObject {
  private db: IDBPDatabase<unknown>;

  private storeName: string;

  constructor(db: IDBPDatabase<unknown>, storeName: string) {
    this.db = db;
    this.storeName = storeName;
  }

  public put = async (key: IDBObjectKey, value: any): Promise<any> => {
    const closeDBConnection = async (): Promise<any> => {
      this.db.close();

      return this.put(key, value);
    };
    try {
      const db = await openDB(this.db.name, this.db.version, {
        blocked() {
          return closeDBConnection().then(res => res);
        },
      });

      await db.put(this.storeName, value, key);

      return this.get(key);
    } catch (err) {
      console.error(`${IDBORM}: exception on "${this.storeName}.put(${key})".`, err);
      return undefined;
    }
  };

  public get = async (key: IDBObjectKey) => {
    const closeDBConnection = () => this.db.close();

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
