System.register(["./collisionManager", "./webglManager", "./eventManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isFallable(entity) { return "fallable" in entity; }
    exports_1("isFallable", isFallable);
    function isHole(entity) { return "hole" in entity; }
    exports_1("isHole", isHole);
    function Setup() {
        collisionManager_1.Collision.Subscribe((fallable, collidable, details) => {
            if (isFallable(fallable)) {
                if (isHole(collidable)) {
                    if (details.depth > Math.max(fallable.dimensions.width, fallable.dimensions.height)) {
                        fallable.position.x = collidable.position.x;
                        fallable.position.y = collidable.position.y;
                        Fell.Publish(fallable);
                    }
                    else {
                        fallable.position.x += details.normal[0] * details.depth * collidable.hole.steepness;
                        fallable.position.y += details.normal[1] * details.depth * collidable.hole.steepness;
                    }
                    var factor = 1.2 - details.depth * 0.2;
                    if (factor < 0) {
                        factor = 0;
                    }
                    if (factor > 1) {
                        factor = 1;
                    }
                    if (webglManager_1.isRenderable(fallable)) {
                        if ("color" in fallable) {
                            fallable.color.a = factor;
                        }
                        fallable.scale = factor;
                    }
                }
            }
        });
    }
    exports_1("Setup", Setup);
    var collisionManager_1, webglManager_1, eventManager_1, Fell;
    return {
        setters: [
            function (collisionManager_1_1) {
                collisionManager_1 = collisionManager_1_1;
            },
            function (webglManager_1_1) {
                webglManager_1 = webglManager_1_1;
            },
            function (eventManager_1_1) {
                eventManager_1 = eventManager_1_1;
            }
        ],
        execute: function () {
            exports_1("Fell", Fell = new eventManager_1.EventManager1());
            ;
            ;
        }
    };
});

//# sourceMappingURL=holeManager.js.map
