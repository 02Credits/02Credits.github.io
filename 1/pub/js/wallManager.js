System.register(["./collisionManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isPhysical(entity) { return "physical" in entity; }
    exports_1("isPhysical", isPhysical);
    function isWall(entity) { return "wall" in entity; }
    exports_1("isWall", isWall);
    function Setup() {
        collisionManager_1.Collision.Subscribe((player, collidable, details) => {
            if ("player" in player) {
                if ("wall" in collidable) {
                    player.position.x -= details.normal[0] * details.depth;
                    player.position.y -= details.normal[1] * details.depth;
                }
            }
        });
    }
    exports_1("Setup", Setup);
    var collisionManager_1;
    return {
        setters: [
            function (collisionManager_1_1) {
                collisionManager_1 = collisionManager_1_1;
            }
        ],
        execute: function () {
        }
    };
});

//# sourceMappingURL=wallManager.js.map
