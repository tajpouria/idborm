"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
exports.IDBORM = "idborm";
exports.IDBErrors = {
    noAccessToRequireStuff: exports.IDBORM + ": localStorage or indexedDB is not provided.",
    noDatabaseName: exports.IDBORM + ": dataBaseName is required.",
    noObjectStore: exports.IDBORM + ": objectStore(s) is not provided.",
};
