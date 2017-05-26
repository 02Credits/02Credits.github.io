import * as ces from "./ces";
import * as utils from "./utils";
import {Update} from "./animationManager";

import {CombinedEntity} from "./entity";

let shake = 0;
let shakeFade = 0.95;

export interface Entity {
  camera: {
    targetX: number,
    targetY: number,
  },
  dimensions: utils.Point,
  position: utils.Point
}
export function isCamera(entity: CombinedEntity): entity is Entity { return "camera" in entity; }

export function Shake(amount: number) {
  shake = amount;
}

export function Retarget(target: {targetX: number, targetY: number}) {
  var cameraEntity = ces.getEntities(isCamera)[0];
  cameraEntity.camera.targetX = target.targetX;
  cameraEntity.camera.targetY = target.targetY;
}

export function setup() {
  Update.Subscribe(() => {
    for (let cameraEntity of ces.getEntities(isCamera)) {
      var dy = cameraEntity.camera.targetY - cameraEntity.position.y;
      var dx = cameraEntity.camera.targetX - cameraEntity.position.x;

      cameraEntity.position.x += dx * 0.05 + (Math.random() - 0.5) * shake;
      cameraEntity.position.y += dy * 0.05 + (Math.random() - 0.5) * shake;

      shake = shake * shakeFade;
    }
  });
}
