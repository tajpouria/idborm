import { IDBORM, IDBErrors } from "./typings";

export class IDBVersionController {
  private dataBaseName: string;

  private localStorage: Storage;

  constructor(dataBaseName: string) {
    // TODO: check for localStorage and ETC properly
    if (!window.localStorage || !indexedDB || !JSON) {
      throw new Error(IDBErrors.noAccessToRequireStuff);
    }

    this.dataBaseName = dataBaseName;
    this.localStorage = localStorage;

    if (!this.idbormStorage) {
      localStorage.setItem(IDBORM, JSON.stringify({}));
    }
  }

  public get dbVersion(): number {
    return JSON.parse(this.localStorage.getItem(IDBORM) as string)[this.dataBaseName] || 0;
  }

  public get idbormStorage(): Record<string, number> {
    return JSON.parse(this.localStorage.getItem(IDBORM) as string);
  }

  public incDbVersion = (): number => {
    const { idbormStorage, dataBaseName, dbVersion } = this;

    this.localStorage.setItem(
      IDBORM,
      JSON.stringify({
        ...idbormStorage,
        [dataBaseName]: (idbormStorage[dataBaseName] || 0) + 1,
      }),
    );

    return dbVersion;
  };

  public deleteDbVersion = (): undefined => {
    const { idbormStorage, dataBaseName } = this;

    delete idbormStorage[dataBaseName];

    this.localStorage.setItem(IDBORM, JSON.stringify({ ...this.idbormStorage }));

    return undefined;
  };
}
