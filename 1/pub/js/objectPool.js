System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function clone(el) {
        if (typeof el == "object") {
            let newEl = {};
            copy(el, newEl);
            return newEl;
        }
        else if (Array.isArray(el)) {
            let returnArray = [];
            for (let child of el) {
                returnArray.push(clone(child));
            }
            return returnArray;
        }
        else {
            return el;
        }
    }
    function copy(source, dest) {
        for (let id in source) {
            if (typeof source[id] == "object") {
                if (!dest[id]) {
                    dest[id] = {};
                }
                copy(source[id], dest[id]);
            }
            else {
                dest[id] = clone(source[id]);
            }
        }
    }
    var ObjectPool;
    return {
        setters: [],
        execute: function () {
            ObjectPool = class ObjectPool {
                constructor(proto) {
                    this.pool = [];
                    this.proto = proto;
                }
                New() {
                    if (this.pool.length != 0) {
                        return this.pool.pop();
                    }
                    else {
                        return clone(this.proto);
                    }
                }
                Free(obj) {
                    copy(this.proto, obj);
                    this.pool.push(obj);
                }
            };
            exports_1("ObjectPool", ObjectPool);
        }
    };
});

//# sourceMappingURL=objectPool.js.map
