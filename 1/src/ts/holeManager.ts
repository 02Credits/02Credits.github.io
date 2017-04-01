import events from "./events.js";
export default () => {
    events.Subscribe("collision", (event: any) => {
        var player = event.collider;
        var collidable = event.collidable;
        var details = event.details;
        if ("player" in player) {
            if ("hole" in collidable) {
                if (details.depth > Math.max(player.dimensions.width, player.dimensions.height)) {
                    player.position.x = collidable.position.x;
                    player.position.y = collidable.position.y;
                    events.Publish("fell");
                } else {
                    player.position.x += details.normal[0] * details.depth * collidable.hole.steepness;
                    player.position.y += details.normal[1] * details.depth * collidable.hole.steepness;
                }

                var factor = 1.2 - details.depth * 0.2;
                if (factor < 0) {
                    factor = 0;
                }

                if (factor > 1) {
                    factor = 1;
                }

                player.rendered.alpha = factor;
                player.rendered.scale = factor;
            }
        }
    });
};
