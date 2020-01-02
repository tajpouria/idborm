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
var idb = require("idb");
var IDBObject_1 = require("./IDBObject");
var IDBORM = "idborm";
var IDB = /** @class */ (function () {
    function IDB(dbName, db) {
        var _this = this;
        this.dbName = dbName;
        this.db = db;
        this.objectStoresOptions = {};
        this.createObjectStore = function (objectStoreName, options) {
            if (options === void 0) { options = { autoIncrement: true }; }
            return __awaiter(_this, void 0, void 0, function () {
                var closeDBConnection, err_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            closeDBConnection = function () { return _this.db.close(); };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            if (!!this.db.objectStoreNames.contains(objectStoreName)) return [3 /*break*/, 3];
                            return [4 /*yield*/, idb.openDB(this.dbName, this.db.version + 1, {
                                    upgrade: function (db) {
                                        db.createObjectStore(objectStoreName, options);
                                    },
                                    blocked: function () {
                                        closeDBConnection();
                                    },
                                })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, new IDBObject_1.IDBObject(this.db, objectStoreName)];
                        case 4:
                            err_1 = _a.sent();
                            console.error(IDBORM, err_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        this.delete = function () { return __awaiter(_this, void 0, void 0, function () {
            var closeDBConnection;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        closeDBConnection = function () { return _this.db.close(); };
                        return [4 /*yield*/, idb.deleteDB(this.dbName, {
                                blocked: function () {
                                    closeDBConnection();
                                },
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
    }
    Object.defineProperty(IDB.prototype, "objectStores", {
        get: function () {
            try {
                var idbObjectStores = this.db.objectStoreNames;
                var _objectStore = [];
                for (var key in idbObjectStores) {
                    if (!["length", "item", "contains"].includes(key)) {
                        _objectStore.push(idbObjectStores[+key]);
                    }
                }
                return _objectStore;
            }
            catch (err) {
                console.error(IDBORM + ": cannot get objectStores of " + this.dbName);
            }
        },
        enumerable: true,
        configurable: true
    });
    IDB.init = function (dataBaseName) { return __awaiter(void 0, void 0, void 0, function () {
        var dataBases, isAlreadyExist, _version, idbdb;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!dataBaseName) {
                        console.error(IDBORM + ": dataBaseName is required.");
                        throw new Error(IDBORM + ": dataBaseName is required.");
                    }
                    return [4 /*yield*/, indexedDB.databases()];
                case 1:
                    dataBases = _b.sent();
                    isAlreadyExist = dataBases.find(function (_database) { return _database.name === dataBaseName; });
                    _version = ((_a = isAlreadyExist) === null || _a === void 0 ? void 0 : _a.version) || 1;
                    return [4 /*yield*/, idb.openDB(dataBaseName, _version)];
                case 2:
                    idbdb = _b.sent();
                    return [2 /*return*/, new IDB(dataBaseName, idbdb)];
            }
        });
    }); };
    return IDB;
}());
exports.default = IDB;
