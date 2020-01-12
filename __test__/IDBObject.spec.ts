import IDB, { IDBObject } from "../src";
import { repeater, randomIntFromInterval, randomString } from "./utils";

const TEST_TARGET = "IDBObject CLASS";

describe(TEST_TARGET, () => {
  describe("put get keys values entries", () => {
    const testObjectStore = async (OS: IDBObject, dataCount: number): Promise<void> => {
      const keys = await OS.keys();
      expect(keys.length).toBe(dataCount);

      const getValues = await Promise.all(keys.map(key => OS.get(key)));

      const values = await OS.values();

      expect(values).toEqual(getValues);

      const entries = await OS.entries();
      expect(entries.length).toBe(dataCount);
      expect(
        entries.forEach(([key, value]) => {
          if (!key || !value) return true;
        }),
      ).toBeFalsy();

      await OS.delete(keys[0]);

      const deleteValue = await OS.get(keys[0]);

      expect(deleteValue).toBeUndefined();

      await OS.clear();

      const clearedEntries = await OS.entries();

      expect(clearedEntries.length).toBe(0);
    };

    describe("Massive case", () => {
      it("Records using **keyPath** index", async () => {
        const TestDB = await IDB.init("TestDB", { name: "JS", options: { keyPath: "id" } });

        const { JS } = TestDB.objectStores;

        const randomNumber = randomIntFromInterval(100, 150);

        await Promise.all(repeater(() => JS.put({ id: randomString() }), randomNumber));

        await testObjectStore(JS, randomNumber);
      });

      it("Records using **autoIncrement** index", async () => {
        const TestDB = await IDB.init("TestDB", { name: "JS", options: { autoIncrement: true } });

        const { JS } = TestDB.objectStores;

        const randomNumber = randomIntFromInterval(100, 150);

        await Promise.all(repeater(() => JS.put(randomString()), randomNumber));

        await testObjectStore(JS, randomNumber);
      });

      it("Records using **defined** key index", async () => {
        const TestDB = await IDB.init("TestDB", { name: "JS" });

        const { JS } = TestDB.objectStores;

        const randomNumber = randomIntFromInterval(100, 150);

        await Promise.all(repeater(() => JS.put(randomString(), randomString()), randomNumber));

        await testObjectStore(JS, randomNumber);
      });
    });
  });
});
