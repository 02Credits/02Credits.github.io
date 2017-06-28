System.register(["./inputManager", "./ces", "./utils", "./objectPool", "./animationManager"], function (exports_1, context_1) {
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
    function updatePlayer(entity, time) {
        let mouseState = input.MouseState();
        if ("enabled" in entity && !entity.enabled) {
            let particles = ces.getEntities(isPlayerParticle);
            let effectingParticles;
            if (time - entity.player.dashStartTime > entity.player.dashLength) {
                effectingParticles = particles;
            }
            else {
                let closeParticles = particles.filter(p => utils.length(utils.sub(p.position, mouseState.position)) < entity.dimensions.x / 2);
                if (closeParticles.length > 0) {
                    effectingParticles = closeParticles;
                }
            }
            if (effectingParticles) {
                entity.position = utils.sum({ x: 0, y: 0, z: entity.position.z }, utils.flatten(utils.average(effectingParticles.map(p => p.position))));
                entity.velocity = utils.flatten(utils.average(effectingParticles.map(p => p.velocity)));
                entity.player.lastDashed = time;
                entity.enabled = true;
            }
        }
        else {
            let strengthLevel = (entity.player.particleCount - 5) / 25;
            if (mouseState.mouseButtons.left && (time - entity.player.lastDashed) > (1 - strengthLevel) * 1.5) {
                for (let i = 0; i < entity.player.particleCount; i++) {
                    let particle = entity.player.pool.New();
                    particle.velocity = utils.scale(utils.normalize({ x: Math.random() - 0.5, y: Math.random() - 0.5, z: 0 }), Math.random() + 0.5);
                    particle.position = entity.position;
                    ces.addEntity(particle);
                }
                entity.enabled = false;
                entity.player.dashStartTime = time;
            }
            else {
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
        }
    }
    function updatePlayerParticle(entity) {
        let mouseState = input.MouseState();
        let playerEntities = ces.getEntities(isPlayer);
        let target;
        if (playerEntities.length != 0) {
            let playerEntity = playerEntities[0];
            target = playerEntity.position;
            if (utils.length(utils.sub(entity.position, playerEntity.position)) < playerEntity.dimensions.x / 2) {
                ces.removeEntity(entity);
                playerEntity.player.pool.Free(entity);
            }
        }
        else {
            target = mouseState.position;
        }
        entity.velocity = utils.sum(utils.scale(utils.normalize(utils.sub(target, entity.position)), 0.1), entity.velocity);
    }
    function setup() {
        ces.EntityAdded.Subscribe((entity) => {
            if (isPlayer(entity)) {
                entity.velocity = { x: 0, y: 0, z: 0 };
                entity.player.walkAnimation = 0;
                entity.player.lastDashed = -Infinity;
                let particleBase = ces.getEntity(entity.player.particleBase);
                entity.player.pool = new objectPool_1.default(Object.assign({}, particleBase, { velocity: { x: 0, y: 0, z: 0 }, playerParticle: true, enabled: true }));
                let footBase = ces.getEntity(entity.player.footBase);
                let footPool = new objectPool_1.default(Object.assign({}, footBase, { enabled: true }));
                let rightFoot = ces.addEntity(Object.assign({}, footPool.New(), { id: "rightFoot", child: {
                        relativePosition: {
                            x: 1
                        }
                    } }));
                let leftFoot = ces.addEntity(Object.assign({}, footPool.New(), { id: "leftFoot", child: {
                        relativePosition: {
                            x: -1
                        }
                    } }));
            }
        });
        animationManager_1.Update.Subscribe((time) => {
            for (let entity of ces.getEntities(isPlayer, true)) {
                updatePlayer(entity, time);
                updateFeet(entity);
            }
            for (let entity of ces.getEntities(isPlayerParticle)) {
                updatePlayerParticle(entity);
            }
        });
    }
    exports_1("setup", setup);
    var input, ces, utils, objectPool_1, animationManager_1;
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
            function (objectPool_1_1) {
                objectPool_1 = objectPool_1_1;
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
