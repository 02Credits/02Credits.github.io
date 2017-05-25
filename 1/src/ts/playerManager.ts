import * as input from "./inputManager";
import * as ces from "./ces";
import * as utils from "./utils"
import {Update} from "./animationManager";
import {Entity as RenderedEntity} from "./webglManager";
import {Entity as ChildEntity} from "./parentManager";

import {CombinedEntity} from "./entity";

export interface PlayerEntity extends RenderedEntity {
  player: {
    stepSpeed: number,
    stepSize: number,
    speed: number,
    velocity: utils.Vec,
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

  var feet = ces.getEntities(isFoot);
  for (let entity of feet) {
    entity.child.relativePosition.y =
      Math.sin(playerEntity.player.walkAnimation) * // Move steps by sin wave
      playerEntity.player.stepSize *                // Account for settings
      playerEntity.player.speed *                   // Step faster as you walk faster
      entity.child.relativePosition.x *             // Account for which foot and scale a bit
      scale
  }
}

function updatePlayer(entity: PlayerEntity) {
  let mouseState = input.MouseState();
  let delta = utils.sub(mouseState.position, entity.position);

  entity.rotation = utils.angle(delta) + Math.PI / 2;
  let length = utils.length(delta);
  if (entity.dimensions && length > 3) {
    delta = utils.shrink(delta, length);

    entity.player.velocity = utils.toPoint(utils.sum(entity.player.velocity, utils.scale(delta, 0.1)));
  }

  entity.player.velocity = utils.toPoint(utils.scale(entity.player.velocity, 0.85));

  var playerSpeed = utils.length(entity.player.velocity);
  entity.player.speed = playerSpeed;
  entity.player.walkAnimation += playerSpeed * entity.player.stepSpeed;

  entity.position = utils.toPoint(utils.sum(entity.position, entity.player.velocity));
}

export function setup() {
  ces.EntityAdded.Subscribe((entity) => {
    if (isPlayer(entity)) {
      entity.player.velocity = {x: 0, y: 0};
      entity.player.walkAnimation = 0;
    }
  });

  Update.Subscribe(() => {
    for (let entity of ces.getEntities(isPlayer)) {
      updatePlayer(entity);
      updateFeet(entity);
    }
  });
}
