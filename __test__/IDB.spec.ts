import IDB from "../lib";
import { repeater, randomIntFromInterval } from "./utils";

const TEST_TARGET = "IDB class";

/* 
 IDB:
    create database:
      creating massive multiple database X
      version controller track right data X

    delete database:
      deleting massive multiple database
      version track right data 

    create object store;
      creating massive multiple object store

    modify object store initializer;
      delete a certain field
      change a certain field name
      modify option
*/

describe(TEST_TARGET, () => {
  describe("Creating database", () => {
    it("Massive case", async () => {
      const refDB = await IDB.init("ref", { name: "os" });

      const randomNumber = randomIntFromInterval(15, 20);

      const res = await Promise.all(
        repeater(async () => {
          return IDB.init(Math.random().toString(), { name: "os" });
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
});
