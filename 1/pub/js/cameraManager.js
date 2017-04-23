System.register(["./ces", "./animationManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isCamera(entity) { return "camera" in entity; }
    exports_1("isCamera", isCamera);
    function Shake(amount) {
        shake = amount;
    }
    exports_1("Shake", Shake);
    function Retarget(target) {
        var cameraEntity = ces.GetEntities(isCamera)[0];
        cameraEntity.camera.targetX = target.targetX;
        cameraEntity.camera.targetY = target.targetY;
    }
    exports_1("Retarget", Retarget);
    function Setup() {
        animationManager_1.Update.Subscribe(() => {
            for (let cameraEntity of ces.GetEntities(isCamera)) {
                var dy = cameraEntity.camera.targetY - cameraEntity.position.y;
                var dx = cameraEntity.camera.targetX - cameraEntity.position.x;
                cameraEntity.position.x += dx * 0.05 + (Math.random() - 0.5) * shake;
                cameraEntity.position.y += dy * 0.05 + (Math.random() - 0.5) * shake;
                shake = shake * shakeFade;
            }
        });
    }
    exports_1("Setup", Setup);
    var ces, animationManager_1, shake, shakeFade;
    return {
        setters: [
            function (ces_1) {
                ces = ces_1;
            },
            function (animationManager_1_1) {
                animationManager_1 = animationManager_1_1;
            }
        ],
        execute: function () {
            shake = 0;
            shakeFade = 0.95;
        }
    };
});

//# sourceMappingURL=cameraManager.js.map
