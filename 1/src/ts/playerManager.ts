import * as input from "./inputManager";
import * as ces from "./ces";
import * as utils from "./utils"
import {Update} from "./animationManager";
import {Entity as RenderedEntity} from "./webglManager";
import {Entity as ChildEntity} from "./parentManager";
import {Entity as MotionEntity} from "./motionManager";

import {CombinedEntity} from "./entity";

export interface PlayerEntity extends RenderedEntity, MotionEntity {
  player: {
    stepSpeed: number,
    stepSize: number,
    speed: number,
    walkAnimation?: number
  }
}
export function isPlayer(entity: CombinedEntity): entity is PlayerEntity { return "player" in entity; };

export interface FootEntity extends RenderedEntity, ChildEntity {
  foot: boolean
}
export function isFoot(entity: CombinedEntity): entity is FootEntity { return "foot" in entity; }

export interface PlayerParticle extends RenderedEntity, MotionEntity {
  playerParticle: true
}
export function isPlayerParticle(entity: CombinedEntity): entity is PlayerParticle { return "playerParticle" in entity; }

export type Entity = PlayerEntity | FootEntity | PlayerParticle;

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
  let delta = {x: 0, y: 0, z: 0};
  if (input.KeyDown("a")) {
    delta.x -=  10;
  }
  if (input.KeyDown("d")) {
    delta.x += 10;
  }
  if (input.KeyDown("w")) {
    delta.y += 10;
  }
  if (input.KeyDown("s")) {
    delta.y -= 10;
  }

  entity.rotation = utils.xyAngle(entity.velocity) + Math.PI / 2;
  let length = utils.length(delta);
  if (length != 0) {
    delta = utils.shrink(delta, length);
  }
  entity.velocity = utils.sum(entity.velocity, utils.scale(delta, 0.1));

  var playerSpeed = utils.length(entity.velocity);
  entity.player.speed = playerSpeed;
  entity.player.walkAnimation += playerSpeed * entity.player.stepSpeed;
}

function updatePlayerParticle(entity: PlayerParticle) {
  let playerEntities = ces.getEntities(isPlayer)
  let target: utils.Point;
  if (playerEntities.length != 0 && playerEntities.length == 0) {
    let playerEntity = playerEntities[0];
    target = playerEntity.position;
  } else {
    target = input.MouseState().position;
  }
  entity.velocity = utils.sum(utils.scale(utils.normalize(utils.sub(target, entity.position)), 0.1), entity.velocity);
}

export function setup() {
  ces.EntityAdded.Subscribe((entity) => {
    if (isPlayer(entity)) {
      entity.velocity = {x: 0, y: 0, z: 0};
      entity.player.walkAnimation = 0;
    }
    if (isPlayerParticle(entity)) {
      entity.velocity = {x: 0, y: 0, z: 0};
    }
  });

  Update.Subscribe(() => {
    for (let entity of ces.getEntities(isPlayer)) {
      updatePlayer(entity);
      updateFeet(entity);
    }

    for (let entity of ces.getEntities(isPlayerParticle)) {
      updatePlayerParticle(entity);
    }
  });
}
