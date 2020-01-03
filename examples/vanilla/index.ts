// If you are using "idborm" as a node module, Use "import IDB from 'idborm';" instead of following line
import IDB from "../../src";

(async (): Promise<undefined> => {
  const MyDataBase = await IDB.init("MyDataBase");

  const User = await MyDataBase.createObjectStore("User");

  await User.put("key one", "value one ");

  console.log(MyDataBase.objectStores);

  const Post = await MyDataBase.createObjectStore("Post");

  await Post.put("post one", { title: "value 1" });

  const entries = await Post.entries();

  console.log(entries);

  return undefined;
})();
