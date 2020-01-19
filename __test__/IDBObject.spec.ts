import IDB, { IDBObject } from "../src";
import { repeater, randomIntFromInterval, randomString } from "./utils";

const TEST_TARGET = "IDBObject CLASS";

describe(TEST_TARGET, () => {
  describe("put get keys values entries iterate clear", () => {
    const testObjectStore = async (OS: IDBObject, dataCount: number): Promise<void> => {
      // Keys
      const keys = await OS.keys();
      expect(keys.length).toBe(dataCount);

      // iterate
      const getValues = await OS.iterate(([key]) => OS.get(key));

      // values
      const values = await OS.values();
      expect(values).toEqual(getValues);

      // entries
      const entries = await OS.entries();
      expect(entries.length).toBe(dataCount);
      expect(
        entries.forEach(([key, value]) => {
          if (!key || !value) return true;
        }),
      ).toBeFalsy();

      // delete
      await OS.delete(keys[0]);
      const deleteValue = await OS.get(keys[0]);
      expect(deleteValue).toBeUndefined();

      // clear
      await OS.clear();
      const clearedEntries = await OS.entries();
      expect(clearedEntries.length).toBe(0);
    };

    describe("Massive case", () => {
      it("Records using **keyPath** index", async () => {
        const TestDB = await IDB.init(randomString(), 1, { name: "JS", options: { keyPath: "id" } });

        const { JS } = TestDB.objectStores;

        const randomNumber = randomIntFromInterval(100, 150);

        await Promise.all(repeater(() => JS.put({ id: randomString() }), randomNumber));

        await testObjectStore(JS, randomNumber);
      });

      it("Records using **autoIncrement** index", async () => {
        const TestDB = await IDB.init(randomString(), 1, { name: "TS", options: { autoIncrement: true } });

        const { TS } = TestDB.objectStores;

        const randomNumber = randomIntFromInterval(100, 150);

        await Promise.all(repeater(() => TS.put(randomString()), randomNumber));

        await testObjectStore(TS, randomNumber);
      });

      it("Records using **defined** key index", async () => {
        const TestDB = await IDB.init(randomString(), 1, { name: "C" });

        const { C } = TestDB.objectStores;

        const randomNumber = randomIntFromInterval(100, 150);

        await Promise.all(repeater(() => C.put(randomString(), randomString()), randomNumber));

        await testObjectStore(C, randomNumber);
      });
    });
  });
});
