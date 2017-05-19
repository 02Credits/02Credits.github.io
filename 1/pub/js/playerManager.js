System.register(["./inputManager", "./ces", "./utils", "./animationManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isPlayer(entity) { return "player" in entity; }
    exports_1("isPlayer", isPlayer);
    function isFoot(entity) { return "foot" in entity; }
    exports_1("isFoot", isFoot);
    function updateFeet(playerEntity) {
        var scale = 1;
        if ("scale" in playerEntity) {
            scale = playerEntity.scale;
        }
        var feet = ces.getEntities(isFoot);
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
        let mouseState = input.MouseState();
        let delta = utils.sub(mouseState.position, entity.position);
        entity.rotation = utils.angle(delta) + Math.PI / 2;
        let length = utils.length(delta);
        if (entity.dimensions && length > 3) {
            delta = utils.shrink(delta, length);
            entity.player.velocity = utils.toPoint(utils.sum(entity.player.velocity, utils.scale(delta, 0.1)));
        }
        entity.player.velocity = utils.toPoint(utils.scale(entity.player.velocity, 0.85));
        var playerSpeed = utils.length(entity.player.velocity);
        entity.player.speed = playerSpeed;
        entity.player.walkAnimation += playerSpeed * entity.player.stepSpeed;
        entity.position = utils.toPoint(utils.sum(entity.position, entity.player.velocity));
    }
    function setup() {
        ces.EntityAdded.Subscribe((entity) => {
            if (isPlayer(entity)) {
                entity.player.velocity = { x: 0, y: 0 };
                entity.player.walkAnimation = 0;
            }
        });
        animationManager_1.Update.Subscribe(() => {
            for (let entity of ces.getEntities(isPlayer)) {
                updatePlayer(entity);
                updateFeet(entity);
            }
        });
    }
    exports_1("setup", setup);
    var input, ces, utils, animationManager_1;
    return {
        setters: [
            function (input_1) {
                input = input_1;
            },
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
            ;
        }
    };
});

//# sourceMappingURL=playerManager.js.map
