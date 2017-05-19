System.register(["./collisionManager", "./utils"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isPhysical(entity) { return "physical" in entity; }
    exports_1("isPhysical", isPhysical);
    function isWall(entity) { return "wall" in entity; }
    exports_1("isWall", isWall);
    function setup() {
        collisionManager_1.Collision.Subscribe((player, collidable, details) => {
            if ("player" in player) {
                if ("wall" in collidable) {
                    player.position = utils.toPoint(utils.sub(player.position, utils.scale(details.normal, details.depth)));
                }
            }
        });
    }
    exports_1("setup", setup);
    var collisionManager_1, utils;
    return {
        setters: [
            function (collisionManager_1_1) {
                collisionManager_1 = collisionManager_1_1;
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
