import * as input from "./inputManager";
import * as ces from "./ces";
import * as utils from "./utils"
import ObjectPool from "./objectPool";
import {Update} from "./animationManager";
import {Entity as RenderedEntity} from "./webglManager";
import {Entity as ChildEntity} from "./parentManager";
import {Entity as MotionEntity} from "./motionManager";

import {CombinedEntity} from "./entity";

export interface PlayerEntity extends RenderedEntity, MotionEntity {
  player: {
    stepSpeed: number,
    stepSize: number,
    dashLength: number,
    particleBase: string,
    footBase: string,
    speed?: number,
    walkAnimation?: number,
    dashStartTime?: number,
    pool?: ObjectPool<PlayerParticle>
  },
  enabled?: boolean
}
export function isPlayer(entity: CombinedEntity): entity is PlayerEntity { return "player" in entity; };

export interface FootEntity extends RenderedEntity, ChildEntity {
  foot: boolean
}
export function isFoot(entity: CombinedEntity): entity is FootEntity { return "foot" in entity; }

export interface PlayerParticle extends RenderedEntity, MotionEntity {
  playerParticle: boolean
  dashLocation?: utils.Point,
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
      scale;
  }
}

function updatePlayer(entity: PlayerEntity, time: number) {
  if ("enabled" in entity && !entity.enabled) {
    if (time - entity.player.dashStartTime > entity.player.dashLength) {
      let particles = ces.getEntities(isPlayerParticle);
      let position = {x: 0, y: 0, z: 0};
      let velocity = {x: 0, y: 0, z: 0};
      for (let particle of particles) {
        position = utils.sum(position, particle.position);
        velocity = utils.sum(velocity, particle.velocity);
      }
      entity.position = utils.sum(
        utils.sub(entity.position, utils.flatten(entity.position)),
        utils.flatten(utils.shrink(position, particles.length))
      );
      entity.velocity = utils.flatten(utils.shrink(velocity, particles.length));
      entity.enabled = true;
    }
  } else {
    let mouseState = input.MouseState();
    if (mouseState.mouseButtons.left) {
      for (let i = 0; i < 10; i++) {
        let particle = entity.player.pool.New();
        particle.velocity = utils.scale(utils.normalize({x: Math.random() - 0.5, y: Math.random() - 0.5, z: 0}), 1.5);
        particle.position = entity.position;
        particle.dashLocation = mouseState.position;
        ces.addEntity(particle);
      }
      entity.enabled = false;
      entity.player.dashStartTime = time;
    } else {
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
  }
}

function updatePlayerParticle(entity: PlayerParticle) {
  let playerEntities = ces.getEntities(isPlayer)
  let target: utils.Point;
  if (playerEntities.length != 0) {
    let playerEntity = playerEntities[0];
    target = playerEntity.position;
    if (utils.length(utils.sub(entity.position, playerEntity.position)) < playerEntity.dimensions.x) {
      ces.removeEntity(entity);
      playerEntity.player.pool.Free(entity);
    }
  } else {
    target = entity.dashLocation;
  }
  entity.velocity = utils.sum(utils.scale(utils.normalize(utils.sub(target, entity.position)), 0.1), entity.velocity);
}

export function setup() {
  ces.EntityAdded.Subscribe((entity) => {
    if (isPlayer(entity)) {
      entity.velocity = {x: 0, y: 0, z: 0};
      entity.player.walkAnimation = 0;
      let particleBase = ces.getEntity(entity.player.particleBase) as any;
      entity.player.pool = new ObjectPool({
          ...particleBase,
        velocity: {x: 0, y: 0, z: 0},
        playerParticle: true,
        enabled: true
      });
      let footBase = ces.getEntity(entity.player.footBase);
      let footPool = new ObjectPool({
          ...footBase,
        enabled: true
      });
      let rightFoot = ces.addEntity({
          ...footPool.New(),
        id: "rightFoot",
        child: {
          relativePosition: {
            x: 1
          }
        }
      });
      let leftFoot = ces.addEntity({
          ...footPool.New(),
        id: "leftFoot",
        child: {
          relativePosition: {
            x: -1
          }
        }
      });
    }
  });

  Update.Subscribe((time) => {
    for (let entity of ces.getEntities(isPlayer, true)) {
      updatePlayer(entity, time);
      updateFeet(entity);
    }

    for (let entity of ces.getEntities(isPlayerParticle)) {
      updatePlayerParticle(entity);
    }
  });
}
