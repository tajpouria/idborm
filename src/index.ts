/* istanbul ignore file */
(function() {
  const childProcess = require("child_process");
  const oldSpawn = childProcess.spawn;
  function mySpawn() {
    const result = oldSpawn.apply(this, arguments);
    return result;
  }
  childProcess.spawn = mySpawn;
})();

import { IDB } from "./IDB";

export * from "./IDBObject";

export default IDB;
