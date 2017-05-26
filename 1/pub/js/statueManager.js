System.register(["./ces", "./utils", "./animationManager", "./playerManager", "./collisionManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isStatue(entity) { return "statue" in entity; }
    exports_1("isStatue", isStatue);
    function setup() {
        ces.EntityAdded.Subscribe((entity) => {
            if (isStatue(entity)) {
                let statue = entity.statue;
                statue.jumpState = { jumpTime: 0, jumping: false, direction: { x: 0, y: 0, z: 0 }, jumpDistance: 0 };
                statue.active = false;
                statue.home = (statue || obj).home || utils.clone(entity.position);
                statue.activeTexture = (statue || obj).activeTexture || entity.texture;
                statue.inactiveTexture = (statue || obj).inactiveTexture || entity.texture;
                statue.originalScale = entity.scale || 1;
                statue.lastJumped = 0;
                entity.position = (entity.position || obj) || { x: 0, y: 0, z: 0 };
                entity.rotation = ((entity || obj).position || obj).rotation || 0;
            }
        });
        collisionManager_1.Collision.Subscribe((collider, collidee, details) => {
            if (playerManager_1.isPlayer(collider) && isStatue(collidee)) {
                collider.velocity = utils.sub(collider.velocity, utils.scale(details.normal, 2));
            }
        });
        animationManager_1.Update.Subscribe((time) => {
            for (let entity of ces.getEntities(isStatue)) {
                let statue = entity.statue;
                if (statue.jumpState.jumping) {
                    let state = statue.jumpState;
                    if (state.jumpTime > statue.jumpTimeLength) {
                        state.jumping = false;
                        statue.lastJumped = time;
                        entity.scale = statue.originalScale;
                    }
                    else {
                        state.jumpTime += 0.01667;
                        let jumpPosition = state.jumpTime / statue.jumpTimeLength; // calculate what part of the jump we are in.
                        // Effectively we are integrating the sin function. Since we want each jump to go the distance in the
                        // Statue component settings, and the integral of sin(x)dx from 0 to pi is 2. We need to divide the value
                        // we multiply with the direction by 2 so that we go the proper distance
                        let jumpAmount = Math.sin(jumpPosition * Math.PI) / 2;
                        let distanceScaling = state.jumpDistance / statue.maxJumpDistance;
                        entity.position = utils.sum(entity.position, utils.scale(state.direction, jumpAmount * distanceScaling));
                        entity.scale = statue.originalScale + statue.jumpScaling * jumpAmount;
                    }
                }
                else {
                    let playerEntities = ces.getEntities(playerManager_1.isPlayer);
                    let target = statue.home;
                    let homeDelta = utils.sub(target, entity.position);
                    let homeDistance = utils.distance(homeDelta);
                    // Dunno why I did this... There should only ever be one player. Oh well
                    let closestPlayerPosition;
                    let closestDistance = Number.MAX_VALUE;
                    for (let player of playerEntities) {
                        let playerDelta = utils.sub(player.position, entity.position);
                        let playerDistance = utils.distance(playerDelta);
                        if (playerDistance < statue.activationRadius) {
                            if (closestDistance > playerDistance) {
                                closestPlayerPosition = player.position;
                                closestDistance = playerDistance;
                            }
                        }
                    }
                    let distance = homeDistance;
                    if (closestDistance != Number.MAX_VALUE) {
                        target = closestPlayerPosition;
                        distance = closestDistance;
                    }
                    if (distance > 0.01) {
                        let targetDelta = utils.sub(target, entity.position);
                        targetDelta = utils.shrink(targetDelta, distance);
                        let targetRotation = utils.xyAngle(targetDelta);
                        let r = entity.rotation;
                        let dr = utils.absoluteMin([targetRotation - r, (targetRotation + (2 * Math.PI)) - r, (targetRotation - (2 * Math.PI)) - r]);
                        if (time - statue.lastJumped > statue.timeBetweenJumps && Math.abs(dr) < 0.01) {
                            statue.jumpState = {
                                jumpTime: 0,
                                jumping: true,
                                direction: targetDelta,
                                jumpDistance: Math.min(distance, statue.maxJumpDistance)
                            };
                        }
                        else {
                            if (Math.abs(dr) > statue.rotationSpeed) {
                                entity.rotation += dr * statue.rotationSpeed / Math.abs(dr);
                                entity.rotation = entity.rotation % (Math.PI * 2);
                            }
                            else {
                                entity.rotation += dr * statue.rotationSlowdown;
                            }
                        }
                    }
                    else {
                        statue.lastJumped = time;
                    }
                }
            }
        });
    }
    exports_1("setup", setup);
    var ces, utils, animationManager_1, playerManager_1, collisionManager_1, obj;
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
            },
            function (playerManager_1_1) {
                playerManager_1 = playerManager_1_1;
            },
            function (collisionManager_1_1) {
                collisionManager_1 = collisionManager_1_1;
            }
        ],
        execute: function () {
            obj = {};
        }
    };
});

//# sourceMappingURL=statueManager.js.map
