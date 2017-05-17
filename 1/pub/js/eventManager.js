System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var EventManager0, EventManager1, EventManager2, EventManager3, EventManager4, EventManager5, PollManager0, PollManager1, PollManager2, PollManager3, PollManager4, PollManager5;
    return {
        setters: [],
        execute: function () {
            EventManager0 = class EventManager0 {
                constructor() {
                    this.currentId = 0;
                    this.subscriptions = {};
                }
                Subscribe(callback) {
                    this.subscriptions[this.currentId] = callback;
                    let id = this.currentId;
                    this.currentId++;
                    return id;
                }
                Unsubscribe(id) {
                    delete this.subscriptions[id];
                }
                Publish() {
                    for (let id in this.subscriptions) {
                        this.subscriptions[id]();
                    }
                }
            };
            exports_1("EventManager0", EventManager0);
            EventManager1 = class EventManager1 {
                constructor() {
                    this.currentId = 0;
                    this.subscriptions = {};
                }
                Subscribe(callback) {
                    this.subscriptions[this.currentId] = callback;
                    let id = this.currentId;
                    this.currentId++;
                    return id;
                }
                Unsubscribe(id) {
                    delete this.subscriptions[id];
                }
                Publish(arg) {
                    for (let id in this.subscriptions) {
                        this.subscriptions[id](arg);
                    }
                }
            };
            exports_1("EventManager1", EventManager1);
            EventManager2 = class EventManager2 {
                constructor() {
                    this.currentId = 0;
                    this.subscriptions = {};
                }
                Subscribe(callback) {
                    this.subscriptions[this.currentId] = callback;
                    let id = this.currentId;
                    this.currentId++;
                    return id;
                }
                Unsubscribe(id) {
                    delete this.subscriptions[id];
                }
                Publish(arg1, arg2) {
                    for (let id in this.subscriptions) {
                        this.subscriptions[id](arg1, arg2);
                    }
                }
            };
            exports_1("EventManager2", EventManager2);
            EventManager3 = class EventManager3 {
                constructor() {
                    this.currentId = 0;
                    this.subscriptions = {};
                }
                Subscribe(callback) {
                    this.subscriptions[this.currentId] = callback;
                    let id = this.currentId;
                    this.currentId++;
                    return id;
                }
                Unsubscribe(id) {
                    delete this.subscriptions[id];
                }
                Publish(arg1, arg2, arg3) {
                    for (let id in this.subscriptions) {
                        this.subscriptions[id](arg1, arg2, arg3);
                    }
                }
            };
            exports_1("EventManager3", EventManager3);
            EventManager4 = class EventManager4 {
                constructor() {
                    this.currentId = 0;
                    this.subscriptions = {};
                }
                Subscribe(callback) {
                    this.subscriptions[this.currentId] = callback;
                    let id = this.currentId;
                    this.currentId++;
                    return id;
                }
                Unsubscribe(id) {
                    delete this.subscriptions[id];
                }
                Publish(arg1, arg2, arg3, arg4) {
                    for (let id in this.subscriptions) {
                        this.subscriptions[id](arg1, arg2, arg3, arg4);
                    }
                }
            };
            exports_1("EventManager4", EventManager4);
            EventManager5 = class EventManager5 {
                constructor() {
                    this.currentId = 0;
                    this.subscriptions = {};
                }
                Subscribe(callback) {
                    this.subscriptions[this.currentId] = callback;
                    let id = this.currentId;
                    this.currentId++;
                    return id;
                }
                Unsubscribe(id) {
                    delete this.subscriptions[id];
                }
                Publish(arg1, arg2, arg3, arg4, arg5) {
                    for (let id in this.subscriptions) {
                        this.subscriptions[id](arg1, arg2, arg3, arg4, arg5);
                    }
                }
            };
            exports_1("EventManager5", EventManager5);
            PollManager0 = class PollManager0 {
                constructor() {
                    this.currentId = 0;
                    this.subscriptions = {};
                }
                Subscribe(callback) {
                    this.subscriptions[this.currentId] = callback;
                    let id = this.currentId;
                    this.currentId++;
                    return id;
                }
                Unsubscribe(id) {
                    delete this.subscriptions[id];
                }
                Poll() {
                    let result = [];
                    for (let id in this.subscriptions) {
                        result.push(this.subscriptions[id]());
                    }
                    return result;
                }
            };
            exports_1("PollManager0", PollManager0);
            PollManager1 = class PollManager1 {
                constructor() {
                    this.currentId = 0;
                    this.subscriptions = {};
                }
                Subscribe(callback) {
                    this.subscriptions[this.currentId] = callback;
                    let id = this.currentId;
                    this.currentId++;
                    return id;
                }
                Unsubscribe(id) {
                    delete this.subscriptions[id];
                }
                Poll(arg) {
                    let result = [];
                    for (let id in this.subscriptions) {
                        result.push(this.subscriptions[id](arg));
                    }
                    return result;
                }
            };
            exports_1("PollManager1", PollManager1);
            PollManager2 = class PollManager2 {
                constructor() {
                    this.currentId = 0;
                    this.subscriptions = {};
                }
                Subscribe(callback) {
                    let id = this.currentId;
                    this.currentId++;
                    return id;
                }
                Unsubscribe(id) {
                    delete this.subscriptions[id];
                }
                Poll(arg1, arg2) {
                    let result = [];
                    for (let id in this.subscriptions) {
                        result.push(this.subscriptions[id](arg1, arg2));
                    }
                    return result;
                }
            };
            exports_1("PollManager2", PollManager2);
            PollManager3 = class PollManager3 {
                constructor() {
                    this.currentId = 0;
                    this.subscriptions = {};
                }
                Subscribe(callback) {
                    this.subscriptions[this.currentId] = callback;
                    let id = this.currentId;
                    this.currentId++;
                    return id;
                }
                Unsubscribe(id) {
                    delete this.subscriptions[id];
                }
                Poll(arg1, arg2, arg3) {
                    let result = [];
                    for (let id in this.subscriptions) {
                        result.push(this.subscriptions[id](arg1, arg2, arg3));
                    }
                    return result;
                }
            };
            exports_1("PollManager3", PollManager3);
            PollManager4 = class PollManager4 {
                constructor() {
                    this.currentId = 0;
                    this.subscriptions = {};
                }
                Subscribe(callback) {
                    this.subscriptions[this.currentId] = callback;
                    let id = this.currentId;
                    this.currentId++;
                    return id;
                }
                Unsubscribe(id) {
                    delete this.subscriptions[id];
                }
                Poll(arg1, arg2, arg3, arg4) {
                    let result = [];
                    for (let id in this.subscriptions) {
                        result.push(this.subscriptions[id](arg1, arg2, arg3, arg4));
                    }
                    return result;
                }
            };
            exports_1("PollManager4", PollManager4);
            PollManager5 = class PollManager5 {
                constructor() {
                    this.currentId = 0;
                    this.subscriptions = {};
                }
                Subscribe(callback) {
                    this.subscriptions[this.currentId] = callback;
                    let id = this.currentId;
                    this.currentId++;
                    return id;
                }
                Unsubscribe(id) {
                    delete this.subscriptions[id];
                }
                Poll(arg1, arg2, arg3, arg4, arg5) {
                    let result = [];
                    for (let id in this.subscriptions) {
                        result.push(this.subscriptions[id](arg1, arg2, arg3, arg4, arg5));
                    }
                    return result;
                }
            };
            exports_1("PollManager5", PollManager5);
        }
    };
});

//# sourceMappingURL=eventManager.js.map
