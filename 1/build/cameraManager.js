System.register(["./events.js", "./ces.js"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var events_js_1, ces_js_1;
    return {
        setters:[
            function (events_js_1_1) {
                events_js_1 = events_js_1_1;
            },
            function (ces_js_1_1) {
                ces_js_1 = ces_js_1_1;
            }],
        execute: function() {
            exports_1("default",function () {
                events_js_1.default.Subscribe("collision", function (event) {
                    if (_.has(event.collidable, "cameraTrigger")) {
                        var cameraTriggerEntity = event.collidable;
                        var cameraEntity = ces_js_1.default.GetEntities("camera")[0];
                        cameraEntity.camera.targetX = cameraTriggerEntity.cameraTrigger.targetX;
                        cameraEntity.camera.targetY = cameraTriggerEntity.cameraTrigger.targetY;
                    }
                    return true;
                });
                events_js_1.default.Subscribe("ces.update.camera", function (cameraEntity) {
                    var dx = cameraEntity.camera.targetX - cameraEntity.position.x;
                    var dy = cameraEntity.camera.targetY - cameraEntity.position.y;
                    cameraEntity.position.x += dx * 0.01;
                    cameraEntity.position.y += dy * 0.01;
                    return true;
                });
            });
        }
    }
});
//# sourceMappingURL=cameraManager.js.map