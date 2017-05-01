System.register(["./ces", "./animationManager", "./cameraManager", "pixi.js"], function (exports_1, context_1) {
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __moduleName = context_1 && context_1.id;
    function isRenderable(entity) { return "rendered" in entity; }
    exports_1("isRenderable", isRenderable);
    function afterLoad() {
        ces.EntityRemoved.Subscribe((entity) => {
            if (isRenderable(entity) && sprites[entity.id]) {
                stages[entity.position.z].removeChild(sprites[entity.id]);
            }
        });
        ces.EntityAdded.Subscribe((entity) => {
            if (isRenderable(entity)) {
                let rendered = entity.rendered;
                sprites[entity.id] = new pixi.Sprite(textures[rendered.texture].texture);
                updateSprite(entity);
                let stage;
                if (!("z" in entity.position)) {
                    entity.position.z = 5;
                }
                if (!(entity.position.z.toString() in stages)) {
                    stages[entity.position.z] = new pixi.Container();
                    root.addChild(stages[entity.position.z]);
                }
                stage = stages[entity.position.z];
                stage.addChild(sprites[entity.id]);
            }
        });
        animationManager_1.Update.Subscribe(() => {
            for (let entity of ces.GetEntities(isRenderable)) {
                updateSprite(entity);
            }
            let cameras = ces.GetEntities(cameraManager_1.isCamera);
            if (cameras.length > 0) {
                let cameraEntity = cameras[0];
                let scale = 1;
                if ("scale" in cameraEntity.camera) {
                    scale = cameraEntity.camera.scale;
                }
                root.x = -cameraEntity.position.x + (renderer.width / 2);
                root.y = -cameraEntity.position.y + (renderer.height / 2);
                root.scale.x = scale * renderer.width / 100;
                root.scale.y = scale * renderer.height / 100;
            }
            root.children = root.children.sort((stage1, stage2) => {
                if (stage1 === overlay) {
                    return -1;
                }
                else if (stage2 === overlay) {
                    return 1;
                }
                let zIndex1, zIndex2;
                for (let index of Object.keys(stages)) {
                    if (stages[index] === stage1) {
                        zIndex1 = index;
                    }
                    if (stages[index] === stage2) {
                        zIndex2 = index;
                    }
                }
                return zIndex1.localeCompare(zIndex2);
            });
            renderer.render(root);
        });
    }
    function updateSprite(entity) {
        if (sprites[entity.id]) {
            let rendered = entity.rendered;
            let position = entity.position;
            let sprite = sprites[entity.id];
            sprite.x = position.x;
            sprite.y = position.y;
            if (sprite.texture !== textures[rendered.texture].texture) {
                sprite.texture = textures[rendered.texture].texture;
            }
            if ("alpha" in rendered) {
                sprite.alpha = rendered.alpha;
            }
            let scale = 1;
            if ("scale" in rendered) {
                scale = rendered.scale;
            }
            if ("dimensions" in entity) {
                sprite.width = entity.dimensions.width * scale;
                sprite.height = entity.dimensions.height * scale;
            }
            else {
                entity.dimensions = {
                    width: sprite.width,
                    height: sprite.height
                };
            }
            if ("rotation" in position) {
                sprite.rotation = position.rotation;
            }
            if ("cx" in position) {
                sprite.anchor.x = position.cx;
            }
            if ("cy" in position) {
                sprite.anchor.y = position.cy;
            }
        }
    }
    function positionRenderer() {
        let size = Math.min(window.innerWidth, window.innerHeight) - 100;
        renderer.view.style.width = size + "px";
        renderer.view.style.height = size + "px";
        renderer.view.style.marginLeft = -size / 2 + "px";
        renderer.view.style.marginTop = -size / 2 + "px";
        renderer.resize(size, size);
    }
    function Setup(texturePaths) {
        return __awaiter(this, void 0, void 0, function* () {
            document.getElementById("game").appendChild(renderer.view);
            renderer.view.focus();
            window.onresize = positionRenderer;
            positionRenderer();
            return new Promise((resolve) => {
                for (let path of texturePaths) {
                    let location = window.location.href.replace('[^/]*$', '');
                    pixi.loader.add(path, location + "assets/" + path).load((loader, resources) => {
                        textures[path] = resources[path];
                        if (Object.keys(textures).length == texturePaths.length) {
                            afterLoad();
                            resolve();
                        }
                    });
                }
            });
        });
    }
    exports_1("Setup", Setup);
    var ces, animationManager_1, cameraManager_1, pixi, sprites, size, renderer, stages, textures, root, overlay;
    return {
        setters: [
            function (ces_1) {
                ces = ces_1;
            },
            function (animationManager_1_1) {
                animationManager_1 = animationManager_1_1;
            },
            function (cameraManager_1_1) {
                cameraManager_1 = cameraManager_1_1;
            },
            function (pixi_1) {
                pixi = pixi_1;
            }
        ],
        execute: function () {
            sprites = {};
            size = Math.min(window.innerWidth, window.innerHeight);
            exports_1("renderer", renderer = new pixi.CanvasRenderer(size, size));
            stages = {};
            textures = {};
            exports_1("root", root = new pixi.Container());
            exports_1("overlay", overlay = new pixi.Container());
            root.addChild(overlay);
        }
    };
});

//# sourceMappingURL=pixiManager.js.map
