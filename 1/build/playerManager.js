System.register(["underscore", "./events.js", "./inputManager.js", "./ces.js"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var underscore_1, events_js_1, inputManager_js_1, ces_js_1;
    return {
        setters:[
            function (underscore_1_1) {
                underscore_1 = underscore_1_1;
            },
            function (events_js_1_1) {
                events_js_1 = events_js_1_1;
            },
            function (inputManager_js_1_1) {
                inputManager_js_1 = inputManager_js_1_1;
            },
            function (ces_js_1_1) {
                ces_js_1 = ces_js_1_1;
            }],
        execute: function() {
            exports_1("default",function () {
                events_js_1.default.Subscribe("ces.checkEntity.player", function (entity) {
                    return underscore_1.default.has(entity, "rendered");
                });
                events_js_1.default.Subscribe("ces.addEntity.player", function (entity) {
                    entity.player.vx = 0;
                    entity.player.vy = 0;
                    entity.player.walkAnimation = 0;
                    return true;
                });
                events_js_1.default.Subscribe("ces.checkEntity.foot", function (entity) {
                    return underscore_1.default.has(entity, "rendered");
                });
                events_js_1.default.Subscribe("ces.checkEntity.wall", function (entity) {
                    return underscore_1.default.has(entity, "position") &&
                        underscore_1.default.has(entity, "dimensions");
                });
                events_js_1.default.Subscribe("ces.update.player", function (entity) {
                    updatePlayer(entity);
                    updateFeet(entity);
                    return true;
                });
                events_js_1.default.Subscribe("collision", function (event) {
                    var player = event.collider;
                    var collidable = event.collidable;
                    if (underscore_1.default(player).has("player")) {
                        if (underscore_1.default(collidable).has("wall")) {
                            if (Math.abs(event.xError) < Math.abs(event.yError)) {
                                player.position.x -= event.xError * 2;
                            }
                            else {
                                player.position.y -= event.yError * 2;
                            }
                        }
                        else if (underscore_1.default(collidable).has("hole")) {
                            var minError = 0;
                            if (Math.abs(event.xError) < Math.abs(event.yError)) {
                                minError = Math.abs(event.xError);
                                player.position.x += event.xError * collidable.hole.steepness;
                            }
                            else {
                                minError = Math.abs(event.yError);
                                player.position.y += event.yError * collidable.hole.steepness;
                            }
                            var factor = 1.2 - minError * 0.02;
                            if (factor < 0) {
                                factor = 0;
                            }
                            if (factor > 1) {
                                factor = 1;
                            }
                            player.rendered.alpha = factor;
                            player.player.scale = factor;
                            if (minError > 1) {
                                events_js_1.default.Publish("fell");
                            }
                        }
                    }
                    return true;
                });
                function updateFeet(playerEntity) {
                    var feet = ces_js_1.default.GetEntities("foot");
                    var scale = 1;
                    if (underscore_1.default.has(playerEntity.player, "scale")) {
                        scale = playerEntity.player.scale;
                    }
                    underscore_1.default(feet).each(function (entity) {
                        entity.rendered.scale = scale;
                        entity.foot.y = entity.foot.x * Math.sin(playerEntity.player.walkAnimation) * playerEntity.player.stepSize * playerEntity.player.speed;
                        entity.position.rotation = playerEntity.position.rotation;
                        entity.position.x = playerEntity.position.x + (entity.foot.y * Math.cos(-entity.position.rotation + Math.PI / 2) + entity.foot.x * Math.sin(-entity.position.rotation + Math.PI / 2)) * scale;
                        entity.position.y = playerEntity.position.y + (entity.foot.x * Math.cos(-entity.position.rotation + Math.PI / 2) - entity.foot.y * Math.sin(-entity.position.rotation + Math.PI / 2)) * scale;
                        if (underscore_1.default.has(playerEntity.rendered, "alpha")) {
                            entity.rendered.alpha = playerEntity.rendered.alpha;
                        }
                    });
                }
                function updatePlayer(entity) {
                    var mouseState = inputManager_js_1.default.MouseState();
                    if (mouseState.enabled) {
                        var dx = mouseState.x - entity.position.x;
                        var dy = mouseState.y - entity.position.y;
                        entity.position.rotation = Math.atan2(dy, dx) + Math.PI / 2;
                        var length = Math.sqrt(dx * dx + dy * dy);
                        if (entity.dimensions && length > 30) {
                            dx = dx / length;
                            dy = dy / length;
                            entity.player.vx += dx * 0.8;
                            entity.player.vy += dy * 0.8;
                        }
                    }
                    if (underscore_1.default.has(entity.player, "scale")) {
                        entity.rendered.scale = entity.player.scale;
                    }
                    entity.player.vx *= 0.85;
                    entity.player.vy *= 0.85;
                    var playerSpeed = Math.sqrt(entity.player.vx * entity.player.vx + entity.player.vy * entity.player.vy);
                    entity.player.speed = playerSpeed;
                    entity.player.walkAnimation += playerSpeed * entity.player.stepSpeed;
                    entity.position.x += entity.player.vx;
                    entity.position.y += entity.player.vy;
                }
            });
        }
    }
});
//# sourceMappingURL=playerManager.js.map