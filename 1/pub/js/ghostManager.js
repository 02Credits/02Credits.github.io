System.register(["./events", "./ces"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var events_1, ces_1;
    return {
        setters: [
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (ces_1_1) {
                ces_1 = ces_1_1;
            }
        ],
        execute: function () {
            exports_1("default", () => {
                events_1.default.Subscribe("ces.update.ghost", (entity) => {
                    var player = ces_1.default.GetEntities("player")[0];
                    var dx = player.position.x - entity.position.x;
                    var dy = player.position.y - entity.position.y;
                    var length = Math.sqrt(dx * dx + dy * dy) / entity.ghost.speed;
                    dx = dx / length;
                    dy = dy / length;
                    entity.position.x += dx;
                    entity.position.y += dy;
                    if (Math.random() < entity.ghost.shootChance) {
                        ces_1.default.AddEntity({
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
                });
            });
        }
    };
});

//# sourceMappingURL=ghostManager.js.map
