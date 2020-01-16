#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */

require("v8-compile-cache");

const fs = require("fs");
const path = require("path");

const IDBORM = "idborm";
const IDBORM_UTILITY = `${IDBORM}-utility.js`;
const IMPORT_SCRIPT_CONTENT = `// ${IDBORM}: do not edit following line manually\r\nimportScripts('./${IDBORM_UTILITY}');\r\n`;

const args = require("minimist")(process.argv.slice(2));

process.once("uncaughtException", err => {
  console.error(IDBORM, err);
  process.exitCode = 2;
});

const swPath = args.serviceworker;

if (swPath) {
  fs.readFile(swPath, "utf8", (err, targetData) => {
    if (err) {
      console.error(IDBORM, err.message);
      process.exitCode = 2;
    }

    fs.writeFile(swPath, [IMPORT_SCRIPT_CONTENT, targetData].join("\n"), writeServiceWorkerFileError => {
      if (writeServiceWorkerFileError) {
        console.error(IDBORM, writeServiceWorkerFileError.message);
        process.exitCode = 2;
      }

      console.info(`${IDBORM}: "${swPath}" modified successfully. ✔`);

      fs.readFile(
        path.resolve(__dirname, `../lib/${IDBORM_UTILITY}`),
        "utf8",
        (readIdbORMUtilityFileError, idbORMUtility) => {
          if (err) {
            console.error(IDBORM, readIdbORMUtilityFileError.message);
            process.exitCode = 2;
          }

          const swPathArr = swPath.split("/");
          swPathArr[swPathArr.length - 1] = IDBORM_UTILITY;
          const utilityPath = swPathArr.join("/");

          fs.writeFile(utilityPath, idbORMUtility, writeIdbORMUtilityFileError => {
            if (err) {
              console.error(IDBORM, writeIdbORMUtilityFileError.message);
              process.exitCode = 2;
            }

            console.info(`${IDBORM}: "${utilityPath}" created successfully. ✔`);
            process.exitCode = 0;
          });
        },
      );
    });
  });
} else {
  console.error(`${IDBORM}: --serviceworker <path to your service worker> not specified correctly.`);
  process.exit(1);
}
