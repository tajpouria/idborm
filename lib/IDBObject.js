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
var typings_1 = require("./typings");
var IDBObject = /** @class */ (function () {
    /** @ignore */
    function IDBObject(db, _a) {
        var _this = this;
        var name = _a.name, options = _a.options;
        /**
         * Put a record in the database
         * Replaces items with the same keys
         *
         * @param value - item's value
         *
         * @param key - item's key **when no option (keyPath or autoIncrement) specified this argument is required**
         *
         * @typeparam Value - value's type
         *
         * @returns Recorded value
         *
         * Using `id` as objectStore keyPath option :
         * ```ts
         * await Todo.put({ id: 1, content: 'Pet my cat' })
         * ```
         * Using autoIncrement option :
         * ```ts
         * await Todo.put({ content: 'Pet my cat' })
         * ```
         * No option (keyPath or autoIncrement) provided :
         * ```ts
         * await Todo.put({ content: 'Pet my cat' }, 'task one')
         * ```
         */
        this.put = function (value, key) {
            var _a = _this, db = _a.db, storeName = _a.storeName;
            return db
                .then(function (_db) {
                var tx = _db.transaction(storeName, "readwrite");
                var store = tx.objectStore(storeName);
                store.put(value, key);
                return tx.done;
            })
                .then(function () { return value; })
                .catch(function (err) {
                throw new Error(typings_1.IDBORM + ": " + storeName + ".put(" + value + (key ? ", " + key : "") + "): " + err);
            });
        };
        /**
         * Get a record from database
         *
         * @param key - item's key
         *
         * @typeparam Value - value's type
         *
         * @returns Recorded value
         *
         * Get record with key `task one`
         * ```ts
         * await Todo.get('task one')
         * ```
         */
        this.get = function (key) { return __awaiter(_this, void 0, void 0, function () {
            var _a, db, storeName;
            return __generator(this, function (_b) {
                _a = this, db = _a.db, storeName = _a.storeName;
                return [2 /*return*/, db
                        .then(function (_db) {
                        var tx = _db.transaction(storeName, "readwrite");
                        var store = tx.objectStore(storeName);
                        return store.get(key);
                    })
                        .catch(function (err) {
                        throw new Error(typings_1.IDBORM + ": " + storeName + ".get(" + key + "): " + err);
                    })];
            });
        }); };
        /**
         * Delete a record from database
         *
         * @param key - item's key
         *
         * Delete record with key `task one`
         * ```ts
         * await Todo.delete('task one')
         * ```
         */
        this.delete = function (key) { return __awaiter(_this, void 0, void 0, function () {
            var _a, db, storeName;
            var _this = this;
            return __generator(this, function (_b) {
                _a = this, db = _a.db, storeName = _a.storeName;
                return [2 /*return*/, db
                        .then(function (_db) { return __awaiter(_this, void 0, void 0, function () {
                        var tx, store;
                        return __generator(this, function (_a) {
                            tx = _db.transaction(storeName, "readwrite");
                            store = tx.objectStore(storeName);
                            store.delete(key);
                            return [2 /*return*/, tx.done];
                        });
                    }); })
                        .catch(function (err) {
                        throw new Error(typings_1.IDBORM + ": " + storeName + ".get(" + key + "): " + err);
                    })];
            });
        }); };
        /**
         * Retrieves the keys of records in an object store
         *
         * @returns A list containing all object store keys
         *
         * ```ts
         * await Todo.keys()
         * ```
         */
        this.keys = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, db, storeName;
            var _this = this;
            return __generator(this, function (_b) {
                _a = this, db = _a.db, storeName = _a.storeName;
                return [2 /*return*/, db
                        .then(function (_db) { return __awaiter(_this, void 0, void 0, function () {
                        var tx, store;
                        return __generator(this, function (_a) {
                            tx = _db.transaction(storeName, "readwrite");
                            store = tx.objectStore(storeName);
                            return [2 /*return*/, store.getAllKeys()];
                        });
                    }); })
                        .catch(function (err) {
                        throw new Error(typings_1.IDBORM + ": " + storeName + ".keys(): " + err);
                    })];
            });
        }); };
        /**
         * Retrieves the values of records in an object store
         *
         * @typeparam Value - value's type
         *
         * @returns An list containing all object store values
         *
         * ```ts
         * await Todo.values()
         * ```
         */
        this.values = function () {
            var _a = _this, db = _a.db, storeName = _a.storeName;
            return db
                .then(function (_db) { return __awaiter(_this, void 0, void 0, function () {
                var tx, store;
                return __generator(this, function (_a) {
                    tx = _db.transaction(storeName, "readwrite");
                    store = tx.objectStore(storeName);
                    return [2 /*return*/, store.getAll()];
                });
            }); })
                .catch(function (err) {
                throw new Error(typings_1.IDBORM + ": " + storeName + ".values(): " + err);
            });
        };
        /**
         * Retrieves an 2D matrix containing keys and values of records in an object store
         *
         * @typeparam Value - value's type
         *
         * @returns List of arrays that each array contains record's key and value
         *
         * ```ts
         * await Todo.entries()
         * ```
         */
        this.entries = function () { return __awaiter(_this, void 0, void 0, function () {
            var storeName, keyAndValues_1, err_1;
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
                        err_1 = _b.sent();
                        throw new Error(typings_1.IDBORM + ": " + storeName + ".entries(): " + err_1);
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Delete all records stored in an object store
         *
         * ```ts
         * await Todo.clear()
         * ```
         */
        this.clear = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, db, storeName;
            return __generator(this, function (_b) {
                _a = this, db = _a.db, storeName = _a.storeName;
                return [2 /*return*/, db
                        .then(function (_db) {
                        var tx = _db.transaction(storeName, "readwrite");
                        var store = tx.objectStore(storeName);
                        store.clear();
                        return tx.done;
                    })
                        .catch(function (err) {
                        throw new Error(typings_1.IDBORM + ": " + storeName + ".clear(): " + err);
                    })];
            });
        }); };
        /**
         * Iterate over all the record in an object store and perform an async action on each one
         *
         * @param callbackfn - async callback(action)
         *
         * @typeparam Value - async callback returns type
         *
         * @returns A list contains async action results
         *
         * Delete all completed task :
         * ```ts
         * await Todo.iterate(([key, value], index, entries) => {
         *  if (value.completed) return Todo.delete(key);
         * })
         * ```
         */
        this.iterate = function (callbackfn) { return __awaiter(_this, void 0, void 0, function () {
            var entries, _entries;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        entries = this.entries;
                        return [4 /*yield*/, entries()];
                    case 1:
                        _entries = _a.sent();
                        return [2 /*return*/, Promise.all(_entries.map(callbackfn))];
                }
            });
        }); };
        this.db = db;
        this.storeName = name;
        this.storeOptions = options;
    }
    return IDBObject;
}());
exports.IDBObject = IDBObject;
