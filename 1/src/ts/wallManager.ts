import events from "./events.js";
export default () => {
    events.Subscribe("ces.checkEntity.physical", (physicalEntity: any) => {
        return "collider" in physicalEntity;
    });

    events.Subscribe("ces.checkEntity.wall", (entity) => {
        return "position" in entity &&
               "dimensions" in entity;
    });

    events.Subscribe("collision", (event: any) => {
        var player = event.collider;
        var collidable = event.collidable;
        var details = event.details;
        if ("player" in player) {
            if ("wall" in collidable) {
                player.position.x -= details.normal[0] * details.depth;
                player.position.y -= details.normal[1] * details.depth;
            }
        }
    });
};
