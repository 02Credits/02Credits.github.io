import * as ces from "./ces";
import {Update} from "./animationManager";
import utils from "./utils";

import {Dimensions, Position} from "./pixiManager"
import {EventManager3} from "./eventManager";

import {CombinedEntity} from "./entity";

interface Circle {
    kind: "circle"
}

interface Rectangle {
    kind: "rectangle"
}

interface Polygon {
    kind: "polygon"
    points: number[][]
}

export interface Entity {
    collidable?: boolean;
    position: Position;
    dimensions: Dimensions;
    renderer?: {
        scale: number;
    };
    collisionShape?: Circle | Rectangle | Polygon;
}
export function isCollidable(entity: CombinedEntity): entity is Entity { return "collidable" in entity; }

// Algorithm modified from http://wiki.roblox.com/index.php?title=2D_Collision_Detection
function getNormal(vec: number[]) {
    return [vec[1], -vec[0]];
}

function subVec(vec1: number[], vec2: number[]) {
    let retVec = [];
    for (let i = 0; i < vec1.length; i++) {
        retVec[i] = vec1[i] - vec2[i];
    }
    return retVec;
}

function dotVec(vec1: number[], vec2: number[]) {
    let retVal = 0;
    for (let i = 0; i < vec1.length; i++) {
        retVal += vec1[i] * vec2[i];
    }
    return retVal;
}

function vecLength(vec: number[]) {
    return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
}

function unitVec(vec: number[]) {
    let length = vecLength(vec);
    return [
        vec[0] / length,
        vec[1] / length
    ];
}

function rotateAndTranslate(entity: Entity, relativePoint: number[]) {
    let center = [entity.position.x, entity.position.y];
    let rotation = 0;
    let scale = utils.defaultValue(() => entity.renderer.scale, 1);
    if ("rotation" in entity.position) {
        rotation = entity.position.rotation;
    }

    let newX = center[0] + (relativePoint[0] * scale - center[0]) * Math.cos(rotation) - (relativePoint[1] * scale - center[1]) * Math.sin(rotation);
    let newY = center[1] + (relativePoint[0] * scale - center[0]) * Math.sin(rotation) + (relativePoint[1] * scale - center[1]) * Math.cos(rotation);
    relativePoint[0] = newX;
    relativePoint[1] = newY;
}

function getCorners(entity: Entity) {
    if (entity.collisionShape == null || entity.collisionShape.kind === "rectangle") {
        let scale = utils.defaultValue(() => entity.renderer.scale, 1);
        let left = entity.position.x + entity.dimensions.width * entity.position.cx * scale;
        let right = entity.position.x - entity.dimensions.width * (1 - entity.position.cx) * scale;
        let bottom = entity.position.y + entity.dimensions.height * entity.position.cy * scale;
        let top = entity.position.y - entity.dimensions.height * (1 - entity.position.cy) * scale;

        let corners = [
            [left, top],
            [right, top],
            [right, bottom],
            [left, bottom]
        ];

        for (let corner of corners) {
            rotateAndTranslate(entity, corner);
        }
        return corners;
    } else if (entity.collisionShape.kind === "polygon") {
        let corners = entity.collisionShape.points;
        for (let corner of corners) {
            rotateAndTranslate(entity, corner);
        }
    } else {
        return [];
    }
}

function getAxis(entity: Entity) {
    if (entity.collisionShape == null || entity.collisionShape.kind != "circle") {
        let corners = getCorners(entity);
        return [
            getNormal(unitVec(subVec(corners[0], corners[1]))),
            getNormal(unitVec(subVec(corners[0], corners[3])))
        ];
    } else {
        return [];
    }
}

function projectedBounds(entity: Entity, axis: number[]) {
    if (entity.collisionShape != null && entity.collisionShape.kind === "circle") {
        let scale = utils.defaultValue(() => entity.renderer.scale, 1);
        let center = dotVec([entity.position.x, entity.position.y], axis);
        let radius = Math.max(entity.dimensions.width * scale, entity.dimensions.height * scale) / 2;
        return {max: center + radius, min: center - radius};
    } else {
        let corners = getCorners(entity);
        let min = dotVec(corners[0], axis);
        let max = min;
        for (let i = 1; i < corners.length; i++) {
            let corner = corners[i];
            let projectedCorner = dotVec(corner, axis);
            if (projectedCorner > max) max = projectedCorner;
            if (projectedCorner < min) min = projectedCorner;
        }
        return {min: min, max: max};
    }
}

function calculateOverlap(e1: Entity, e2: Entity, axis: number[]) {
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
    let result: {depth: number, normal: number[]} = null;
    let normal: number[] = [];
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

export let Collision = new EventManager3<Entity, Entity, {depth: number, normal: number[]}>();

export function Setup() {
    Update.Subscribe(() => {
        let collidables = ces.GetEntities(isCollidable);
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
