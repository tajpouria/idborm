import IDB from "../../src";
import { IDBObject } from "../../lib";

export const createReferenceDB = async (dbName = "RefDB"): Promise<IDB> => IDB.init(dbName, { name: "os" });

export const isObjectStoreValid = (_os: IDBObject | undefined, refOS: IDBObject): boolean => {
  if (!_os || !refOS) return false;

  Object.keys(refOS).forEach(key => {
    // @ts-ignore
    if (!_os[key]) return false;
  });

  return true;
};

// @ts-ignore
export const dataBases = async (): Promise<{ name: string; version: number }[]> => indexedDB.databases();
