System.register(["./collisionManager", "./playerManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isTrigger(entity) { return "trigger" in entity; }
    exports_1("isTrigger", isTrigger);
    function Setup() {
        collisionManager_1.Collision.Subscribe((player, collidable, details) => {
            if (playerManager_1.isPlayer(player)) {
                if (isTrigger(collidable)) {
                    if (collidable.trigger.once) {
                        if (!collidable.trigger.complete) {
                            collidable.trigger.action();
                        }
                    }
                    else {
                        collidable.trigger.action();
                    }
                    collidable.trigger.complete = true;
                }
            }
        });
    }
    exports_1("Setup", Setup);
    var collisionManager_1, playerManager_1;
    return {
        setters: [
            function (collisionManager_1_1) {
                collisionManager_1 = collisionManager_1_1;
            },
            function (playerManager_1_1) {
                playerManager_1 = playerManager_1_1;
            }
        ],
        execute: function () {
        }
    };
});

//# sourceMappingURL=triggerManager.js.map
