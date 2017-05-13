import {CombinedEntity} from "./entity";
import {Update} from "./animationManager";
import * as ces from "./ces";
import {collapseTarget} from "./interpolationManager";

export interface Entity {
  particleGenerator: {
    relativeStart: any;
    relativeEnd: any;
    constant: any;
    length: number;
    frequency: number;
  }
}
export function isGenerator(entity: CombinedEntity): entity is Entity { return "particleGenerator" in entity; }



function makeRelative(entity: any, target: any) {
  for (let id in target) {
    if (id in entity) {
      if (!isNaN(target[id]) || !isNaN(entity[id])) {
        target[id] += entity[id];
      } else if (typeof entity[id] == "object" && typeof target[id] == "object") {
        makeRelative(entity[id], target[id]);
      }
    }
  }
  return target;
}

export function Setup() {
  Update.Subscribe((time) => {
    let generatorEntities = ces.GetEntities(isGenerator);

    for (let entity of generatorEntities) {
      let generator = entity.particleGenerator;
      for (let i = 0; i < 100; i++) {
        if (Math.random() < 0.01666 * generator.frequency / 100) {
          let relativeStart = makeRelative(entity, collapseTarget(generator.relativeStart));
          ces.AddEntity({...collapseTarget(generator.constant), ...relativeStart, "interpolated": {
            start: relativeStart,
            end: makeRelative(entity, collapseTarget(generator.relativeEnd)),
            length: generator.length,
            kill: true
          }});
        }
      }
    }
  })
}

