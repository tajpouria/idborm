// If you are using "idborm" as a node module, Use "import IDB from 'idborm';" instead of following line
import IDB from "../../../src";

(async (): Promise<undefined> => {
  const MyDataBase = await IDB.init("MyDataBase", () => {
    // return [{ name: "PY" }, { name: "Perl" }];
    return [{ name: "os" }, { name: "he" }];
  });

  MyDataBase.objectStores.methods.iterate((os, idx, array) => {
    console.log(os, idx, array);
  });

  const { he } = MyDataBase.objectStores;

  console.log(he);

  const t0 = performance.now();
  const SecondDataBase = await IDB.init("SecondDataBase", { name: "User" });

  await SecondDataBase.delete();

  // const { PY, Perl } = os;

  // await PY.put(
  //   "longArray",
  //   Array.from({ length: 500 }, () => 100),
  // );

  // await Perl.put(
  //   "longArray",
  //   Array.from({ length: 500 }, () => 200),
  // );

  // await PY.keys();

  const t1 = performance.now();

  console.log(t1 - t0);

  return undefined;
})();
