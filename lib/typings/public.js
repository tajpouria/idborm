"use strict";
/* istanbul ignore file */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDBORM = "idborm";
exports.IDBErrors = {
    noAccessToRequireStuff: exports.IDBORM + ":FATALError: localStorage or indexedDB is not available.",
    noDatabaseName: exports.IDBORM + ": dataBaseName is required.",
    noObjectStore: exports.IDBORM + ": objectStore(s) is not provided.",
};
