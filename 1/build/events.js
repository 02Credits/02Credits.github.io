/// <reference path="../typings/index.d.ts"/>
System.register(['underscore'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var underscore_1;
    var Events;
    return {
        setters:[
            function (underscore_1_1) {
                underscore_1 = underscore_1_1;
            }],
        execute: function() {
            (function (Events) {
                var currentId = 0;
                var subscriptions = {};
                var namespaces = {};
                function iterateOverEventName(name, callback) {
                    var namespaces = name.split(".");
                    var nameAcc = "";
                    underscore_1.default.each(namespaces, function (name) {
                        if (nameAcc.length != 0) {
                            nameAcc = nameAcc + ".";
                        }
                        nameAcc = nameAcc + name;
                        callback(nameAcc);
                    });
                }
                function Subscribe(name, callback) {
                    return SubscribeMultiple([name], callback);
                }
                Events.Subscribe = Subscribe;
                function SubscribeMultiple(names, callback) {
                    var sub = { id: currentId, names: names, callback: callback };
                    subscriptions[currentId] = sub;
                    currentId++;
                    underscore_1.default(names).each(function (name) {
                        if (!underscore_1.default.has(namespaces, name)) {
                            namespaces[name] = [];
                        }
                        namespaces[name].push(sub);
                    });
                    return sub.id;
                }
                Events.SubscribeMultiple = SubscribeMultiple;
                function Unsubscribe(id) {
                    var sub = subscriptions[id];
                    delete subscriptions[id];
                    underscore_1.default(sub.names).each(function (name) {
                        namespaces[name] = underscore_1.default.without(namespaces[name], sub);
                    });
                    namespaces[name] = underscore_1.default.without(namespaces[name], sub);
                }
                Events.Unsubscribe = Unsubscribe;
                function Publish(name, data) {
                    return PublishMultiple([name], data);
                }
                Events.Publish = Publish;
                function PublishMultiple(names, data) {
                    var success = true;
                    var calledEvents = [];
                    underscore_1.default(names).each(function (name) {
                        iterateOverEventName(name, function (partialName) {
                            if (underscore_1.default.isArray(namespaces[partialName])) {
                                underscore_1.default.each(namespaces[partialName], function (sub) {
                                    if (!underscore_1.default.contains(calledEvents, sub) && success) {
                                        if (!sub.callback(data, name)) {
                                            success = false;
                                        }
                                        calledEvents.push(sub);
                                    }
                                });
                            }
                        });
                    });
                    return success;
                }
                Events.PublishMultiple = PublishMultiple;
            })(Events = Events || (Events = {}));
            exports_1("Events", Events);
            exports_1("default",Events);
        }
    }
});
//# sourceMappingURL=events.js.map