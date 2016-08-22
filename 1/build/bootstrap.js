/// <reference path="../typings/index.d.ts"/>
System.register(["./ces.js", "./pixiManager.js", "./editorManager.js", "./playerManager.js", "./collisionManager.js"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ces_js_1, pixiManager_js_1, editorManager_js_1, playerManager_js_1, collisionManager_js_1;
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
            },
            function (playerManager_js_1_1) {
                playerManager_js_1 = playerManager_js_1_1;
            },
            function (collisionManager_js_1_1) {
                collisionManager_js_1 = collisionManager_js_1_1;
            }],
        execute: function() {
            pixiManager_js_1.default(["Wall.png", "Player.png"], function () {
                collisionManager_js_1.default();
                playerManager_js_1.default();
                var startEntities = JSON.parse("[\n        {\n            \"rendered\": {\n                \"texture\": \"Wall.png\"\n            },\n            \"position\": {\n                \"x\": 200,\n                \"y\": 200,\n                \"cx\": 0.5,\n                \"cy\": 0.5\n            },\n            \"dimensions\": {\n                \"width\": 50,\n                \"height\": 50\n            },\n            \"collidable\": true,\n            \"wall\": true\n        },\n        {\n            \"rendered\": {\n                \"texture\": \"Wall.png\"\n            },\n            \"position\": {\n                \"x\": 400,\n                \"y\": 200,\n                \"cx\": 0.5,\n                \"cy\": 0.5\n            },\n            \"dimensions\": {\n                \"width\": 50,\n                \"height\": 50\n            },\n            \"collidable\": true,\n            \"hole\": {\n                \"steepness\": 0.12;\n            }\n        },\n        {\n            \"rendered\": {\n                \"texture\": \"Player.png\"\n            },\n            \"position\": {\n                \"x\": 0,\n                \"y\": 0,\n                \"cx\": 0.5,\n                \"cy\": 0.5\n            },\n            \"collider\": true,\n            \"player\": {\n                \"stepSpeed\": 0.03,\n                \"stepSize\": 0.8\n            }\n        },\n        {\n            \"rendered\": {\n                \"texture\": \"Wall.png\"\n            },\n            \"position\": {\n                \"x\": 0,\n                \"y\": 0,\n                \"z\": 4,\n                \"cx\": 0.5,\n                \"cy\": 0.5\n            },\n            \"dimensions\": {\n                \"width\": 10,\n                \"height\": 10\n            },\n            \"foot\": {\n                \"x\": -10\n            }\n        },\n        {\n            \"rendered\": {\n                \"texture\": \"Wall.png\"\n            },\n            \"position\": {\n                \"x\": 0,\n                \"y\": 0,\n                \"z\": 4,\n                \"cx\": 0.5,\n                \"cy\": 0.5\n            },\n            \"dimensions\": {\n                \"width\": 10,\n                \"height\": 10\n            },\n            \"foot\": {\n                \"x\": 10\n            }\n        }\n    ]");
                _(startEntities).each(function (entity) {
                    ces_js_1.default.AddEntity(entity);
                });
                editorManager_js_1.default();
            });
        }
    }
});
//# sourceMappingURL=bootstrap.js.map