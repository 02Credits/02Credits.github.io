System.register(["pixi.js", "./events.js", "./ces.js"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var pixi_js_1, events_js_1, ces_js_1;
    return {
        setters:[
            function (pixi_js_1_1) {
                pixi_js_1 = pixi_js_1_1;
            },
            function (events_js_1_1) {
                events_js_1 = events_js_1_1;
            },
            function (ces_js_1_1) {
                ces_js_1 = ces_js_1_1;
            }],
        execute: function() {
            exports_1("default",function () {
                var sprites = {};
                var renderer = new pixi_js_1.default.WebGLRenderer(800, 600);
                document.getElementById("game").appendChild(renderer.view);
                var stage = new pixi_js_1.default.Container();
                events_js_1.default.Subscribe("ces.checkEntity.rendered", function (entity) {
                    return _(entity).has("position");
                });
                events_js_1.default.Subscribe("ces.addEntity.rendered", function (entity) {
                    var rendered = entity.rendered;
                    pixi_js_1.default.loader.add(rendered.texture, window.location + "assets/" + rendered.texture).load(function (loader, resources) {
                        sprites[entity.id] = new pixi_js_1.default.Sprite(resources[rendered.texture].texture);
                        updateSprite(entity);
                        stage.addChild(sprites[entity.id]);
                    });
                    return true;
                });
                events_js_1.default.Subscribe("ces.update.rendered", function (entity) {
                    updateSprite(entity);
                    return true;
                });
                function updateSprite(entity) {
                    if (sprites[entity.id]) {
                        var rendered = entity.rendered;
                        var position = entity.position;
                        var sprite = sprites[entity.id];
                        sprite.x = position.x;
                        sprite.y = position.y;
                        if (_.has(rendered, "scale")) {
                            sprite.scale.x = rendered.scale.x;
                            sprite.scale.y = rendered.scale.y;
                        }
                        if (_.has(position, "rotation")) {
                            sprite.rotation = position.rotation;
                        }
                        if (_.has(position, "cx")) {
                            sprite.anchor.x = position.cx;
                        }
                        if (_.has(position, "cy")) {
                            sprite.anchor.y = position.cy;
                        }
                    }
                }
                function animate() {
                    requestAnimationFrame(animate);
                    ces_js_1.default.PublishEvent("update");
                    renderer.render(stage);
                }
                animate();
            });
        }
    }
});
//# sourceMappingURL=pixiManager.js.map