import * as input from "./inputManager.js";
import * as ces from "./ces.js";
import {Update} from "./animationManager";
import {Entity as RenderedEntity} from "./webglManager";
import {Entity as ChildEntity} from "./parentManager";

import {CombinedEntity} from "./entity";

export interface PlayerEntity extends RenderedEntity {
    player: {
        stepSpeed: number,
        stepSize: number,
        speed: number,
        vx?: number,
        vy?: number,
        walkAnimation?: number
    }
}
export function isPlayer(entity: CombinedEntity): entity is PlayerEntity { return "player" in entity; };

export interface FootEntity extends RenderedEntity, ChildEntity {
    foot: boolean
}
export function isFoot(entity: CombinedEntity): entity is FootEntity { return "foot" in entity; }

export type Entity = PlayerEntity | FootEntity;

function updateFeet(playerEntity: PlayerEntity) {
    var scale = 1;
    if ("scale" in playerEntity) {
        scale = playerEntity.scale;
    }

    var feet = ces.GetEntities(isFoot);
    for (let entity of feet) {
        entity.child.relativePosition.y =
            Math.sin(playerEntity.player.walkAnimation) * // Move steps by sin wave
            playerEntity.player.stepSize *                // Account for settings
            playerEntity.player.speed *                   // Step faster as you walk faster
            entity.child.relativePosition.x *             // Account for which foot and scale a bit
            scale;
    }
}

function updatePlayer(entity: PlayerEntity) {
    var mouseState = input.MouseState();
    var dx = mouseState.x - entity.position.x;
    var dy = mouseState.y - entity.position.y;

    entity.rotation = Math.atan2(dy, dx) + Math.PI / 2;

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

export function Setup() {
    ces.EntityAdded.Subscribe((entity) => {
        if (isPlayer(entity)) {
            entity.player.vx = 0;
            entity.player.vy = 0;
            entity.player.walkAnimation = 0;
        }
    });

    Update.Subscribe(() => {
        for (let entity of ces.GetEntities(isPlayer)) {
            updatePlayer(entity);
            updateFeet(entity);
        }
    });
}
