// idborm: do not edit following line manually
importScripts('./idborm-utility.js');

// idborm: do not edit following line manually
importScripts("./idborm-utility.js");

const { IDB } = idborm;

self.addEventListener("install", event => {
  console.log("V1 installing…");
});

self.addEventListener("fetch", async event => {
  console.log("V1 fetching…");

  const DB = await IDB.init("TestDB", 2, () => {
    return [
      { name: "JS", options: { autoIncrement: true } },
      { name: "Perl", options: { autoIncrement: true } },
    ];
  });

  const { JS } = DB.objectStores;

  await JS.put("helloWorld");

  const values = await JS.values();

  console.log(values);
});
