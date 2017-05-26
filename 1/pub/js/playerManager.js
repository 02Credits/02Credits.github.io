System.register(["./inputManager", "./ces", "./utils", "./animationManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isPlayer(entity) { return "player" in entity; }
    exports_1("isPlayer", isPlayer);
    function isFoot(entity) { return "foot" in entity; }
    exports_1("isFoot", isFoot);
    function isPlayerParticle(entity) { return "playerParticle" in entity; }
    exports_1("isPlayerParticle", isPlayerParticle);
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
        let delta = { x: 0, y: 0, z: 0 };
        if (input.KeyDown("a")) {
            delta.x -= 10;
        }
        if (input.KeyDown("d")) {
            delta.x += 10;
        }
        if (input.KeyDown("w")) {
            delta.y += 10;
        }
        if (input.KeyDown("s")) {
            delta.y -= 10;
        }
        entity.rotation = utils.xyAngle(entity.velocity) + Math.PI / 2;
        let length = utils.length(delta);
        if (length != 0) {
            delta = utils.shrink(delta, length);
        }
        entity.velocity = utils.sum(entity.velocity, utils.scale(delta, 0.1));
        var playerSpeed = utils.length(entity.velocity);
        entity.player.speed = playerSpeed;
        entity.player.walkAnimation += playerSpeed * entity.player.stepSpeed;
    }
    function updatePlayerParticle(entity) {
        let playerEntities = ces.getEntities(isPlayer);
        let target;
        if (playerEntities.length != 0 && playerEntities.length == 0) {
            let playerEntity = playerEntities[0];
            target = playerEntity.position;
        }
        else {
            target = input.MouseState().position;
        }
        entity.velocity = utils.sum(utils.scale(utils.normalize(utils.sub(target, entity.position)), 0.1), entity.velocity);
    }
    function setup() {
        ces.EntityAdded.Subscribe((entity) => {
            if (isPlayer(entity)) {
                entity.velocity = { x: 0, y: 0, z: 0 };
                entity.player.walkAnimation = 0;
            }
            if (isPlayerParticle(entity)) {
                entity.velocity = { x: 0, y: 0, z: 0 };
            }
        });
        animationManager_1.Update.Subscribe(() => {
            for (let entity of ces.getEntities(isPlayer)) {
                updatePlayer(entity);
                updateFeet(entity);
            }
            for (let entity of ces.getEntities(isPlayerParticle)) {
                updatePlayerParticle(entity);
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
