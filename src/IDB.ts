import { openDB, IDBPDatabase, deleteDB } from "idb";

import { IDBObject, IDBVersionController } from ".";
import { IDBErrors, IDBORM } from "./typings";

export interface ObjectStoreInitializer {
  name: string;
  options?: IDBObjectStoreParameters;
}

export class IDB {
  public dataBaseName: string;

  private db: IDBPDatabase<unknown>;

  objectStoresMap: Record<string, IDBObject> = {};

  constructor(dataBaseName: string, db: IDBPDatabase<unknown>, objectStoresMap: Record<string, IDBObject>) {
    this.dataBaseName = dataBaseName;
    this.db = db;
    this.objectStoresMap = objectStoresMap;
  }

  public static init = async (
    dataBaseName: string,
    objectStores: ObjectStoreInitializer | ObjectStoreInitializer[],
  ): Promise<IDB> => {
    if (!dataBaseName) {
      throw new Error(IDBErrors.noDatabaseName);
    } else if (!objectStores || (Array.isArray(objectStores) && !objectStores.length)) {
      throw new Error(IDBErrors.noObjectStore);
    }

    const dbVersionController = new IDBVersionController(dataBaseName);

    const objectStoresList = Array.isArray(objectStores) ? objectStores : [objectStores];

    const objectStoresMap: Record<string, IDBObject> = {};

    try {
      const idbdb = await openDB(dataBaseName, dbVersionController.incDbVersion(), {
        upgrade(db) {
          objectStoresList.forEach(os => {
            // TODO: override objectStore if associated options changed
            if (!db.objectStoreNames.contains(os.name)) {
              const _options = os.options?.autoIncrement || os.options?.keyPath ? os.options : { autoIncrement: true };

              db.createObjectStore(os.name, _options);
            }

            objectStoresMap[os.name] = new IDBObject(db, os.name, dbVersionController);
          });

          Object.values(db.objectStoreNames).forEach(os => {
            if (!objectStoresMap[os]) {
              db.deleteObjectStore(os);
            }
          });

          // TODO: handle the case database deleted manually or programmatically
        },
      });

      return new IDB(dataBaseName, idbdb, objectStoresMap);
    } catch (error) {
      throw new Error(`${IDBORM}: ${error}`);
    }
  };

  get objectStores(): Record<string, IDBObject> {
    return this.objectStoresMap;
  }

  public delete = async (): Promise<void> => {
    const closeDBConnection = (): void => this.db.close();

    return deleteDB(this.dataBaseName, {
      blocked() {
        closeDBConnection();
      },
    });
  };
}
