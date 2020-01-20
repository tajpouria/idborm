// idborm: do not edit following line manually
importScripts('./idborm-utility.js');

// idborm: do not edit following line manually
importScripts("./idborm-utility.js");

self.addEventListener("install", event => {
  console.log("V1 installing…");
});

self.addEventListener("fetch", event => {
  console.log("V1 fetching…");
});
