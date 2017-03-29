import events from "./events.js";
import input from "./inputManager.js";
import ces from "./ces.js";

function updateFeet(playerEntity: any) {
    var feet = ces.GetEntities("foot");
    var scale = 1;
    if ("scale" in playerEntity.rendered) {
        scale = playerEntity.rendered.scale;
    }

    for (let entity of feet) {
        entity.rendered.scale = scale;
        entity.foot.y = entity.foot.x * Math.sin(playerEntity.player.walkAnimation) * playerEntity.player.stepSize * playerEntity.player.speed;
        entity.position.rotation = playerEntity.position.rotation;
        entity.position.x = playerEntity.position.x + (entity.foot.y * Math.cos(-entity.position.rotation + Math.PI / 2) + entity.foot.x * Math.sin(-entity.position.rotation + Math.PI / 2)) * scale;
        entity.position.y = playerEntity.position.y + (entity.foot.x * Math.cos(-entity.position.rotation + Math.PI / 2) - entity.foot.y * Math.sin(-entity.position.rotation + Math.PI / 2)) * scale;

        if ("alpha" in playerEntity.rendered) {
            entity.rendered.alpha = playerEntity.rendered.alpha;
        }
    }
}

function updatePlayer(entity: any) {
    var mouseState = input.MouseState();
    var dx = mouseState.x - entity.position.x;
    var dy = mouseState.y - entity.position.y;

    entity.position.rotation = Math.atan2(dy, dx) + Math.PI / 2;

    var length = Math.sqrt(dx * dx + dy * dy);
    if (entity.dimensions && length > 30) {
        dx = dx / length;
        dy = dy / length;

        entity.player.vx += dx * 0.8;
        entity.player.vy += dy * 0.8;
    }

    entity.player.vx *= 0.85;
    entity.player.vy *= 0.85;

    var playerSpeed = Math.sqrt(entity.player.vx * entity.player.vx + entity.player.vy * entity.player.vy)
    entity.player.speed = playerSpeed;
    entity.player.walkAnimation += playerSpeed * entity.player.stepSpeed;

    entity.position.x += entity.player.vx;
    entity.position.y += entity.player.vy;
}

export default () => {
    events.Subscribe("ces.checkEntity.player", (entity) => {
        return "rendered" in entity;
    });

    events.Subscribe("ces.addEntity.player", (entity: any) => {
        entity.player.vx = 0;
        entity.player.vy = 0;
        entity.player.walkAnimation = 0;
    });

    events.Subscribe("ces.checkEntity.foot", (entity) => {
        return "rendered" in entity &&
               "child" in entity;
    });

    events.Subscribe("ces.checkEntity.wall", (entity) => {
        return "position" in entity &&
               "dimensions" in entity;
    });

    events.Subscribe("ces.update.player", (entity: any) => {
        updatePlayer(entity);
        updateFeet(entity);
    });

    events.Subscribe("collision", (event: any) => {
        var player = event.collider;
        var collidable = event.collidable;
        if ("player" in player) {
            if ("wall" in collidable) {
                if (Math.abs(event.xError) < Math.abs(event.yError)) {
                    player.position.x -= event.xError;
                } else {
                    player.position.y -= event.yError;
                }
            } else if ("hole" in collidable) {
                var minError = 0;
                if (Math.abs(event.xError) < Math.abs(event.yError)) {
                    minError = Math.abs(event.xError);
                    player.position.x += event.xError * collidable.hole.steepness;
                } else {
                    minError = Math.abs(event.yError);
                    player.position.y += event.yError * collidable.hole.steepness;
                }

                var factor = 1.2 - minError * 0.02;
                if (factor < 0) {
                    factor = 0;
                }

                if (factor > 1) {
                    factor = 1;
                }

                player.rendered.alpha = factor;
                player.rendered.scale = factor;

                if (minError > 1) {
                    events.Publish("fell")
                }
            }
        }
    });
}
