// If you are using "idborm" as a node module, Use "import IDB from 'idborm';" instead of following line
import IDB from "../../../src";

(async (): Promise<undefined> => {
  const MyDataBase = await IDB.init("MyDataBase", () => {
    // return [{ name: "PY" }, { name: "Perl" }];
    return [{ name: "os" }, { name: "he", options: { keyPath: "id" } }];
  });

  const t0 = performance.now();

  const { he, os } = MyDataBase.objectStores;

  await he.put({ id: "index1", value: "some value" });
  await he.put({ value: "some value", id: "this is the key" });

  await os.put(["data"], "myKey");
  await os.put("data two", "yourKey");

  const entries = await he.entries();

  console.log(entries);

  const t1 = performance.now();

  console.log(t1 - t0);

  return undefined;
})();
