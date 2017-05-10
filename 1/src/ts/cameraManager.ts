import * as ces from "./ces";
import {Update} from "./animationManager";

import {Position} from "./pixiManager";
import {CombinedEntity} from "./entity";

let shake = 0;
let shakeFade = 0.95;

export interface Entity {
  camera: {
    targetX: number,
    targetY: number,
  },
  dimensions: {
    width: number,
    height: number
  }
  position: Position
}
export function isCamera(entity: CombinedEntity): entity is Entity { return "camera" in entity; }

export function Shake(amount: number) {
  shake = amount;
}

export function Retarget(target: {targetX: number, targetY: number}) {
  var cameraEntity = ces.GetEntities(isCamera)[0];
  cameraEntity.camera.targetX = target.targetX;
  cameraEntity.camera.targetY = target.targetY;
}

export function Setup() {
  Update.Subscribe(() => {
    for (let cameraEntity of ces.GetEntities(isCamera)) {
      var dy = cameraEntity.camera.targetY - cameraEntity.position.y;
      var dx = cameraEntity.camera.targetX - cameraEntity.position.x;

      cameraEntity.position.x += dx * 0.05 + (Math.random() - 0.5) * shake;
      cameraEntity.position.y += dy * 0.05 + (Math.random() - 0.5) * shake;

      shake = shake * shakeFade;
    }
  });
}
