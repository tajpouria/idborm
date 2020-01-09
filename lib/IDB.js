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
var _1 = require(".");
var typings_1 = require("./typings");
var IDB = /** @class */ (function () {
    function IDB(dataBaseName, db, objectStoresMap, dbVersionController) {
        var _this = this;
        this.objectStoresMap = {};
        this.delete = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, db, dbVersionController, closeDBConnection;
            return __generator(this, function (_b) {
                _a = this, db = _a.db, dbVersionController = _a.dbVersionController;
                closeDBConnection = function () { return db.close(); };
                return [2 /*return*/, idb_1.deleteDB(this.dataBaseName, {
                        blocked: function () {
                            closeDBConnection();
                        },
                    }).then(function () {
                        dbVersionController.deleteDbVersion();
                    })];
            });
        }); };
        this.dataBaseName = dataBaseName;
        this.db = db;
        this.dbVersionController = dbVersionController;
        this.objectStoresMap = objectStoresMap;
    }
    IDB.objectStoreDictionaryCreator = function (objectStores) {
        var objectStoresDictionary = {};
        if (Array.isArray(objectStores)) {
            objectStores.forEach(function (os) {
                objectStoresDictionary[os.name] = os;
            });
        }
        else {
            objectStoresDictionary[objectStores.name] = objectStores;
        }
        return objectStoresDictionary;
    };
    Object.defineProperty(IDB.prototype, "objectStores", {
        get: function () {
            return this.objectStoresMap;
        },
        enumerable: true,
        configurable: true
    });
    IDB.init = function (dataBaseName, objectStores) { return __awaiter(void 0, void 0, void 0, function () {
        var dbVersionController, objectStoreDictionary, objectStoresMap, idbdb, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dataBaseName) {
                        throw new Error(typings_1.IDBErrors.noDatabaseName);
                    }
                    else if (!objectStores || (Array.isArray(objectStores) && !objectStores.length)) {
                        throw new Error(typings_1.IDBErrors.noObjectStore);
                    }
                    dbVersionController = new _1.IDBVersionController(dataBaseName);
                    objectStoreDictionary = IDB.objectStoreDictionaryCreator(objectStores);
                    objectStoresMap = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, idb_1.openDB(dataBaseName, dbVersionController.incDbVersion(objectStoreDictionary), {
                            upgrade: function (db) {
                                Object.values(objectStoreDictionary).forEach(function (os) {
                                    var _a, _b;
                                    var _options = ((_a = os.options) === null || _a === void 0 ? void 0 : _a.autoIncrement) || ((_b = os.options) === null || _b === void 0 ? void 0 : _b.keyPath) ? os.options : { autoIncrement: true };
                                    if (!db.objectStoreNames.contains(os.name)) {
                                        db.createObjectStore(os.name, _options);
                                    }
                                    if (dbVersionController.shouldUpdateStores[os.name]) {
                                        db.deleteObjectStore(os.name);
                                        db.createObjectStore(os.name, _options);
                                    }
                                    objectStoresMap[os.name] = new _1.IDBObject(db, { name: os.name, options: _options }, dbVersionController);
                                });
                                Object.values(db.objectStoreNames).forEach(function (os) {
                                    if (!objectStoresMap[os]) {
                                        db.deleteObjectStore(os);
                                    }
                                });
                                // TODO: handle the case database deleted manually
                            },
                        })];
                case 2:
                    idbdb = _a.sent();
                    idbdb.close();
                    return [2 /*return*/, new IDB(dataBaseName, idbdb, objectStoresMap, dbVersionController)];
                case 3:
                    error_1 = _a.sent();
                    throw new Error(typings_1.IDBORM + ": " + error_1);
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return IDB;
}());
exports.IDB = IDB;
