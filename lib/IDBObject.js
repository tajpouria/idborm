"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var idb_1 = require("idb");
var typings_1 = require("./typings");
var IDBObject = /** @class */ (function () {
    function IDBObject(db, _a, dbVersionController) {
        var _this = this;
        var name = _a.name, options = _a.options;
        this.put = function (value, key) { return __awaiter(_this, void 0, void 0, function () {
            var _a, db, dbVersionController, storeName, storeOptions, closeDBConnection, idbdb, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, db = _a.db, dbVersionController = _a.dbVersionController, storeName = _a.storeName, storeOptions = _a.storeOptions;
                        closeDBConnection = IDBObject.closeDBConnection;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, idb_1.openDB(db.name, dbVersionController.incDbVersion(), {
                                blocked: function () {
                                    closeDBConnection(db);
                                },
                            })];
                    case 2:
                        idbdb = _b.sent();
                        return [4 /*yield*/, idbdb.put(storeName, value, key)];
                    case 3:
                        _b.sent();
                        closeDBConnection(idbdb);
                        return [2 /*return*/, value];
                    case 4:
                        err_1 = _b.sent();
                        throw new Error(typings_1.IDBORM + ": " + storeName + ".put(" + key + "): " + err_1);
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.get = function (key) { return __awaiter(_this, void 0, void 0, function () {
            var _a, db, dbVersionController, storeName, closeDBConnection, idbdb, value, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, db = _a.db, dbVersionController = _a.dbVersionController, storeName = _a.storeName;
                        closeDBConnection = IDBObject.closeDBConnection;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, idb_1.openDB(db.name, dbVersionController.incDbVersion(), {
                                blocked: function () {
                                    closeDBConnection(db);
                                },
                            })];
                    case 2:
                        idbdb = _b.sent();
                        return [4 /*yield*/, idbdb.get(storeName, key)];
                    case 3:
                        value = _b.sent();
                        closeDBConnection(idbdb);
                        return [2 /*return*/, value];
                    case 4:
                        err_2 = _b.sent();
                        console.error(typings_1.IDBORM + ": " + storeName + ".get(" + key + "): " + err_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, null];
                }
            });
        }); };
        this.delete = function (key) { return __awaiter(_this, void 0, void 0, function () {
            var _a, db, dbVersionController, storeName, closeDBConnection, idbdb, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, db = _a.db, dbVersionController = _a.dbVersionController, storeName = _a.storeName;
                        closeDBConnection = IDBObject.closeDBConnection;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, idb_1.openDB(db.name, dbVersionController.incDbVersion(), {
                                blocked: function () {
                                    closeDBConnection(db);
                                },
                            })];
                    case 2:
                        idbdb = _b.sent();
                        return [4 /*yield*/, idbdb.delete(storeName, key)];
                    case 3:
                        _b.sent();
                        closeDBConnection(idbdb);
                        return [2 /*return*/, true];
                    case 4:
                        err_3 = _b.sent();
                        console.error(typings_1.IDBORM + ": " + storeName + ".delete(" + key + "): " + err_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, undefined];
                }
            });
        }); };
        this.keys = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, db, storeName, dbVersionController, closeDBConnection, idbdb, keys, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, db = _a.db, storeName = _a.storeName, dbVersionController = _a.dbVersionController;
                        closeDBConnection = IDBObject.closeDBConnection;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, idb_1.openDB(db.name, dbVersionController.incDbVersion(), {
                                blocked: function () {
                                    closeDBConnection(db);
                                },
                            })];
                    case 2:
                        idbdb = _b.sent();
                        return [4 /*yield*/, idbdb.getAllKeys(storeName)];
                    case 3:
                        keys = _b.sent();
                        closeDBConnection(idbdb);
                        return [2 /*return*/, keys];
                    case 4:
                        err_4 = _b.sent();
                        console.error(typings_1.IDBORM + ": " + storeName + ".keys(): " + err_4);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, []];
                }
            });
        }); };
        this.values = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, db, storeName, dbVersionController, closeDBConnection, idbdb, values, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, db = _a.db, storeName = _a.storeName, dbVersionController = _a.dbVersionController;
                        closeDBConnection = IDBObject.closeDBConnection;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, idb_1.openDB(db.name, dbVersionController.incDbVersion(), {
                                blocked: function () {
                                    closeDBConnection(db);
                                },
                            })];
                    case 2:
                        idbdb = _b.sent();
                        values = idbdb.getAll(storeName);
                        closeDBConnection(idbdb);
                        return [2 /*return*/, values];
                    case 3:
                        err_5 = _b.sent();
                        console.error(typings_1.IDBORM + ": " + storeName + ".values(): " + err_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, []];
                }
            });
        }); };
        this.entries = function () { return __awaiter(_this, void 0, void 0, function () {
            var storeName, keyAndValues_1, err_6;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        storeName = this.storeName;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.all([this.keys(), this.values()])];
                    case 2:
                        keyAndValues_1 = _b.sent();
                        return [2 /*return*/, ((_a = keyAndValues_1) === null || _a === void 0 ? void 0 : _a[0].map(function (key, idx) { var _a; return [key, (_a = keyAndValues_1) === null || _a === void 0 ? void 0 : _a[1][idx]]; })) || []];
                    case 3:
                        err_6 = _b.sent();
                        console.error(typings_1.IDBORM + ": " + storeName + ".entries(): " + err_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, []];
                }
            });
        }); };
        this.clear = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, db, storeName, closeDBConnection, idbdb, err_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, db = _a.db, storeName = _a.storeName;
                        closeDBConnection = IDBObject.closeDBConnection;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, idb_1.openDB(db.name, db.version + 1, {
                                blocked: function () {
                                    closeDBConnection(db);
                                },
                            })];
                    case 2:
                        idbdb = _b.sent();
                        return [4 /*yield*/, idbdb.clear(this.storeName)];
                    case 3:
                        _b.sent();
                        closeDBConnection(idbdb);
                        return [2 /*return*/, true];
                    case 4:
                        err_7 = _b.sent();
                        console.error(typings_1.IDBORM + ": " + storeName + ".clear(): " + err_7);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, undefined];
                }
            });
        }); };
        this.db = db;
        this.dbVersionController = dbVersionController;
        this.storeName = name;
        this.storeOptions = options;
    }
    IDBObject.closeDBConnection = function (db) { return db.close(); };
    return IDBObject;
}());
exports.IDBObject = IDBObject;
