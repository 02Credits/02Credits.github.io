System.register(["./collisionManager", "./motionManager", "./utils"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isWall(entity) { return "wall" in entity; }
    exports_1("isWall", isWall);
    function isBouncy(entity) { return "restitution" in entity; }
    exports_1("isBouncy", isBouncy);
    function setup() {
        collisionManager_1.Collision.Subscribe((collidable, wall, details) => {
            if (isWall(wall)) {
                collidable.position = utils.sub(collidable.position, utils.scale(details.normal, details.depth));
                if (motionManager_1.isMoving(collidable)) {
                    let restitution = 0;
                    if (isBouncy(collidable)) {
                        restitution = collidable.restitution;
                    }
                    let component = utils.dot(details.normal, collidable.velocity) / utils.length(details.normal);
                    let correction = utils.scale(utils.normalize(details.normal), component);
                    collidable.velocity = utils.sub(collidable.velocity, utils.scale(correction, restitution + 1));
                }
            }
        });
    }
    exports_1("setup", setup);
    var collisionManager_1, motionManager_1, utils;
    return {
        setters: [
            function (collisionManager_1_1) {
                collisionManager_1 = collisionManager_1_1;
            },
            function (motionManager_1_1) {
                motionManager_1 = motionManager_1_1;
            },
            function (utils_1) {
                utils = utils_1;
            }
        ],
        execute: function () {
        }
    };
});

//# sourceMappingURL=wallManager.js.map
