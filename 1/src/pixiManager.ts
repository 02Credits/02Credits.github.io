import pixi from "pixi.js";
import events from "./events.js";
import ces from "./ces.js";

interface RenderInfo {
    texture: string;
    scale?: {x: number; y: number}
}

interface Position {
    x: number;
    y: number;
    cx?: number;
    cy?: number;
    rotation?: number;
}

interface RenderedEntity {
    rendered: RenderInfo;
    position: Position;
    id: number;
}

export default () => {
    var sprites: { [id: number]: pixi.Sprite }  = { };
    var renderer = new pixi.WebGLRenderer(800, 600);
    document.getElementById("game").appendChild(renderer.view);

    var stage = new pixi.Container();

    events.Subscribe("ces.checkEntity.rendered", (entity: RenderedEntity) => {
        return _(entity).has("position");
    })

    events.Subscribe("ces.addEntity.rendered", (entity: RenderedEntity) => {
        var rendered = entity.rendered;
        pixi.loader.add(rendered.texture, window.location + "assets/" + rendered.texture).load((loader, resources) => {
            sprites[entity.id] = new pixi.Sprite(resources[rendered.texture].texture);
            updateSprite(entity);
            stage.addChild(sprites[entity.id]);
        });
        return true;
    });

    events.Subscribe("ces.update.rendered", (entity: RenderedEntity) => {
        updateSprite(entity);
        return true;
    })

    function updateSprite(entity: RenderedEntity) {
        if (sprites[entity.id]) {
            var rendered = entity.rendered;
            var position = entity.position;
            var sprite = sprites[entity.id];

            sprite.x = position.x;
            sprite.y = position.y;

            if (rendered.scale) {
                sprite.scale.x = rendered.scale.x;
                sprite.scale.y = rendered.scale.y;
            }

            if (position.rotation) {
                sprite.rotation = position.rotation;
            }

            if (position.cx) {
                sprite.anchor.x = position.cx;
            }

            if (position.cy) {
                sprite.anchor.y = position.cy;
            }
        }
     }

    function animate() {
        requestAnimationFrame(animate);

        ces.PublishEvent("update");

        renderer.render(stage);
    }

    animate();
}
