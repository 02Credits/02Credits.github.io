/// <reference path="../typings/index.d.ts"/>
System.register(["./ces.js", "./pixiManager.js", "./editorManager.js"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ces_js_1, pixiManager_js_1, editorManager_js_1;
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
            ces_js_1.default.AddEntity({ rendered: { texture: "player.png" }, position: { x: 0, y: 0, cx: 0.5, cy: 0.5 } });
            editorManager_js_1.default();
        }
    }
});
//# sourceMappingURL=bootstrap.js.map