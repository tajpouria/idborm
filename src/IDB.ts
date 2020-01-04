import { openDB, IDBPDatabase, deleteDB } from "idb";

import { IDBObject, BaseIDB } from ".";
import { IDBErrors } from "./typings";

export interface ObjectStoreInitializer {
  name: string;
  options?: IDBObjectStoreParameters;
}

export class IDB extends BaseIDB {
  public dataBaseName: string;

  private db: IDBPDatabase<unknown>;

  objectStoresMap: Record<string, IDBObject> = {};

  constructor(dataBaseName: string, db: IDBPDatabase<unknown>, objectStoresMap: Record<string, IDBObject>) {
    super();

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
        });

        return new IDB(dataBaseName, idbdb, objectStoresMap);
      } catch (error) {
        console.error(error);
      }
    })(1);
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
