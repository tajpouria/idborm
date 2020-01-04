import { openDB, IDBPDatabase, deleteDB } from "idb";

import { IDBObject } from "./IDBObject";
import { IDBErrors } from "./typings";

export interface ObjectStoreInitializer {
  name: string;
  options?: IDBObjectStoreParameters;
}

export class IDB {
  private dbName: string;

  private db: IDBPDatabase<unknown>;

  objectStoresMap: Record<string, IDBObject> = {};

  constructor(dbName: string, db: IDBPDatabase<unknown>, objectStoresMap: Record<string, IDBObject>) {
    this.dbName = dbName;
    this.db = db;
    this.objectStoresMap = objectStoresMap;
  }

  public static init = async (
    dataBaseName: string,
    objectStores: ObjectStoreInitializer | ObjectStoreInitializer[],
  ): Promise<IDB> => {
    if (!dataBaseName) {
      console.error(IDBErrors.noDatabaseName);
      throw new Error(IDBErrors.noDatabaseName);
    } else if (!objectStores || (Array.isArray(objectStores) && !objectStores.length)) {
      console.error(IDBErrors.noObjectStore);
      throw new Error(IDBErrors.noObjectStore);
    }

    const objectStoresList = Array.isArray(objectStores) ? objectStores : [objectStores];

    return (async function identifyDB(version: number): Promise<IDB> {
      const objectStoresMap: Record<string, IDBObject> = {};

      try {
        const idbdb = await openDB(dataBaseName, version, {
          upgrade(db) {
            objectStoresList.forEach(os => {
              if (!db.objectStoreNames.contains(os.name)) {
                db.createObjectStore(os.name, os.options || { autoIncrement: true });
              }

              objectStoresMap[os.name] = new IDBObject(db, os.name);
            });
          },

          blocking() {
            console.log("blocking ");
          },
        });

        return new IDB(dataBaseName, idbdb, objectStoresMap);
      } catch (_error) {
        console.log(_error);
        debugger;
        return identifyDB(version + 1);
      }
    })(1);
  };

  get objectStores(): Record<string, IDBObject> {
    return this.objectStoresMap;
  }

  public delete = async (): Promise<void> => {
    const closeDBConnection = (): void => this.db.close();

    return deleteDB(this.dbName, {
      blocked() {
        closeDBConnection();
      },
    });
  };
}
