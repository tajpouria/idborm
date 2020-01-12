"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        this.iterateOverObjectStores = function (callbackfn) {
            return Object.values(_this.objectStoresMap).forEach(callbackfn);
        };
        this.delete = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, db, dbVersionController;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, db = _a.db, dbVersionController = _a.dbVersionController;
                        return [4 /*yield*/, idb_1.deleteDB(this.dataBaseName, {
                                blocked: function () {
                                    IDB.closeDBConnection(db);
                                },
                            })];
                    case 1:
                        _b.sent();
                        dbVersionController.deleteDbVersion();
                        return [2 /*return*/];
                }
            });
        }); };
        this.dataBaseName = dataBaseName;
        this.db = db;
        this.dbVersionController = dbVersionController;
        this.objectStoresMap = objectStoresMap;
    }
    Object.defineProperty(IDB.prototype, "objectStores", {
        get: function () {
            var _this = this;
            var iterateOverObjectStores = function (callbackfn) {
                _this.iterateOverObjectStores(callbackfn);
            };
            return __assign(__assign({}, this.objectStoresMap), { methods: {
                    // @ts-ignore
                    iterate: function (callbackfn) {
                        iterateOverObjectStores(callbackfn);
                    },
                } });
        },
        enumerable: true,
        configurable: true
    });
    IDB.objectStoreDictionaryCreator = function (objectStores) {
        var _objectStores = typeof objectStores === "function" ? objectStores() : objectStores;
        var objectStoresDictionary = {};
        if (Array.isArray(_objectStores)) {
            _objectStores.forEach(function (os) {
                objectStoresDictionary[os.name] = os;
            });
        }
        else {
            objectStoresDictionary[_objectStores.name] = _objectStores;
        }
        return objectStoresDictionary;
    };
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
                                    var name = os.name, options = os.options;
                                    if (!db.objectStoreNames.contains(name)) {
                                        db.createObjectStore(name, options);
                                    }
                                    if (dbVersionController.shouldUpdateStores[name]) {
                                        db.deleteObjectStore(name);
                                        db.createObjectStore(name, options);
                                    }
                                    objectStoresMap[os.name] = new _1.IDBObject(db, { name: name, options: options }, dbVersionController);
                                });
                                Object.values(db.objectStoreNames).forEach(function (os) {
                                    if (!objectStoresMap[os]) {
                                        db.deleteObjectStore(os);
                                    }
                                });
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
    IDB.closeDBConnection = function (db) { return db.close(); };
    return IDB;
}());
exports.IDB = IDB;
