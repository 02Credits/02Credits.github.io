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
        entity.child.relativePosition.y =
            Math.sin(playerEntity.player.walkAnimation) * // Move steps by sin wave
            playerEntity.player.stepSize *                // Account for settings
            playerEntity.player.speed *                   // Step faster as you walk faster
            entity.child.relativePosition.x *             // Account for which foot and scale a bit
            scale;
    }
}

function updatePlayer(entity: any) {
    var mouseState = input.MouseState();
    var dx = mouseState.x - entity.position.x;
    var dy = mouseState.y - entity.position.y;

    entity.position.rotation = Math.atan2(dy, dx) + Math.PI / 2;

    var length = Math.sqrt(dx * dx + dy * dy);
    if (entity.dimensions && length > 3) {
        dx = dx / length;
        dy = dy / length;

        entity.player.vx += dx * 0.1;
        entity.player.vy += dy * 0.1;
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

    events.Subscribe("ces.update.player", (entity: any) => {
        updatePlayer(entity);
        updateFeet(entity);
    });
}
