import { IDBORM, IDBErrors, ObjectStoreInitializer } from "./typings";

interface StorageDbInstance {
  objectStores: Record<string, ObjectStoreInitializer>;
  version: number;
}

export class IDBVersionController {
  private dataBaseName: string;

  private localStorage: Storage;

  public shouldUpdateStores: Record<string, any> = {};

  constructor(dataBaseName: string) {
    // TODO: check for localStorage and ETC properly
    if (!window.localStorage || !indexedDB || !JSON) {
      throw new Error(IDBErrors.noAccessToRequireStuff);
    }

    this.dataBaseName = dataBaseName;
    this.localStorage = window.localStorage;

    if (!this.idbormStorage) {
      this.localStorage.setItem(IDBORM, JSON.stringify({}));
    }
  }

  public get idbormStorage(): Record<string, StorageDbInstance> {
    return JSON.parse(this.localStorage.getItem(IDBORM) as string);
  }

  public getIdbormStorageCurrentDb = (selector: {
    objectStores?: boolean;
    version?: boolean;
  }): StorageDbInstance | Record<string, ObjectStoreInitializer> | number => {
    const { idbormStorage, dataBaseName } = this;

    if (selector.objectStores && !selector.version) {
      return idbormStorage[dataBaseName]?.objectStores || {};
    }

    if (selector.version && !selector.objectStores) {
      return idbormStorage[dataBaseName]?.version;
    }

    return idbormStorage?.[dataBaseName];
  };

  public incDbVersion(objectStores?: Record<string, ObjectStoreInitializer>): number {
    const { dataBaseName, idbormStorage, getIdbormStorageCurrentDb, localStorage } = this;

    this.shouldUpdateStores = {};

    const currentObjectStores = getIdbormStorageCurrentDb({ objectStores: true }) as Record<
      string,
      ObjectStoreInitializer
    >;

    if (objectStores) {
      Object.entries(objectStores).forEach(([key, value]) => {
        if (currentObjectStores[key] && JSON.stringify(currentObjectStores[key]) !== JSON.stringify(value)) {
          this.shouldUpdateStores[key] = value;
        }
      });

      localStorage.setItem(
        IDBORM,
        JSON.stringify({
          ...idbormStorage,
          [dataBaseName]: {
            objectStores,
            version: ((getIdbormStorageCurrentDb({ version: true }) || 0) as number) + 1,
          },
        }),
      );
    } else {
      localStorage.setItem(
        IDBORM,
        JSON.stringify({
          ...idbormStorage,
          [dataBaseName]: {
            objectStores: getIdbormStorageCurrentDb({ objectStores: true }),
            version: (getIdbormStorageCurrentDb({ version: true }) as number) + 1,
          },
        }),
      );
    }

    return getIdbormStorageCurrentDb({ version: true }) as number;
  }

  public deleteDbVersion = (): void => {
    const { idbormStorage, dataBaseName } = this;

    delete idbormStorage[dataBaseName];

    return this.localStorage.setItem(IDBORM, JSON.stringify({ ...idbormStorage }));
  };
}
