"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
exports.IDBORM = "idborm";
exports.IDBErrors = {
    // TODO: handle not access error properly
    noAccessToRequireStuff: exports.IDBORM + ": cannot access to \"window.localstorage\" or \"window.indexedDB\"",
    noDatabaseName: exports.IDBORM + ": dataBaseName is required.",
    noObjectStore: exports.IDBORM + ": objectStore(s) is not provided.",
};
