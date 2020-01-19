export declare const IDBORM = "idborm";
export declare const IDBErrors: {
    noDatabaseName: string;
    noObjectStore: string;
};
export interface ObjectStoreInitializer {
    name: string;
    options?: IDBObjectStoreParameters;
}
