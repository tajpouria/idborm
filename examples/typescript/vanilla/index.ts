// If you are using "idborm" as a node module, Use "import IDB from 'idborm';" instead of following line
import IDB from "../../../src";

(async (): Promise<undefined> => {
  const MyDataBase = await IDB.init("MyDataBase", [
    { name: "JS", options: { keyPath: "id" } },
    { name: "PY", options: {} },
    { name: "C" },
    { name: "Cpp" },
    { name: "Perl" },
  ]);

  const { JS, PY, C, Perl } = MyDataBase.objectStores;

  await Perl.put("key1", "test");
  await Perl.put("key2", "test2");

  await PY.put("key1", "test1");

  await PY.put("key2", { name: "python" });

  await C.put("key", { length: 50 });

  const perlEntries = await Perl.entries();
  const PyEntries = await PY.entries();
  const CEntries = await C.entries();

  console.log(perlEntries);
  console.log(PyEntries);
  console.log(CEntries);

  return undefined;
})();
