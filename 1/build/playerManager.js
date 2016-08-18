System.register(["underscore", "./events.js"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var underscore_1, events_js_1;
    return {
        setters:[
            function (underscore_1_1) {
                underscore_1 = underscore_1_1;
            },
            function (events_js_1_1) {
                events_js_1 = events_js_1_1;
            }],
        execute: function() {
            exports_1("default",function () {
                events_js_1.default.Subscribe("ces.checkEntity.player", function (entity) {
                    return underscore_1.default.has(entity, "position");
                });
            });
        }
    }
});
//# sourceMappingURL=playerManager.js.map