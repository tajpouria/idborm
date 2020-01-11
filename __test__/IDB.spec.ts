import IDB from "../lib";
import { repeater, randomIntFromInterval, randomString, createReferenceDB, isObjectStoreValid } from "./utils";
import { IDBErrors } from "../src/typings";

const TEST_TARGET = "IDB CLASS";

/* 
 IDB:
    create database:
      massive case
      edge case:
        no name throw an error
        no initializer throw an error

    delete database:
      massive case

    createObjectStore
      massive case
      create a certain field 
      delete a certain field
      modify option
      iterate method
*/

describe(TEST_TARGET, () => {
  describe("Create database", () => {
    it("Massive case", async () => {
      const refDB = await createReferenceDB("ref");

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

    describe("Edge case", () => {
      it("Throw Error if name not provided", async () => {
        try {
          // @ts-ignore
          await IDB.init();
        } catch (err) {
          expect(err.message).toBe(IDBErrors.noDatabaseName);
        }
      });

      it("Throw Error if objectStore initializer is not provided", async () => {
        try {
          // @ts-ignore
          await IDB.init("name");
        } catch (err) {
          expect(err.message).toBe(IDBErrors.noObjectStore);
        }
      });
    });
  });

  describe("Delete database", () => {
    it("Massive case", async () => {});
  });

  describe("Create ObjectStore", () => {
    it("Massive case", async () => {
      const randomNumber = randomIntFromInterval(50, 60);

      const TestDB = await IDB.init("TestDB", () => {
        const objectStores = repeater(() => ({ name: randomString() }), randomNumber);

        return objectStores;
      });

      const RefDB = await createReferenceDB("ref");
      const { os } = RefDB.objectStores;

      let _osCount = 0;

      TestDB.objectStores.methods.iterate((_os, idx) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        _osCount = idx! + 1;

        expect(isObjectStoreValid(_os, os as any)).toBeTruthy();
      });

      expect(_osCount).toBe(randomNumber);
    });

    it("Update objectStores, on adding new objectStore", async () => {
      let TestDB = await IDB.init("TestDB", [{ name: "PY", options: { keyPath: "id" } }]);

      expect(TestDB.objectStores).not.toHaveProperty("JS");
      expect(TestDB.objectStores).toHaveProperty("PY");

      TestDB = await IDB.init("TestDB", [
        { name: "PY", options: { keyPath: "id" } },
        { name: "JS", options: { keyPath: "id" } },
      ]);

      expect(TestDB.objectStores).toHaveProperty("JS");
      expect(TestDB.objectStores).toHaveProperty("PY");
    });

    it("delete, removed object store from objectStores", async () => {
      let TestDB = await IDB.init("TestDB", [
        { name: "JS", options: { keyPath: "id" } },
        { name: "PY", options: { keyPath: "id" } },
      ]);

      expect(TestDB.objectStores).toHaveProperty("JS");
      expect(TestDB.objectStores).toHaveProperty("PY");

      TestDB = await IDB.init("TestDB", [{ name: "PY", options: { keyPath: "id" } }]);

      expect(TestDB.objectStores).not.toHaveProperty("JS");
      expect(TestDB.objectStores).toHaveProperty("PY");
    });

    it("Update objectStores, on modifying options", async () => {
      let TestDB = await IDB.init("TestDB", [{ name: "JS", options: { keyPath: "id" } }]);

      let { JS } = TestDB.objectStores;

      // @ts-ignore
      expect(JS.storeOptions).toEqual({ keyPath: "id" });

      TestDB = await IDB.init("TestDB", [{ name: "JS", options: { keyPath: "changed", autoIncrement: true } }]);

      JS = TestDB.objectStores.JS;

      // @ts-ignore
      expect(JS.storeOptions).toEqual({ keyPath: "changed", autoIncrement: true });
    });

    it("IDB.objectStore.methods.iterate iterate over objectStores", async () => {
      const randomNumber = randomIntFromInterval(10, 20);

      const TestDB = await IDB.init("TestDB", () => {
        const objectStores = repeater(() => ({ name: randomString() }), randomNumber);

        return objectStores;
      });

      const RefDB = await createReferenceDB("ref");
      const { os } = RefDB.objectStores;

      let _osCount = 0;

      TestDB.objectStores.methods.iterate((_os, idx, osArray) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        _osCount = idx! + 1;

        expect(isObjectStoreValid(_os, os as any)).toBeTruthy();

        expect(typeof idx === "number").toBeTruthy();
        expect(Array.isArray(osArray)).toBeTruthy();
      });

      expect(_osCount).toBe(randomNumber);
    });
  });
});
