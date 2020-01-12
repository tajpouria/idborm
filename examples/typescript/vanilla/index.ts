// If you are using "idborm" as a node module, Use "import IDB from 'idborm';" instead of following line
import IDB from "../../../src";

(async (): Promise<undefined> => {
  const MyDataBase = await IDB.init("MyDataBase", () => {
    // return [{ name: "PY" }, { name: "Perl" }];
    return [{ name: "os" }, { name: "he" }];
  });

  const t0 = performance.now();

  const { he } = MyDataBase.objectStores;

  await he.put(2, { value: "some value" });

  const entries = await he.entries();

  console.log(entries);

  const t1 = performance.now();

  console.log(t1 - t0);

  return undefined;
})();
