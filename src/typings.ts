export const IDBORM = "idborm";

export const IDBErrors = {
  // TODO: handle not access error properly
  noAccessToRequireStuff: `${IDBORM}: cannot access to "window.localstorage" or "window.indexedDB"`,
  noDatabaseName: `${IDBORM}: dataBaseName is required.`,
  noObjectStore: `${IDBORM}: objectStore(s) is not provided.`,
};
