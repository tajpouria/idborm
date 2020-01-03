import { openDB, IDBPDatabase, deleteDB } from "idb";

import { IDBObject } from "./IDBObject";

const IDBORM = "idborm";

export class IDB {
  private dbName: string;

  private db: IDBPDatabase<unknown>;

  constructor(dbName: string, db: IDBPDatabase<unknown>) {
    this.dbName = dbName;
    this.db = db;
  }

  public static init = async (dataBaseName: string): Promise<IDB> => {
    if (!dataBaseName) {
      console.error(`${IDBORM}: dataBaseName is required.`);
      throw new Error(`${IDBORM}: dataBaseName is required.`);
    }

    return (async function identifyDB(version: number): Promise<IDB> {
      try {
        const idbdb = await openDB(dataBaseName, version);
        return new IDB(dataBaseName, idbdb);
      } catch (error) {
        return identifyDB(version + 1);
      }
    })(1);
  };

  get objectStores(): string[] {
    const idbObjectStores = this.db.objectStoreNames;
    return Object.keys(idbObjectStores).map(objectStore => idbObjectStores[+objectStore]);
  }

  public createObjectStore = async (
    objectStoreName: string,
    options: IDBObjectStoreParameters = { autoIncrement: true },
  ): Promise<IDBObject> => {
    const closeDBConnection = (): void => this.db.close();

    try {
      if (!this.db.objectStoreNames.contains(objectStoreName)) {
        await openDB(this.dbName, this.db.version + 2, {
          upgrade(db) {
            db.createObjectStore(objectStoreName, options);
          },
          blocked() {
            closeDBConnection();
          },
        });
      }

      return new IDBObject(this.db, objectStoreName);
    } catch (err) {
      console.error(IDBORM, err);
      throw new Error(err);
    }
  };

  public delete = async (): Promise<void> => {
    const closeDBConnection = (): void => this.db.close();

    return deleteDB(this.dbName, {
      blocked() {
        closeDBConnection();
      },
    });
  };
}
