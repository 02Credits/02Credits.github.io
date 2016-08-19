/// <reference path="../typings/index.d.ts"/>
System.register(["./ces.js", "./pixiManager.js", "./editorManager.js"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ces_js_1, pixiManager_js_1, editorManager_js_1;
    var startEntities;
    return {
        setters:[
            function (ces_js_1_1) {
                ces_js_1 = ces_js_1_1;
            },
            function (pixiManager_js_1_1) {
                pixiManager_js_1 = pixiManager_js_1_1;
            },
            function (editorManager_js_1_1) {
                editorManager_js_1 = editorManager_js_1_1;
            }],
        execute: function() {
            pixiManager_js_1.default();
            startEntities = JSON.parse("[\n    {\n        \"rendered\": {\n            \"texture\": \"Player.png\"\n        },\n        \"position\": {\n            \"x\": 0,\n            \"y\": 0,\n            \"cx\": 0,\n            \"cy\": 0\n        },\n        \"id\": 0\n    }\n]");
            _(startEntities).each(function (entity) {
                ces_js_1.default.AddEntity(entity);
            });
            editorManager_js_1.default();
        }
    }
});
//# sourceMappingURL=bootstrap.js.map