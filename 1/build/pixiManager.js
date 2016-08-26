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
            exports_1("default",function (texturePaths, loaded) {
                var sprites = {};
                var renderer = new pixi_js_1.default.CanvasRenderer(800, 600);
                document.getElementById("game").appendChild(renderer.view);
                renderer.view.focus();
                var stages = {};
                var textures = {};
                _(texturePaths).each(function (path) {
                    pixi_js_1.default.loader.add(path, window.location + "assets/" + path).load(function (loader, resources) {
                        textures[path] = resources[path];
                        if (_(textures).keys().length == texturePaths.length) {
                            afterLoad();
                            loaded();
                        }
                    });
                });
                function afterLoad() {
                    events_js_1.default.Subscribe("ces.removeEntity.rendered", function (entity) {
                        if (sprites[entity.id]) {
                            stages[entity.position.z].removeChild(sprites[entity.id]);
                        }
                        return true;
                    });
                    events_js_1.default.Subscribe("ces.checkEntity.rendered", function (entity) {
                        return _(entity).has("position");
                    });
                    events_js_1.default.Subscribe("ces.addEntity.rendered", function (entity) {
                        var rendered = entity.rendered;
                        sprites[entity.id] = new pixi_js_1.default.Sprite(textures[rendered.texture].texture);
                        updateSprite(entity);
                        var stage;
                        if (!_.has(entity.position, "z")) {
                            entity.position.z = 5;
                        }
                        if (!_(stages).has(entity.position.z.toString())) {
                            stages[entity.position.z] = new pixi_js_1.default.Container();
                            root.addChild(stages[entity.position.z]);
                        }
                        stage = stages[entity.position.z];
                        stage.addChild(sprites[entity.id]);
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
                            if (_.has(rendered, "alpha")) {
                                sprite.alpha = rendered.alpha;
                            }
                            var scale = 1;
                            if (_.has(rendered, "scale")) {
                                scale = rendered.scale;
                            }
                            if (_.has(entity, "dimensions")) {
                                sprite.width = entity.dimensions.width * scale;
                                sprite.height = entity.dimensions.height * scale;
                            }
                            else {
                                entity.dimensions = {
                                    width: sprite.width,
                                    height: sprite.height
                                };
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
                    var root = new pixi_js_1.default.Container();
                    function animate() {
                        requestAnimationFrame(animate);
                        ces_js_1.default.PublishEvent("update");
                        var cameras = ces_js_1.default.GetEntities("camera");
                        if (cameras.length > 0) {
                            var camera = cameras[0];
                            root.x = camera.position.x;
                            root.y = camera.position.y;
                        }
                        root.children = _(root.children).sortBy(function (stage) {
                            return _(stages).pairs().filter(function (p) { return p[1] === stage; }).map(function (p) { return p[0]; })[0];
                        });
                        renderer.render(root);
                    }
                    animate();
                }
            });
        }
    }
});
//# sourceMappingURL=pixiManager.js.map