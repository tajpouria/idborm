/**
 * Access idborm.IDB Using idborm binary script:
 *
 *  $ node_modules/bin/idborm --serviceworker <PATH_TO_SERVICE_WORKER>
 */

/** "idborm": Following code snippet is required to access the "IDB"*/
importScripts("./idborm.iife.js");
const { IDB } = idborm;

const TestDB = IDB.init("TetsDB", 3, () => {
  return [
    { name: "JS", options: { keyPath: "id" } },
    { name: "Perl", options: { keyPath: "id" } },
    { name: "C", options: { keyPath: "id" } },
    { name: "CPP" },
  ];
});

self.addEventListener("install", event => {
  console.log("V1 installing…");
});

self.addEventListener("fetch", async event => {
  const { CPP } = TestDB.objectStores;

  CPP.put("hello", "love");

  const entries = await CPP.entries();

  console.log(entries);
});
