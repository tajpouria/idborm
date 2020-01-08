// If you are using "idborm" as a node module, Use "import IDB from 'idborm';" instead of following line
import IDB from "../../../src";

(async (): Promise<undefined> => {
  const MyDataBase = await IDB.init("MyDataBase", [{ name: "JS" }, { name: "PY" }, { name: "Perl" }]);

  const t0 = performance.now();
  const SecondDataBase = await IDB.init("SecondDataBase", { name: "User" });

  await SecondDataBase.delete();

  const os = MyDataBase.objectStores;

  const { JS, PY, Perl } = os;

  await JS.put("hello", "monday");

  await PY.put(
    "longArray",
    Array.from({ length: 500 }, () => 100),
  );

  await Perl.put(
    "longArray",
    Array.from({ length: 500 }, () => 200),
  );

  await PY.keys();

  await JS.get("hello");

  const t1 = performance.now();

  console.log(t1 - t0);

  return undefined;
})();
