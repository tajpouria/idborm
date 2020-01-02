import * as idb from "idb";

import { IDBObject } from "./IDBObject";

const IDBORM = "idborm";

export default class IDB {
  protected objectStoresOptions: Record<string, IDBObjectStoreParameters> = {};

  constructor(private dbName: string, private db: idb.IDBPDatabase<unknown>) {}

  public static init = async (dataBaseName: string) => {
    if (!dataBaseName) {
      console.error(`${IDBORM}: dataBaseName is required.`);
      throw new Error(`${IDBORM}: dataBaseName is required.`);
    }

    // @ts-ignore //TODO: browser support
    const dataBases: { name: string; version: number }[] = await indexedDB.databases();

    const isAlreadyExist = dataBases.find(_database => _database.name === dataBaseName);

    const _version = isAlreadyExist?.version || 1;

    const idbdb = await idb.openDB(dataBaseName, _version);

    return new IDB(dataBaseName, idbdb);
  };

  get objectStores() {
    try {
      const idbObjectStores = this.db.objectStoreNames;

      const _objectStore: string[] = [];

      for (let key in idbObjectStores) {
        if (!["length", "item", "contains"].includes(key)) {
          _objectStore.push(idbObjectStores[+key]);
        }
      }

      return _objectStore;
    } catch (err) {
      console.error(`${IDBORM}: cannot get objectStores of ${this.dbName}`);
    }
  }

  public createObjectStore = async (
    objectStoreName: string,
    options: IDBObjectStoreParameters = { autoIncrement: true },
  ) => {
    const closeDBConnection = () => this.db.close();

    try {
      if (!this.db.objectStoreNames.contains(objectStoreName)) {
        await idb.openDB(this.dbName, this.db.version + 1, {
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
    }
  };

  public delete = async () => {
    const closeDBConnection = () => this.db.close();

    return await idb.deleteDB(this.dbName, {
      blocked() {
        closeDBConnection();
      },
    });
  };
}
