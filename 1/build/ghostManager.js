System.register(["./events.js", "./ces.js"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var events_js_1, ces_js_1;
    return {
        setters:[
            function (events_js_1_1) {
                events_js_1 = events_js_1_1;
            },
            function (ces_js_1_1) {
                ces_js_1 = ces_js_1_1;
            }],
        execute: function() {
            exports_1("default",function () {
                events_js_1.default.Subscribe("ces.update.ghost", function (entity) {
                    var player = _(ces_js_1.default.GetEntities("player")).first();
                    var dx = player.position.x - entity.position.x;
                    var dy = player.position.y - entity.position.y;
                    var length = Math.sqrt(dx * dx + dy * dy) / entity.ghost.speed;
                    dx = dx / length;
                    dy = dy / length;
                    entity.position.x += dx;
                    entity.position.y += dy;
                    if (Math.random() < entity.ghost.shootChance) {
                        ces_js_1.default.AddEntity({
                            position: entity.position,
                            dimensions: {
                                width: 5,
                                height: 5
                            },
                            rendered: {
                                texture: "Wall.png"
                            },
                            collidable: true,
                            bullet: true
                        });
                    }
                    return true;
                });
            });
        }
    }
});
//# sourceMappingURL=ghostManager.js.map