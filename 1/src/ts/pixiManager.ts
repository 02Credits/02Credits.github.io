import events from "./events";
import ces from "./ces";

import * as pixi from "pixi.js";
import * as _ from "underscore";

interface RenderInfo {
    texture: string;
    alpha?: number;
    scale?: number;
}

interface Position {
    x: number;
    y: number;
    cx?: number;
    cy?: number;
    rotation?: number;
    z?: number;
}

interface Dimensions {
    width: number;
    height: number;
}

interface RenderedEntity {
    rendered: RenderInfo;
    position: Position;
    dimensions?: Dimensions;
    id: number;
}

var sprites: { [id: number]: pixi.Sprite }  = { };
var renderer = new pixi.CanvasRenderer(800, 600);

var stages: { [id: number]: pixi.Container } =  { };
var uiStages: { [id: number]: pixi.Container } = { };

var textures = {};

var root = new pixi.Container();
var overlay = new pixi.Container();

function afterLoad() {
    events.Subscribe("ces.removeEntity.rendered", (entity: RenderedEntity) => {
        if (sprites[entity.id]) {
            stages[entity.position.z].removeChild(sprites[entity.id]);
        }
    });

    events.Subscribe("ces.removeEntity.renderedUI", (entity: RenderedEntity) => {
        if (sprites[entity.id]) {
            uiStages[entity.position.z].removeChild(sprites[entity.id]);
        }
    });

    events.Subscribe("ces.checkEntity.rendered", (entity: RenderedEntity) => {
        return _(entity).has("position");
    });

    events.Subscribe("ces.addEntity.rendered", (entity: RenderedEntity) => {
        var rendered = entity.rendered;
        sprites[entity.id] = new pixi.Sprite(textures[rendered.texture].texture);
        updateSprite(entity);
        var stage;
        if (!_.has(entity.position, "z")) {
            entity.position.z = 5;
        }
        if (!_(stages).has(entity.position.z.toString())) {
            stages[entity.position.z] = new pixi.Container();
            root.addChild(stages[entity.position.z]);
        }
        stage = stages[entity.position.z];
        stage.addChild(sprites[entity.id]);
    });

    events.Subscribe("ces.update.rendered", (entity: RenderedEntity) => {
        updateSprite(entity);
    });

    animate();
}

function updateSprite(entity: RenderedEntity) {
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
        } else {
            entity.dimensions = {
                width: sprite.width,
                height: sprite.height
            }
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

    ces.PublishEvent("update");

    var cameras = ces.GetEntities("camera");
    if (cameras.length > 0) {
        var camera = cameras[0];
        root.x = camera.position.x;
        root.y = camera.position.y;
    }

    root.children = _(root.children).sortBy((stage) => {
        return _(stages).pairs().filter((p) => p[1] === stage).map(p => p[0])[0];
    });

    renderer.render(root);
}


export default async (texturePaths: string[]) => {
    document.getElementById("game").appendChild(renderer.view);
    renderer.view.focus();

    return new Promise((resolve) => {
        _(texturePaths).each((path) => {
            pixi.loader.add(path, window.location + "assets/" + path).load((loader, resources) => {
                textures[path] = resources[path];
                if (_(textures).keys().length == texturePaths.length) {
                    afterLoad();
                    resolve();
                }
            });
        });
    });
}
