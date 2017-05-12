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
  for (let id of target) {
    if (id in entity) {
      if (!isNaN(target[id]) || !isNaN(entity[id])) {
        target[id] += entity[id];
      } else if (!Array.isArray(entity[id]) && !Array.isArray(target[id])) {
        makeRelative(entity[id], target[id]);
      }
    }
  }
}

export function Setup() {
  Update.Subscribe((time) => {
    let generatorEntities = ces.GetEntities(isGenerator);

    for (let entity of generatorEntities) {
      let generator = entity.particleGenerator;
      if (Math.random() * 0.01666 < 1 / generator.frequency) {
        ces.AddEntity({...collapseTarget(generator.constant), "interpolated": {
          start: makeRelative(entity, collapseTarget(generator.relativeStart)),
          end: makeRelative(entity, collapseTarget(generator.relativeEnd)),
          length: generator.length,
          kill: true
        }});
      }
    }
  })
}

