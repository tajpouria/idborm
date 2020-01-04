// If you are using "idborm" as a node module, Use "import IDB from 'idborm';" instead of following line
import IDB from "../../../src";

(async (): Promise<undefined> => {
  const MyDataBase = await IDB.init("MyDataBase", [
    { name: "User" },
    { name: "Post" },
    { name: "Articles" },
    { name: "People" },
    { name: "Lean" },
    { name: "hello" },
    { name: "monday" },
  ]);

  const { User } = MyDataBase.objectStores;

  await User.put("hello", "wake up");

  // const User = await MyDataBase.createObjectStore("User");

  // const userOne = await User.put("key one", { name: "value one" });

  // const Post = await MyDataBase.createObjectStore("Post");
  // const post1 = await Post.put("post one", { title: "value 1" });

  return undefined;
})();
