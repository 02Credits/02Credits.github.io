import {CheckEntity} from "./ces";
import {Collision, Entity as CollidableEntity} from "./collisionManager";
import {Dimensions, Position} from "./pixiManager"
import {CombinedEntity} from "./entity";
import * as utils from "./utils";

export interface PhysicalEntity extends CollidableEntity {
  physical: boolean
}
export function isPhysical(entity: CombinedEntity): entity is PhysicalEntity { return "physical" in entity; }

export interface WallEntity {
  wall: boolean
  position: Position,
  dimensions: Dimensions
}
export function isWall(entity: CombinedEntity): entity is WallEntity { return "wall" in entity; }

export type Entity = PhysicalEntity | WallEntity;


export function setup() {
  Collision.Subscribe((player, collidable, details) => {
    if ("player" in player) {
      if ("wall" in collidable) {
        player.position = utils.toPoint(utils.sub(player.position, utils.scale(details.normal, details.depth)));
      }
    }
  });
}
