import * as ces from "./ces";
import utils from "./utils";
import {Update} from "./animationManager";
import {RenderInfo, Position, Dimensions, Entity as RenderedEntity} from "./pixiManager";
import {isPlayer} from "./playerManager";
import {Collision} from "./collisionManager";

import {CombinedEntity} from "./entity";

export interface StatueComponent {
    // Current Jump progress
    jumpState?: {
        jumpTime: number;
        jumping: boolean;
        direction: {x: number, y: number};
        jumpDistance: number;
    }
    lastJumped?: number;
    // Light activated
    active?: boolean;
    // Home Position
    home?: {x: number, y: number};
    // Appearance
    activeTexture?: string;
    inactiveTexture?: string;
    // Jump triggering
    activationRadius: number;
    timeBetweenJumps: number;
    // Jump Characteristics
    maxJumpDistance: number;
    jumpTimeLength: number;
    jumpScaling: number;
    originalScale?: number;
    // Player Knockback
    knockBack: number;
    // Rotation Mechanics
    rotationSpeed: number;
    rotationSlowdown: number; // fraction to slow down by
}

export interface Entity extends RenderedEntity {
    statue: StatueComponent;
}
export function isStatue(entity: CombinedEntity): entity is Entity { return "statue" in entity; }

export function Setup() {
    ces.EntityAdded.Subscribe((entity) => {
        if (isStatue(entity)) {
            let statue = entity.statue;
            statue.jumpState = {jumpTime: 0, jumping: false, direction: {x:0, y:0}, jumpDistance: 0};
            statue.active = false;
            statue.home = utils.defaultValue(() => statue.home, {x: entity.position.x, y: entity.position.y});
            statue.activeTexture = utils.defaultValue(() => statue.activeTexture, entity.rendered.texture);
            statue.inactiveTexture = utils.defaultValue(() => statue.inactiveTexture, entity.rendered.texture);
            statue.originalScale = utils.defaultValue(() => statue.originalScale, 1);
            statue.lastJumped = 0;
            entity.position = utils.defaultValue(() => entity.position, {x: 0, y: 0, rotation: 0});
            entity.position.rotation = utils.defaultValue(() => entity.position.rotation, 0);
        }
    });

    Collision.Subscribe((collider, collidee, details) => {
        if (isPlayer(collider) && isStatue(collidee)) {
            collider.player.vx -= details.normal[0] * 2;
            collider.player.vy -= details.normal[1] * 2;
        }
    });

    Update.Subscribe((time) => {
        for (let entity of ces.GetEntities(isStatue)) {
            let statue = entity.statue;
            if (statue.jumpState.jumping) {
                let state = statue.jumpState;
                if (state.jumpTime > statue.jumpTimeLength) {     // Jump Finished
                    state.jumping = false;
                    statue.lastJumped = time;
                    entity.rendered.scale = statue.originalScale;
                } else {    // Jump in progress
                    state.jumpTime += 0.01667;
                    let jumpPosition = state.jumpTime / statue.jumpTimeLength; // calculate what part of the jump we are in.
                    // Effectively we are integrating the sin function. Since we want each jump to go the distance in the
                    // Statue component settings, and the integral of sin(x)dx from 0 to pi is 2. We need to divide the value
                    // we multiply with the direction by 2 so that we go the proper distance
                    let jumpAmount = Math.sin(jumpPosition * Math.PI) / 2;
                    let distanceScaling = state.jumpDistance / statue.maxJumpDistance;
                    entity.position.x += jumpAmount * state.direction.x * distanceScaling;
                    entity.position.y += jumpAmount * state.direction.y * distanceScaling;
                    entity.rendered.scale = statue.originalScale + statue.jumpScaling * jumpAmount;
                }
            } else {
                let playerEntities = ces.GetEntities(isPlayer);
                let target = statue.home;
                let homeDelta = utils.sub(target, entity.position);
                let homeDistance = utils.distance(homeDelta);
                // Dunno why I did this... There should only ever be one player. Oh well
                let closestPlayerPosition;
                let closestDistance = Number.MAX_VALUE;
                for (let player of playerEntities) {
                    let playerDelta = utils.sub(player.position, entity.position);
                    let playerDistance = utils.distance(playerDelta);
                    if (playerDistance < statue.activationRadius) {
                        if (closestDistance > playerDistance) {
                            closestPlayerPosition = player.position;
                            closestDistance = playerDistance;
                        }
                    }
                }

                let distance = homeDistance;
                if (closestDistance != Number.MAX_VALUE) {
                    target = closestPlayerPosition;
                    distance = closestDistance;
                }
                if (distance > 0.01) {
                    let targetDelta = utils.sub(target, entity.position);
                    targetDelta = utils.div(targetDelta, distance);
                    let targetRotation = Math.atan2(targetDelta.y, targetDelta.x);
                    let r = entity.position.rotation;
                    let dr = utils.absoluteMin([targetRotation - r, (targetRotation + (2 * Math.PI)) - r, (targetRotation - (2 * Math.PI)) - r]);
                    if (time - statue.lastJumped > statue.timeBetweenJumps && Math.abs(dr) < 0.01) {
                        statue.jumpState = {
                            jumpTime: 0,
                            jumping: true,
                            direction: targetDelta,
                            jumpDistance: Math.min(distance, statue.maxJumpDistance)
                        };
                    } else {
                        if (Math.abs(dr) > statue.rotationSpeed) {
                            entity.position.rotation += dr * statue.rotationSpeed / Math.abs(dr);
                        } else {
                            entity.position.rotation += dr * statue.rotationSlowdown;
                        }
                    }
                } else {
                    statue.lastJumped = time;
                }
            }
        }
    });
}
