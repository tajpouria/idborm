/* istanbul ignore file */

export const IDBORM = "idborm";

export const IDBErrors = {
  noDatabaseName: `${IDBORM}: dataBaseName is required.`,
  noObjectStore: `${IDBORM}: objectStore(s) is not provided.`,
};

export interface ObjectStoreInitializer {
  name: string;
  options?: IDBObjectStoreParameters;
}
