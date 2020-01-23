var idborm=function(t){"use strict";
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */var e=function(){return(e=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};function n(t,e,n,r){return new(n||(n=Promise))((function(o,i){function a(t){try{s(r.next(t))}catch(t){i(t)}}function c(t){try{s(r.throw(t))}catch(t){i(t)}}function s(t){t.done?o(t.value):new n((function(e){e(t.value)})).then(a,c)}s((r=r.apply(t,e||[])).next())}))}function r(t,e){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=e.call(t,a)}catch(t){i=[6,t],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}}let o,i;const a=new WeakMap,c=new WeakMap,s=new WeakMap,u=new WeakMap,f=new WeakMap;let d={get(t,e,n){if(t instanceof IDBTransaction){if("done"===e)return c.get(t);if("objectStoreNames"===e)return t.objectStoreNames||s.get(t);if("store"===e)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return v(t[e])},set:(t,e,n)=>(t[e]=n,!0),has:(t,e)=>t instanceof IDBTransaction&&("done"===e||"store"===e)||e in t};function h(t){return t!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(i||(i=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(...e){return t.apply(b(this),e),v(a.get(this))}:function(...e){return v(t.apply(b(this),e))}:function(e,...n){const r=t.call(b(this),e,...n);return s.set(r,e.sort?e.sort():[e]),v(r)}}function l(t){return"function"==typeof t?h(t):(t instanceof IDBTransaction&&function(t){if(c.has(t))return;const e=new Promise((e,n)=>{const r=()=>{t.removeEventListener("complete",o),t.removeEventListener("error",i),t.removeEventListener("abort",i)},o=()=>{e(),r()},i=()=>{n(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",o),t.addEventListener("error",i),t.addEventListener("abort",i)});c.set(t,e)}(t),e=t,(o||(o=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some(t=>e instanceof t)?new Proxy(t,d):t);var e}function v(t){if(t instanceof IDBRequest)return function(t){const e=new Promise((e,n)=>{const r=()=>{t.removeEventListener("success",o),t.removeEventListener("error",i)},o=()=>{e(v(t.result)),r()},i=()=>{n(t.error),r()};t.addEventListener("success",o),t.addEventListener("error",i)});return e.then(e=>{e instanceof IDBCursor&&a.set(e,t)}).catch(()=>{}),f.set(e,t),e}(t);if(u.has(t))return u.get(t);const e=l(t);return e!==t&&(u.set(t,e),f.set(e,t)),e}const b=t=>f.get(t);function p(t,{blocked:e}={}){const n=indexedDB.deleteDatabase(t);return e&&n.addEventListener("blocked",()=>e()),v(n).then(()=>{})}const w=["get","getKey","getAll","getAllKeys","count"],m=["put","add","delete","clear"],y=new Map;function j(t,e){if(!(t instanceof IDBDatabase)||e in t||"string"!=typeof e)return;if(y.get(e))return y.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,o=m.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!o&&!w.includes(n))return;const i=async function(t,...e){const i=this.transaction(t,o?"readwrite":"readonly");let a=i.store;r&&(a=a.index(e.shift()));const c=a[n](...e);return o&&await i.done,c};return y.set(e,i),i}d=(t=>({...t,get:(e,n,r)=>j(e,n)||t.get(e,n,r),has:(e,n)=>!!j(e,n)||t.has(e,n)}))(d);var g=function(t,e){var o=this,i=e.name,a=e.options;this.put=function(t,e){var n=o,r=n.db,i=n.storeName;return r.then((function(n){var r=n.transaction(i,"readwrite");return r.objectStore(i).put(t,e),r.done})).then((function(){return t})).catch((function(n){throw new Error(E+": "+i+".put("+t+(e?", "+e:"")+"): "+n)}))},this.get=function(t){return n(o,void 0,void 0,(function(){var e,n,o;return r(this,(function(r){return n=(e=this).db,o=e.storeName,[2,n.then((function(e){return e.transaction(o,"readwrite").objectStore(o).get(t)})).catch((function(e){throw new Error(E+": "+o+".get("+t+"): "+e)}))]}))}))},this.delete=function(t){return n(o,void 0,void 0,(function(){var e,o,i,a=this;return r(this,(function(c){return o=(e=this).db,i=e.storeName,[2,o.then((function(e){return n(a,void 0,void 0,(function(){var n;return r(this,(function(r){return(n=e.transaction(i,"readwrite")).objectStore(i).delete(t),[2,n.done]}))}))})).catch((function(e){throw new Error(E+": "+i+".get("+t+"): "+e)}))]}))}))},this.keys=function(){return n(o,void 0,void 0,(function(){var t,e,o,i=this;return r(this,(function(a){return e=(t=this).db,o=t.storeName,[2,e.then((function(t){return n(i,void 0,void 0,(function(){return r(this,(function(e){return[2,t.transaction(o,"readwrite").objectStore(o).getAllKeys()]}))}))})).catch((function(t){throw new Error(E+": "+o+".keys(): "+t)}))]}))}))},this.values=function(){var t=o,e=t.db,i=t.storeName;return e.then((function(t){return n(o,void 0,void 0,(function(){return r(this,(function(e){return[2,t.transaction(i,"readwrite").objectStore(i).getAll()]}))}))})).catch((function(t){throw new Error(E+": "+i+".values(): "+t)}))},this.entries=function(){return n(o,void 0,void 0,(function(){var t,e,n,o;return r(this,(function(r){switch(r.label){case 0:t=this.storeName,r.label=1;case 1:return r.trys.push([1,3,,4]),[4,Promise.all([this.keys(),this.values()])];case 2:return e=r.sent(),[2,(null===(o=e)||void 0===o?void 0:o[0].map((function(t,n){var r;return[t,null===(r=e)||void 0===r?void 0:r[1][n]]})))||[]];case 3:throw n=r.sent(),new Error(E+": "+t+".entries(): "+n);case 4:return[2]}}))}))},this.clear=function(){return n(o,void 0,void 0,(function(){var t,e,n;return r(this,(function(r){return e=(t=this).db,n=t.storeName,[2,e.then((function(t){var e=t.transaction(n,"readwrite");return e.objectStore(n).clear(),e.done})).catch((function(t){throw new Error(E+": "+n+".clear(): "+t)}))]}))}))},this.iterate=function(t){return n(o,void 0,void 0,(function(){var e;return r(this,(function(n){switch(n.label){case 0:return[4,(0,this.entries)()];case 1:return e=n.sent(),[2,Promise.all(e.map(t))]}}))}))},this.db=t,this.storeName=i,this.storeOptions=a},E="idborm",D={noDatabaseName:E+": dataBaseName is required.",noObjectStore:E+": objectStore(s) is not provided."},S=function(){function t(t,e,o){var i=this;this.objectStoresMap={},this.iterateOverObjectStores=function(t){return Promise.all(Object.values(i.objectStoresMap).map(t))},this.delete=function(){return n(i,void 0,void 0,(function(){var t,e,n;return r(this,(function(r){return e=(t=this).dataBaseName,n=t.db,[2,p(e,{blocked:function(){n.then((function(t){return t.close()}))}})]}))}))},this.dataBaseName=t,this.db=e,this.objectStoresMap=o}return Object.defineProperty(t.prototype,"objectStores",{get:function(){var t=this;return e(e({},this.objectStoresMap),{methods:{iterate:function(e){return function(e){return t.iterateOverObjectStores(e)}(e)}}})},enumerable:!0,configurable:!0}),t.objectStoreDictionaryCreator=function(t){var e="function"==typeof t?t():t,n={};return Array.isArray(e)?e.forEach((function(t){n[t.name]=t})):n[e.name]=e,n},t.init=function(e,n,r){if(!e)throw new Error(D.noDatabaseName);if(!r||Array.isArray(r)&&!r.length)throw new Error(D.noObjectStore);var o=t.objectStoreDictionaryCreator(r),i={};try{var a=function(t,e,{blocked:n,upgrade:r,blocking:o,terminated:i}={}){const a=indexedDB.open(t,e),c=v(a);return r&&a.addEventListener("upgradeneeded",t=>{r(v(a.result),t.oldVersion,t.newVersion,v(a.transaction))}),n&&a.addEventListener("blocked",()=>n()),i&&a.addEventListener("close",()=>i()),o&&c.then(t=>t.addEventListener("versionchange",o)).catch(()=>{}),c}(e,n,{upgrade:function(t){Object.values(o).forEach((function(e){var n=e.name,r=e.options;t.objectStoreNames.contains(n)||t.createObjectStore(n,r)})),Object.values(t.objectStoreNames).forEach((function(e){o[e]||t.deleteObjectStore(e)}))}});return Object.values(o).forEach((function(t){var e=t.name,n=t.options;i[t.name]=new g(a,{name:e,options:n})})),new t(e,a,i)}catch(t){throw new Error(E+": "+t)}},t}();return t.IDB=S,t.IDBErrors=D,t.IDBORM=E,t.IDBObject=g,t}({});
