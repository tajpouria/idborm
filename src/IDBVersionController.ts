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
      this.localStorage.setItem(IDBORM, JSON.stringify({}));
    }
  }

  public get idbormStorage(): Record<string, number> {
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

    return idbormStorage[dataBaseName];
  };

  public deleteDbVersion = (): undefined => {
    const { idbormStorage, dataBaseName } = this;

    delete idbormStorage[dataBaseName];

    this.localStorage.setItem(IDBORM, JSON.stringify({ ...this.idbormStorage }));

    return undefined;
  };
}
