System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ObjectPool;
    return {
        setters: [],
        execute: function () {
            ObjectPool = class ObjectPool {
                constructor(proto) {
                    this.pool = [];
                    this.proto = proto;
                }
                static copy(source, dest) {
                    for (let id in source) {
                        if (typeof source[id] == "object") {
                            if (!dest[id]) {
                                dest[id] = {};
                            }
                            this.copy(source[id], dest[id]);
                        }
                        else {
                            dest[id] = this.clone(source[id]);
                        }
                    }
                }
                static clone(el) {
                    if (typeof el == "object") {
                        let newEl = {};
                        this.copy(el, newEl);
                        return newEl;
                    }
                    else if (Array.isArray(el)) {
                        let returnArray = [];
                        for (let child of el) {
                            returnArray.push(this.clone(child));
                        }
                        return returnArray;
                    }
                    else {
                        return el;
                    }
                }
                New() {
                    if (this.pool.length != 0) {
                        return this.pool.pop();
                    }
                    else {
                        return ObjectPool.clone(this.proto);
                    }
                }
                Free(obj) {
                    ObjectPool.copy(this.proto, obj);
                    this.pool.push(obj);
                }
            };
            exports_1("default", ObjectPool);
        }
    };
});

//# sourceMappingURL=objectPool.js.map
