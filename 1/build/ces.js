/// <reference path="../typings/index.d.ts"/>
System.register(["./events.js", "underscore"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var events_js_1, underscore_1;
    var CES;
    return {
        setters:[
            function (events_js_1_1) {
                events_js_1 = events_js_1_1;
            },
            function (underscore_1_1) {
                underscore_1 = underscore_1_1;
            }],
        execute: function() {
            (function (CES) {
                var currentId = 0;
                CES.entities = {};
                function PublishEvent(eventName) {
                    var success = true;
                    if (events_js_1.default.Publish("ces." + eventName)) {
                        underscore_1.default(CES.entities).each(function (entity) {
                            var newEventNames = underscore_1.default(entity)
                                .keys()
                                .map(function (key) { return "ces." + eventName + "." + key; });
                            if (!events_js_1.default.PublishMultiple(newEventNames, entity)) {
                                success = false;
                            }
                        });
                    }
                    return success;
                }
                CES.PublishEvent = PublishEvent;
                function AddEntity(entity) {
                    var eventNames = underscore_1.default(entity).keys().map(function (key) { return "ces.checkEntity." + key; });
                    var succeed = events_js_1.default.PublishMultiple(eventNames, entity);
                    if (succeed) {
                        entity.id = currentId;
                        CES.entities[currentId] = entity;
                        currentId++;
                        eventNames = underscore_1.default(entity).keys().map(function (key) { return "ces.addEntity." + key; });
                        events_js_1.default.PublishMultiple(eventNames, entity);
                    }
                    return succeed;
                }
                CES.AddEntity = AddEntity;
                function RemoveEntity(entity) {
                    var eventNames = underscore_1.default(entity).keys().map(function (key) { return "ces.removeEntity." + key; });
                    events_js_1.default.PublishMultiple(eventNames, entity);
                    delete CES.entities[entity.id];
                }
                CES.RemoveEntity = RemoveEntity;
                function GetEntities(component) {
                    return underscore_1.default(CES.entities).pairs().map(function (p) { return p[1]; }).filter(function (e) { return underscore_1.default(e).has(component); });
                }
                CES.GetEntities = GetEntities;
            })(CES = CES || (CES = {}));
            exports_1("CES", CES);
            exports_1("default",CES);
        }
    }
});
//# sourceMappingURL=ces.js.map