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

  console.log(MyDataBase.objectStores);
  const { JS, PY, C, Perl } = MyDataBase.objectStores;

  Perl.put("key1", "test");

  // const User = await MyDataBase.createObjectStore("User");

  // const userOne = await User.put("key one", { name: "value one" });

  // const Post = await MyDataBase.createObjectStore("Post");
  // const post1 = await Post.put("post one", { title: "value 1" });

  return undefined;
})();
