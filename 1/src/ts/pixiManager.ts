import events from "./events";
import ces from "./ces";

import * as pixi from "pixi.js";

export interface RenderInfo {
    texture: string;
    alpha?: number;
    scale?: number;
}

export interface Position {
    x: number;
    y: number;
    cx?: number;
    cy?: number;
    rotation?: number;
    z?: number;
}

export interface Dimensions {
    width: number;
    height: number;
}

export interface RenderedEntity {
    rendered: RenderInfo;
    position: Position;
    dimensions?: Dimensions;
    id: number;
}

let sprites: { [id: number]: pixi.Sprite }  = { };
let size = Math.min(window.innerWidth, window.innerHeight);
export let renderer = new pixi.CanvasRenderer(size, size);

let stages: { [id: string]: pixi.Container } =  { };
let uiStages: { [id: string]: pixi.Container } = { };

let textures: { [id: string]: pixi.loaders.Resource } = {};

export let root = new pixi.Container();
let overlay = new pixi.Container();

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
        return "position" in entity;
    });

    events.Subscribe("ces.addEntity.rendered", (entity: RenderedEntity) => {
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
    });

    events.Subscribe("ces.update.rendered", (entity: RenderedEntity) => {
        updateSprite(entity);
    });

    animate();
}

function updateSprite(entity: RenderedEntity) {
    if (sprites[entity.id]) {
        let rendered = entity.rendered;
        let position = entity.position;
        let sprite = sprites[entity.id];

        sprite.x = position.x;
        sprite.y = position.y;


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
        } else {
            entity.dimensions = {
                width: sprite.width,
                height: sprite.height
            }
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

function animate() {
    requestAnimationFrame(animate);

    ces.PublishEvent("update");

    let cameras = ces.GetEntities("camera");
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
}

function positionRenderer() {
    let size = Math.min(window.innerWidth, window.innerHeight);
    renderer.view.style.width = size + "px";
    renderer.view.style.height = size + "px";
    renderer.view.style.marginLeft = -size / 2 + "px";
    renderer.view.style.marginTop = -size / 2 + "px";
    renderer.resize(size, size);
}


export default async (texturePaths: string[]) => {
    document.getElementById("game").appendChild(renderer.view);
    renderer.view.focus();

    window.onresize = positionRenderer;
    positionRenderer();

    return new Promise((resolve) => {
        for (let path of texturePaths) {
            pixi.loader.add(path, window.location + "assets/" + path).load((loader: pixi.loaders.Loader, resources: { [id: string]: pixi.loaders.Resource }) => {
                textures[path] = resources[path];
                if (Object.keys(textures).length == texturePaths.length) {
                    afterLoad();
                    resolve();
                }
            });
        }
    });
}
