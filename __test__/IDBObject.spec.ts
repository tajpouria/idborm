import IDB from "../lib";
import { repeater, randomIntFromInterval, randomString } from "./utils";

const TEST_TARGET = "IDBObject CLASS";

/*
  IDBObject
    put
      massive case
        keyPath
        autoIncrement
        Implicit key

    get
      massive case
        keyPath
        autoIncrement
        Implicit key

    delete
      massive case
        keyPath
        autoIncrement
        Implicit key

    keys
      massive case
        keyPath
        autoIncrement
        Implicit key

    values
      massive case
        keyPath
        autoIncrement
        Implicit key

    clear
      massive case
*/

describe(TEST_TARGET, () => {
  describe("Put", () => {
    describe("Massive case", () => {
      it("Records using keyPath index", async () => {
        const TestDB = await IDB.init("TestDB", { name: "JS", options: { keyPath: "id" } });

        const { JS } = TestDB.objectStores;

        const randomNumber = randomIntFromInterval(100, 150);

        await Promise.all(repeater(() => JS.put({ id: randomString() }), randomNumber));

        const entries = await JS.entries();

        expect(entries.length).toBe(randomNumber);
        expect(
          entries.forEach(([key, value]) => {
            if (!key || !value) return true;
          }),
        ).toBeFalsy();
      });

      it("Records using autoIncrement index", async () => {
        const TestDB = await IDB.init("TestDB", { name: "JS", options: { autoIncrement: true } });

        const { JS } = TestDB.objectStores;

        const randomNumber = randomIntFromInterval(100, 150);

        await Promise.all(repeater(() => JS.put(randomString()), randomNumber));

        const entries = await JS.entries();

        expect(entries.length).toBe(randomNumber);
        expect(
          entries.forEach(([key, value], index) => {
            if (!key || key !== index + 1 || !value) return true;
          }),
        ).toBeFalsy();
      });

      it("Records using defined key", async () => {
        const TestDB = await IDB.init("TestDB", { name: "JS" });

        const { JS } = TestDB.objectStores;

        const randomNumber = randomIntFromInterval(100, 150);

        await Promise.all(repeater(() => JS.put(randomString(), randomString()), randomNumber));

        const entries = await JS.entries();

        expect(entries.length).toBe(randomNumber);
        expect(
          entries.forEach(([key, value], index) => {
            if (!key || key !== index + 1 || !value) return true;
          }),
        ).toBeFalsy();
      });
    });

    describe("Edge case", () => {
      const DATA_ERROR = "DataError";

      it("Throw error when keyPath option is specified and value is not contains associated key", async () => {
        try {
          const TestDB = await IDB.init("TestDB", { name: "JS", options: { keyPath: "id" } });

          const { JS } = TestDB.objectStores;

          JS.put({ value: "hello" });
        } catch (error) {
          expect(error.name).toBe(DATA_ERROR);
        }
      });

      // it("Throw error when no option and key not provided", async () => {
      //   try {
      //     const TestDB = await IDB.init("TestDB", { name: "JS" });

      //     const { JS } = TestDB.objectStores;

      //     JS.put({ value: "hello" });
      //   } catch (error) {
      //     expect(error.name).toBe(DATA_ERROR);
      //   }
      // });
    });
  });
});
