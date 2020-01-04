import { IDBORM, IDBErrors } from "./typings";

export abstract class BaseIDB {
  abstract dataBaseName: string;

  private localStorage: Storage;

  constructor() {
    // TODO: check for localStorage and ETC properly
    if (!window.localStorage || !indexedDB || !JSON) {
      throw new Error(IDBErrors.noAccessToRequireStuff);
    }
    localStorage.setItem(IDBORM, JSON.stringify({}));
    this.localStorage = window.localStorage;
  }

  protected get dbVersion(): number {
    return JSON.parse(this.localStorage.getItem(IDBORM) as string)[this.dataBaseName] || 0;
  }

  protected get idbormStorage(): Record<string, number> {
    return JSON.parse(this.localStorage.getItem(IDBORM) as string);
  }

  protected incDbVersion = (): number => {
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

  protected deleteDbVersion = (): undefined => {
    const { idbormStorage, dataBaseName } = this;

    delete idbormStorage[dataBaseName];

    this.localStorage.setItem(IDBORM, JSON.stringify({ ...this.idbormStorage }));

    return undefined;
  };
}
