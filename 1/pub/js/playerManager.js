System.register(["./inputManager.js", "./ces.js", "./animationManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isPlayer(entity) { return "player" in entity; }
    exports_1("isPlayer", isPlayer);
    function isFoot(entity) { return "foot" in entity; }
    exports_1("isFoot", isFoot);
    function updateFeet(playerEntity) {
        var scale = 1;
        if ("scale" in playerEntity.rendered) {
            scale = playerEntity.rendered.scale;
        }
        var feet = ces.GetEntities(isFoot);
        for (let entity of feet) {
            entity.child.relativePosition.y =
                Math.sin(playerEntity.player.walkAnimation) *
                    playerEntity.player.stepSize *
                    playerEntity.player.speed *
                    entity.child.relativePosition.x *
                    scale;
        }
    }
    function updatePlayer(entity) {
        var mouseState = inputManager_js_1.default.MouseState();
        var dx = mouseState.x - entity.position.x;
        var dy = mouseState.y - entity.position.y;
        entity.position.rotation = Math.atan2(dy, dx) + Math.PI / 2;
        var length = Math.sqrt(dx * dx + dy * dy);
        if (entity.dimensions && length > 3) {
            dx = dx / length;
            dy = dy / length;
            entity.player.vx += dx * 0.1;
            entity.player.vy += dy * 0.1;
        }
        entity.player.vx *= 0.85;
        entity.player.vy *= 0.85;
        var playerSpeed = Math.sqrt(entity.player.vx * entity.player.vx + entity.player.vy * entity.player.vy);
        entity.player.speed = playerSpeed;
        entity.player.walkAnimation += playerSpeed * entity.player.stepSpeed;
        entity.position.x += entity.player.vx;
        entity.position.y += entity.player.vy;
    }
    function Setup() {
        ces.EntityAdded.Subscribe((entity) => {
            if (isPlayer(entity)) {
                entity.player.vx = 0;
                entity.player.vy = 0;
                entity.player.walkAnimation = 0;
            }
        });
        animationManager_1.Update.Subscribe(() => {
            for (let entity of ces.GetEntities(isPlayer)) {
                updatePlayer(entity);
                updateFeet(entity);
            }
        });
    }
    exports_1("Setup", Setup);
    var inputManager_js_1, ces, animationManager_1;
    return {
        setters: [
            function (inputManager_js_1_1) {
                inputManager_js_1 = inputManager_js_1_1;
            },
            function (ces_1) {
                ces = ces_1;
            },
            function (animationManager_1_1) {
                animationManager_1 = animationManager_1_1;
            }
        ],
        execute: function () {
            ;
        }
    };
});

//# sourceMappingURL=playerManager.js.map
