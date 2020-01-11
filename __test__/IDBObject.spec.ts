import IDB from "../lib";
import { repeater, randomIntFromInterval, randomString, createReferenceDB } from "./utils";

const TEST_TARGET = "IDBObject CLASS";

describe(TEST_TARGET, () => {
  describe("Create ObjectStore", () => {
    it("Massive case", async () => {
      const randomNumber = randomIntFromInterval(50, 60);

      const RefDB = await createReferenceDB("ref");

      const TestDB = await IDB.init("TestDB", () => {
        const objectStores = repeater(() => ({ name: randomString() }), randomNumber);

        return objectStores;
      });

      const { os } = RefDB.objectStores;

      let _osCount = 0;

      TestDB.objectStores.methods.iterate((_os, idx) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        _osCount = idx! + 1;

        Object.keys(os).forEach(key => {
          expect(_os).toHaveProperty(key);
        });
      });

      expect(_osCount).toBe(randomNumber);
    });
  });
});
