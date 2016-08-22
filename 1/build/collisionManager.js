System.register(["./events.js", "underscore", "./ces.js"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var events_js_1, underscore_1, ces_js_1;
    return {
        setters:[
            function (events_js_1_1) {
                events_js_1 = events_js_1_1;
            },
            function (underscore_1_1) {
                underscore_1 = underscore_1_1;
            },
            function (ces_js_1_1) {
                ces_js_1 = ces_js_1_1;
            }],
        execute: function() {
            exports_1("default",function () {
                events_js_1.default.Subscribe("ces.update.collider", function (entity) {
                    var collidables = ces_js_1.default.GetEntities("collidable");
                    underscore_1.default(collidables).each(function (collidable) {
                        if (collidable !== entity) {
                            var left = collidable.position.x + collidable.dimensions.width * collidable.position.cx;
                            var right = collidable.position.x - collidable.dimensions.width * (1 - collidable.position.cx);
                            var bottom = collidable.position.y + collidable.dimensions.height * collidable.position.cy;
                            var top = collidable.position.y - collidable.dimensions.height * (1 - collidable.position.cy);
                            var position = entity.position;
                            var dimensions = entity.dimensions;
                            var xError = 0;
                            var yError = 0;
                            if (position.x > collidable.position.x && position.x - dimensions.width / 2 < left &&
                                ((position.y > collidable.position.y && position.y - dimensions.height / 2 < bottom) ||
                                    (position.y < collidable.position.y && position.y + dimensions.height / 2 > top))) {
                                xError = (position.x - dimensions.width / 2) - left;
                            }
                            if (position.x < collidable.position.x && position.x + dimensions.width / 2 > right &&
                                ((position.y > collidable.position.y && position.y - dimensions.height / 2 < bottom) ||
                                    (position.y < collidable.position.y && position.y + dimensions.height / 2 > top))) {
                                xError = (position.x + dimensions.width / 2) - right;
                            }
                            if (position.y < collidable.position.y && position.y + dimensions.height / 2 > top &&
                                ((position.x < collidable.position.x && position.x + dimensions.width / 2 > right) ||
                                    (position.x > collidable.position.x && position.x - dimensions.width / 2 < left))) {
                                yError = (position.y + dimensions.height / 2) - top;
                            }
                            if (position.y > collidable.position.y && position.y - dimensions.height / 2 < bottom &&
                                ((position.x < collidable.position.x && position.x + dimensions.width / 2 > right) ||
                                    (position.x > collidable.position.x && position.x - dimensions.width / 2 < left))) {
                                yError = (position.y - dimensions.height / 2) - bottom;
                            }
                            if (xError != 0 || yError != 0) {
                                events_js_1.default.Publish("collision", { collider: entity, collidable: collidable, xError: xError, yError: yError });
                            }
                        }
                    });
                    return true;
                });
            });
        }
    }
});
//# sourceMappingURL=collisionManager.js.map