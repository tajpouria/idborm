import IDB from "../lib";
import { repeater, randomIntFromInterval, randomString, createReferenceDB } from "./utils";

const TEST_TARGET = "IDB CLASS";

/* 
 IDB:
    create database:
      creating massive multiple database X

    delete database:
      deleting massive multiple database

    create object store;
      creating massive multiple object store

    modify object store initializer;
      delete a certain field
      change a certain field name
      modify option
*/

describe(TEST_TARGET, () => {
  describe("Create database", () => {
    it("Massive case", async () => {
      const refDB = await createReferenceDB();

      const randomNumber = randomIntFromInterval(15, 20);

      const res = await Promise.all(
        repeater(async () => {
          return IDB.init(randomString(), { name: "os" });
        }, randomNumber),
      );

      expect(res.length).toBe(randomNumber);

      res.forEach(Idb => {
        Object.keys(refDB).forEach(key => {
          expect(Idb).toHaveProperty(key);
        });
      });
    });
  });

  describe("Delete database", () => {
    it("Massive case", async () => {
      // console.log(dbs);
    });
  });
});
