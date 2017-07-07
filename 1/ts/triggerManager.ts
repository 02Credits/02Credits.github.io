import {CheckEntity} from "./ces";
import {Collision} from "./collisionManager";
import {isPlayer} from "./playerManager";

import {CombinedEntity} from "./entity";

export interface Entity {
    trigger: {
        action: () => void
        once?: boolean,
        complete?: boolean
    }
}
export function isTrigger(entity: CombinedEntity): entity is Entity { return "trigger" in entity; }

export function setup() {
    Collision.Subscribe((player, collidable, details) => {
        if (isPlayer(player)) {
            if (isTrigger(collidable)) {
                if (collidable.trigger.once) {
                    if (!collidable.trigger.complete) {
                        collidable.trigger.action();
                    }
                } else {
                    collidable.trigger.action();
                }
                collidable.trigger.complete = true;
            }
        }
    });
}
