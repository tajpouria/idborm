import IDB from "../src";
import {
  repeater,
  randomIntFromInterval,
  randomString,
  createReferenceDB,
  isObjectStoreValid,
  dataBases,
} from "./utils";
import { IDBErrors } from "../src/typings";

const TEST_TARGET = "IDB CLASS";

describe(TEST_TARGET, () => {
  describe("Create database", () => {
    it("Massive case", async () => {
      const refDB = await createReferenceDB("ref");

      const randomNumber = randomIntFromInterval(15, 20);

      const res = await Promise.all(
        repeater(async () => {
          return IDB.init(randomString(), 1, { name: "os" });
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
    it("Massive case", async () => {
      const randomNames = repeater(randomString, [15, 20]);

      const res = await Promise.all(randomNames.map(name => IDB.init(name, 1, { name: "os" })));

      await Promise.all(res.map(db => db.delete()));

      const _dataBases = await dataBases();

      expect(
        _dataBases.forEach(db => {
          if (randomNames.includes(db.name)) return true;
        }),
      ).toBeFalsy();
    });
  });

  describe("Create ObjectStore", () => {
    it("Massive case", async () => {
      const randomNumber = randomIntFromInterval(50, 60);

      const TestDB = await IDB.init(randomString(), 1, () => {
        const objectStores = repeater(() => ({ name: randomString() }), randomNumber);

        return objectStores;
      });

      const RefDB = await createReferenceDB("ref");
      const { os } = RefDB.objectStores;

      let _osCount = 0;

      TestDB.objectStores.methods.iterate(async (_os, idx) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        _osCount = idx! + 1;

        expect(isObjectStoreValid(_os, os as any)).toBeTruthy();
      });

      expect(_osCount).toBe(randomNumber);
    });

    it("Update objectStores, on adding new objectStore", async () => {
      let TestDB = await IDB.init(randomString(), 1, [{ name: "PY", options: { keyPath: "id" } }]);

      expect(TestDB.objectStores).not.toHaveProperty("JS");
      expect(TestDB.objectStores).toHaveProperty("PY");

      TestDB = await IDB.init(randomString(), 2, [
        { name: "PY", options: { keyPath: "id" } },
        { name: "JS", options: { keyPath: "id" } },
      ]);

      expect(TestDB.objectStores).toHaveProperty("JS");
      expect(TestDB.objectStores).toHaveProperty("PY");
    });

    it("delete, removed object store from objectStores", async () => {
      let TestDB = await IDB.init(randomString(), 1, [
        { name: "JS", options: { keyPath: "id" } },
        { name: "PY", options: { keyPath: "id" } },
      ]);

      expect(TestDB.objectStores).toHaveProperty("JS");
      expect(TestDB.objectStores).toHaveProperty("PY");

      TestDB = await IDB.init(randomString(), 2, [{ name: "PY", options: { keyPath: "id" } }]);

      expect(TestDB.objectStores).not.toHaveProperty("JS");
      expect(TestDB.objectStores).toHaveProperty("PY");
    });

    it("IDB.objectStore.methods.iterate iterate over objectStores", async () => {
      const randomNumber = randomIntFromInterval(10, 20);

      const TestDB = await IDB.init(randomString(), 1, () => {
        const objectStores = repeater(() => ({ name: randomString() }), randomNumber);

        return objectStores;
      });

      const RefDB = await createReferenceDB();
      const { os } = RefDB.objectStores;

      let _osCount = 0;

      TestDB.objectStores.methods.iterate(async (_os, idx, osArray) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        _osCount = idx! + 1;

        expect(isObjectStoreValid(_os, os as any)).toBeTruthy();

        expect(typeof idx === "number").toBeTruthy();
        expect(Array.isArray(osArray)).toBeTruthy();
      });

      expect(_osCount).toBe(randomNumber);
    });

    it("IDB.objectStore.methods.iterate handling async callbackfn on each operation successfully", async () => {
      const TestDB = await IDB.init(randomString(), 1, { name: "JS" });

      await TestDB.objectStores.methods.iterate(async _os => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        _os.put(randomString(), randomString());
      });

      const { JS } = TestDB.objectStores;

      const values = await JS.values();

      expect(values.length).toBe(1);
    });
  });
});
