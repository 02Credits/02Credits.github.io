System.register(["./ces", "./utils", "./animationManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isMoving(entity) { return "velocity" in entity; }
    exports_1("isMoving", isMoving);
    function setup() {
        animationManager_1.Update.Subscribe(() => {
            for (let entity of ces.getEntities(isMoving)) {
                entity.position = utils.sum(entity.position, entity.velocity);
                if ("friction" in entity) {
                    entity.velocity = utils.scale(entity.velocity, entity.friction);
                }
            }
        });
    }
    exports_1("setup", setup);
    var ces, utils, animationManager_1;
    return {
        setters: [
            function (ces_1) {
                ces = ces_1;
            },
            function (utils_1) {
                utils = utils_1;
            },
            function (animationManager_1_1) {
                animationManager_1 = animationManager_1_1;
            }
        ],
        execute: function () {
        }
    };
});

//# sourceMappingURL=motionManager.js.map
