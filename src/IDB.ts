import { openDB, IDBPDatabase, deleteDB } from "idb";

import { IDBObject, IDBVersionController } from ".";
import { IDBErrors, IDBORM, ObjectStoreInitializer } from "./typings";

type ObjectStoreInitializerFunction = () => ObjectStoreInitializer | ObjectStoreInitializer[];

export class IDB {
  public dataBaseName: string;

  private db: IDBPDatabase<unknown>;

  objectStoresMap: Record<string, IDBObject> = {};

  dbVersionController: IDBVersionController;

  constructor(
    dataBaseName: string,
    db: IDBPDatabase<unknown>,
    objectStoresMap: Record<string, IDBObject>,
    dbVersionController: IDBVersionController,
  ) {
    this.dataBaseName = dataBaseName;
    this.db = db;
    this.dbVersionController = dbVersionController;
    this.objectStoresMap = objectStoresMap;
  }

  private static objectStoreDictionaryCreator(
    objectStores: ObjectStoreInitializer | ObjectStoreInitializer[] | ObjectStoreInitializerFunction,
  ): Record<string, ObjectStoreInitializer> {
    const _objectStores = typeof objectStores === "function" ? objectStores() : objectStores;

    const objectStoresDictionary: Record<string, ObjectStoreInitializer> = {};

    if (Array.isArray(_objectStores)) {
      _objectStores.forEach(os => {
        objectStoresDictionary[os.name] = os;
      });
    } else {
      objectStoresDictionary[_objectStores.name] = _objectStores;
    }

    return objectStoresDictionary;
  }

  public static init = async (
    dataBaseName: string,
    objectStores: ObjectStoreInitializer | ObjectStoreInitializer[] | ObjectStoreInitializerFunction,
  ): Promise<IDB> => {
    if (!dataBaseName) {
      throw new Error(IDBErrors.noDatabaseName);
    } else if (!objectStores || (Array.isArray(objectStores) && !objectStores.length)) {
      throw new Error(IDBErrors.noObjectStore);
    }

    const dbVersionController = new IDBVersionController(dataBaseName);

    const objectStoreDictionary = IDB.objectStoreDictionaryCreator(objectStores);

    const objectStoresMap: Record<string, IDBObject> = {};

    try {
      const idbdb = await openDB(dataBaseName, dbVersionController.incDbVersion(objectStoreDictionary), {
        upgrade(db) {
          Object.values(objectStoreDictionary).forEach(os => {
            const _options = os.options?.autoIncrement || os.options?.keyPath ? os.options : { autoIncrement: true };

            if (!db.objectStoreNames.contains(os.name)) {
              db.createObjectStore(os.name, _options);
            }

            if (dbVersionController.shouldUpdateStores[os.name]) {
              db.deleteObjectStore(os.name);

              db.createObjectStore(os.name, _options);
            }

            objectStoresMap[os.name] = new IDBObject(db, { name: os.name, options: _options }, dbVersionController);
          });

          Object.values(db.objectStoreNames).forEach(os => {
            if (!objectStoresMap[os]) {
              db.deleteObjectStore(os);
            }
          });
        },
      });

      idbdb.close();

      return new IDB(dataBaseName, idbdb, objectStoresMap, dbVersionController);
    } catch (error) {
      throw new Error(`${IDBORM}: ${error}`);
    }
  };

  get objectStores(): Record<string, IDBObject> {
    return this.objectStoresMap;
  }

  public iterateOverObjectStores = (
    callbackfn: (objectStore?: IDBObject, index?: number, ObjectStoresArray?: IDBObject[]) => any,
  ): void => Object.values(this.objectStores).forEach(callbackfn);

  public delete = async (): Promise<void> => {
    const { db, dbVersionController } = this;

    const closeDBConnection = (): void => db.close();

    return deleteDB(this.dataBaseName, {
      blocked() {
        closeDBConnection();
      },
    }).then(() => {
      dbVersionController.deleteDbVersion();
    });
  };
}
