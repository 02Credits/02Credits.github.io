import events from "./events.js";
import ces from "./ces.js";

export default () => {
    events.Subscribe("ces.update.ghost", (entity: any) => {
        var player = _(ces.GetEntities("player")).first();
        var dx = player.position.x - entity.position.x;
        var dy = player.position.y - entity.position.y;
        var length = Math.sqrt(dx * dx + dy * dy) / entity.ghost.speed;
        dx = dx / length;
        dy = dy / length;
        entity.position.x += dx;
        entity.position.y += dy;

        if (Math.random() < entity.ghost.shootChance) {
            ces.AddEntity({
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
};
