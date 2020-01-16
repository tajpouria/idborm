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
Object.defineProperty(exports, "__esModule", { value: true });
var typings_1 = require("./typings");
var IDBVersionController = /** @class */ (function () {
    function IDBVersionController(dataBaseName) {
        var _this = this;
        this.shouldUpdateStores = {};
        this.getIdbormStorageCurrentDb = function (selector) {
            var _a, _b, _c;
            var _d = _this, idbormStorage = _d.idbormStorage, dataBaseName = _d.dataBaseName;
            if (selector.objectStores && !selector.version) {
                return ((_a = idbormStorage[dataBaseName]) === null || _a === void 0 ? void 0 : _a.objectStores) || {};
            }
            if (selector.version && !selector.objectStores) {
                return (_b = idbormStorage[dataBaseName]) === null || _b === void 0 ? void 0 : _b.version;
            }
            return (_c = idbormStorage) === null || _c === void 0 ? void 0 : _c[dataBaseName];
        };
        this.deleteDbVersion = function () {
            var _a = _this, idbormStorage = _a.idbormStorage, dataBaseName = _a.dataBaseName;
            delete idbormStorage[dataBaseName];
            return _this.localStorage.setItem(typings_1.IDBORM, JSON.stringify(__assign({}, idbormStorage)));
        };
        if (!window.localStorage || !window.indexedDB || !JSON) {
            throw new Error(typings_1.IDBErrors.noAccessToRequireStuff);
        }
        this.dataBaseName = dataBaseName;
        this.localStorage = window.localStorage;
        if (!this.idbormStorage) {
            this.localStorage.setItem(typings_1.IDBORM, JSON.stringify({}));
        }
    }
    Object.defineProperty(IDBVersionController.prototype, "idbormStorage", {
        get: function () {
            return JSON.parse(this.localStorage.getItem(typings_1.IDBORM));
        },
        enumerable: true,
        configurable: true
    });
    IDBVersionController.prototype.incDbVersion = function (objectStores) {
        var _a, _b;
        var _this = this;
        var _c = this, dataBaseName = _c.dataBaseName, idbormStorage = _c.idbormStorage, getIdbormStorageCurrentDb = _c.getIdbormStorageCurrentDb, localStorage = _c.localStorage;
        this.shouldUpdateStores = {};
        var currentObjectStores = getIdbormStorageCurrentDb({ objectStores: true });
        if (objectStores) {
            Object.entries(objectStores).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                if (currentObjectStores[key] && JSON.stringify(currentObjectStores[key]) !== JSON.stringify(value)) {
                    _this.shouldUpdateStores[key] = value;
                }
            });
            localStorage.setItem(typings_1.IDBORM, JSON.stringify(__assign(__assign({}, idbormStorage), (_a = {}, _a[dataBaseName] = {
                objectStores: objectStores,
                version: (getIdbormStorageCurrentDb({ version: true }) || 0) + 1,
            }, _a))));
        }
        else {
            localStorage.setItem(typings_1.IDBORM, JSON.stringify(__assign(__assign({}, idbormStorage), (_b = {}, _b[dataBaseName] = {
                objectStores: getIdbormStorageCurrentDb({ objectStores: true }),
                version: getIdbormStorageCurrentDb({ version: true }) + 1,
            }, _b))));
        }
        return getIdbormStorageCurrentDb({ version: true });
    };
    return IDBVersionController;
}());
exports.IDBVersionController = IDBVersionController;
