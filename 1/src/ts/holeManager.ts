import events from "./events.js";
export default () => {
    events.Subscribe("collision", (event: any) => {
        var fallable = event.collider;
        var collidable = event.collidable;
        var details = event.details;
        if ("fallable" in fallable) {
            if ("hole" in collidable) {
                if (details.depth > Math.max(fallable.dimensions.width, fallable.dimensions.height)) {
                    fallable.position.x = collidable.position.x;
                    fallable.position.y = collidable.position.y;
                    events.Publish("fell", fallable);
                } else {
                    fallable.position.x += details.normal[0] * details.depth * collidable.hole.steepness;
                    fallable.position.y += details.normal[1] * details.depth * collidable.hole.steepness;
                }

                var factor = 1.2 - details.depth * 0.2;
                if (factor < 0) {
                    factor = 0;
                }

                if (factor > 1) {
                    factor = 1;
                }

                fallable.rendered.alpha = factor;
                fallable.rendered.scale = factor;
            }
        }
    });
};
