import * as pixi from "pixi.js";

import * as ces from "./ces";
import {Update} from "./animationManager";

import {Dimensions, Position, overlay} from "./pixiManager"
import {EventManager3} from "./eventManager";

import {CombinedEntity} from "./entity";

import * as geometryUtils from "./geometryUtils";

interface Circle {
  kind: "circle"
}

interface Rectangle {
  kind: "rectangle"
}

interface Poly {
  kind: "polygon"
  points: geometryUtils.Polygon
}

interface CompoundPoly {
  kind: "compound polygon"
  children: geometryUtils.Polygon[]
}

const obj: any = {};

export interface GeometryEntity {
  position: Position;
  dimensions: Dimensions;
  renderer?: {
    scale: number;
  };
  collisionShape?: Circle | Rectangle | Poly | CompoundPoly;
}

export interface Entity extends GeometryEntity {
  collidable: boolean;
}
export function isCollidable(entity: CombinedEntity): entity is Entity { return "collidable" in entity; }

// Algorithm modified from http://wiki.roblox.com/index.php?title=2D_Collision_Detection
export function getCorners(entity: GeometryEntity) : geometryUtils.Polygon[]{
  let scale = (entity.renderer || obj).scale || 1;
  let rotation = entity.position.rotation || 0;
  let position = [entity.position.x, entity.position.y];
  let corners: geometryUtils.Polygon[] = [];
  if (entity.collisionShape == null || entity.collisionShape.kind === "rectangle") {
    let left = entity.position.x + entity.dimensions.width * entity.position.cx;
    let right = entity.position.x - entity.dimensions.width * (1 - entity.position.cx);
    let bottom = entity.position.y + entity.dimensions.height * entity.position.cy;
    let top = entity.position.y - entity.dimensions.height * (1 - entity.position.cy);

    corners.push([
      [left, top],
      [right, top],
      [right, bottom],
      [left, bottom]
    ]);
  } else if (entity.collisionShape.kind === "polygon") {
    corners = [entity.collisionShape.points];
  } else if (entity.collisionShape.kind === "compound polygon"){
    for (let child of entity.collisionShape.children) {
      corners.push(child);
    }
  }
  let retList: geometryUtils.Polygon[] = [];
  for (let cornersList of corners) {
    retList.push(geometryUtils.transformPoly(cornersList, position, rotation, scale));
  }
  return retList;
}

function getAxis(entity: Entity) {
  if (entity.collisionShape == null || entity.collisionShape.kind != "circle") {
    let axis: geometryUtils.Vec[] = [];
    let childCorners = getCorners(entity);
    for (let child of childCorners) {
      let previous = child[child.length - 1];
      for (let corner of child) {
        axis.push(geometryUtils.normal(geometryUtils.unit(geometryUtils.sub(corner, previous))));
        previous = corner;
      }
    }
    return axis;
  } else {
    return [];
  }
}

function projectedBounds(entity: Entity, axis: geometryUtils.Vec) {
  if (entity.collisionShape != null && entity.collisionShape.kind === "circle") {
    let scale = ((entity || obj).renderer || obj).scale || 1;
    let center = geometryUtils.dot([entity.position.x, entity.position.y], axis);
    let radius = Math.max(entity.dimensions.width * scale, entity.dimensions.height * scale) / 2;
    return {max: center + radius, min: center - radius};
  } else {
    let corners = getCorners(entity);
    let min = geometryUtils.dot(corners[0][0], axis);
    let max = min;
    for (let child of corners) {
      for (let corner of child) {
        let projectedCorner = geometryUtils.dot(corner, axis);
        if (projectedCorner > max) max = projectedCorner;
        if (projectedCorner < min) min = projectedCorner;
      }
    }
    return {min: min, max: max};
  }
}

function calculateOverlap(e1: Entity, e2: Entity, axis: geometryUtils.Vec) {
  let b1 = projectedBounds(e1, axis);
  let b2 = projectedBounds(e2, axis);
  if (b2.min > b1.max || b2.max < b1.min) {
    return null;
  }
  return b1.max > b2.max ? -(b2.max - b1.min) : (b1.max - b2.min);
}

function getOverlap(e1: Entity, e2: Entity) {
  let c1 = getCorners(e1);
  let c2 = getCorners(e2);
  let result: {depth: number, normal: geometryUtils.Vec} = null;
  let normal: geometryUtils.Vec = [];
  for (let axis of getAxis(e1).concat(getAxis(e2))) {
    let overlap = calculateOverlap(e1, e2, axis);
    if (overlap == null) return null;

    if (result == null || Math.abs(overlap) < result.depth) {
      if (overlap < 0) {
        result = {
          depth: -overlap,
          normal: [
              -axis[0],
              -axis[1]
          ]
        }
      } else {
        result = {
          depth: overlap,
          normal: axis
        }
      }
    }
  }
  return result;
}

export let Collision = new EventManager3<Entity, Entity, {depth: number, normal: geometryUtils.Vec}>();

export function Setup() {
  let physicsOverlay = new pixi.Graphics();
  overlay.addChild(physicsOverlay);
  Update.Subscribe(() => {
    let collidables = ces.GetEntities(isCollidable);

    physicsOverlay.clear();
    for (let collider of collidables) {
      if (!collider.collisionShape || collider.collisionShape.kind === "rectangle") {
        
      }
    }

    for (let collider of collidables) {
      for (let collidable of collidables) {
        if (collidable !== collider) {
          let result = getOverlap(collider, collidable);
          if (result !== null) {
            Collision.Publish(collider, collidable, result);
          }
        }
      }
    }
  });
}
