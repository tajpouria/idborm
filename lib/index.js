"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var IDB_1 = require("./IDB");
__export(require("./IDBObject"));
__export(require("./IDBVersionController"));
exports.default = IDB_1.IDB;
