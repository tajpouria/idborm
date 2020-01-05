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
    this.localStorage = window.localStorage;

    if (!this.idbormStorage) {
      this.localStorage.setItem(IDBORM, JSON.stringify({}));
    }
  }

  private get idbormStorage(): Record<string, number> {
    return JSON.parse(this.localStorage.getItem(IDBORM) as string);
  }

  public incDbVersion = (): number => {
    const { idbormStorage, dataBaseName } = this;

    this.localStorage.setItem(
      IDBORM,
      JSON.stringify({
        ...idbormStorage,
        [dataBaseName]: (idbormStorage[dataBaseName] || 0) + 1,
      }),
    );

    return idbormStorage[dataBaseName] || 1;
  };

  public deleteDbVersion = (): void => {
    const { idbormStorage, dataBaseName } = this;

    delete idbormStorage[dataBaseName];

    return this.localStorage.setItem(IDBORM, JSON.stringify({ ...idbormStorage }));
  };
}
