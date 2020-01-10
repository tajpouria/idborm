import IDB from "../../src";

export const createReferenceDB = async (): Promise<IDB> => IDB.init("ref", { name: "os" });
