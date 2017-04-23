////////////////////////////////////////////////////////////////
///
///   This is a simple event manager. you can subscribe to
///   events by calling the subscribe function and passing
///   in a path which is a . delimited namespace for the
///   event. Events that then publish anything below that
///   namespace will get passed to the function.
///
////////////////////////////////////////////////////////////////
System.register([], function (exports_1, context_1) {
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __moduleName = context_1 && context_1.id;
    var EventManager;
    return {
        setters: [],
        execute: function () {////////////////////////////////////////////////////////////////
            ///
            ///   This is a simple event manager. you can subscribe to
            ///   events by calling the subscribe function and passing
            ///   in a path which is a . delimited namespace for the
            ///   event. Events that then publish anything below that
            ///   namespace will get passed to the function.
            ///
            ////////////////////////////////////////////////////////////////
            EventManager = class EventManager {
                constructor() {
                    this.currentId = 0;
                    this.subscriptions = {};
                    this.namespaces = {};
                }
                iterateOverEventName(name, callback) {
                    let namespaces = name.split(".");
                    let nameAcc = "";
                    for (let name of namespaces) {
                        if (nameAcc.length != 0) {
                            nameAcc = nameAcc + ".";
                        }
                        nameAcc = nameAcc + name;
                        callback(nameAcc);
                    }
                }
                /** Subscribe to a given event. Note that your event will get called for any
                    published event and down the chain.
            
                    eg. Subscribe("foo.bar", fun...) will be called with Publish("foo.bar.bas") */
                Subscribe(name, callback) {
                    return this.SubscribeMultiple([name], callback);
                }
                /** Allows you to subscribe to multiple different events with one handler.
                    This event will get called for any of the passed in events. */
                SubscribeMultiple(names, callback) {
                    let sub = { id: this.currentId, names: names, callback: callback };
                    this.subscriptions[this.currentId] = sub;
                    this.currentId++;
                    for (let name of names) {
                        if (!(name in this.namespaces)) {
                            this.namespaces[name] = [];
                        }
                        this.namespaces[name].push(sub);
                    }
                    return sub.id;
                }
                /** Stops this event handler from being called. Used to free memory generally. */
                Unsubscribe(id) {
                    let sub = this.subscriptions[id];
                    delete this.subscriptions[id];
                    for (let name in sub.names) {
                        this.namespaces[name] = this.namespaces[name].filter(s => s != sub);
                    }
                }
                /** Publish the event with name: name and data: data. */
                Publish(name, data) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield this.PublishMultiple([name], data);
                    });
                }
                /** Publish multiple events with a given argument. The idea here is that if
                    an event subscribed to multiple event names it will only get called once. */
                PublishMultiple(names, data) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let calledEvents = [];
                        let results = [];
                        for (let name of names) {
                            this.iterateOverEventName(name, (partialName) => {
                                if (Array.isArray(this.namespaces[partialName])) {
                                    for (let sub of this.namespaces[partialName]) {
                                        if (!(calledEvents.some(s => s === sub))) {
                                            let result = sub.callback(data, name);
                                            if (result != undefined) {
                                                results.push(Promise.resolve(result));
                                            }
                                            calledEvents.push(sub);
                                        }
                                    }
                                }
                            });
                        }
                        if (results.length != 0) {
                            return Promise.all(results);
                        }
                        else {
                            return Promise.resolve([]);
                        }
                    });
                }
            };
            exports_1("default", new EventManager());
        }
    };
});

//# sourceMappingURL=events.js.map
