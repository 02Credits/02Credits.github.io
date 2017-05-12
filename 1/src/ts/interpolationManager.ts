import {CombinedEntity} from "./entity";
import {Update} from "./animationManager";
import * as ces from "./ces";

export interface Entity {
  interpolated: {
    start: any;
    end: any;
    length: number;
    state?: {
      collapsedStart: any;
      collapsedEnd: any;
      timeStarted: number;
      reverse: boolean;
    }
    reversable?: boolean;
    repeating?: boolean;
    kill?: boolean
  }
}
export function isInterpolated(entity: CombinedEntity): entity is Entity { return "interpolated" in entity; }

function mix(x: number, y: number, a: number) {
  return x * (1 - a) + y * a;
}

export function collapseTarget(target: any) {
  let returnTarget: any = {};
  for (let id in target) {
    let value : any = target[id];
    if (!isNaN(value)) {
      returnTarget[id] = value;
    } else if (Array.isArray(value)) {
      let max = Math.max(value[0], value[1]);
      let min = Math.min(value[0], value[1]);
      returnTarget[id] = Math.random() * (max - min) + min;
    } else if (typeof value == "object") {
      returnTarget[id] = collapseTarget(value);
    } else {
      returnTarget[id] = target[id];
    }
  }
  return returnTarget;
}

function initializeState(entity: Entity, time: number) {
  entity.interpolated.state = {
    collapsedStart: collapseTarget(entity.interpolated.start),
    collapsedEnd: collapseTarget(entity.interpolated.end),
    timeStarted: time,
    reverse: false
  };
}

function repeat(entity: Entity, time: number) {
  if (entity.interpolated.reversable) {
    entity.interpolated.state.reverse = !entity.interpolated.state.reverse;
    if (entity.interpolated.state.reverse) {
      entity.interpolated.state.collapsedStart = collapseTarget(entity.interpolated.start);
    } else {
      entity.interpolated.state.collapsedEnd = collapseTarget(entity.interpolated.end);
    }
  } else {
    initializeState(entity, time);
  }
  entity.interpolated.state.timeStarted = time;
}

function interpolate(start: any, end: any, target: any, amount: number) {
  for (let id in start) {
    if (id in end) {
      let startValue = start[id];
      let endValue = end[id];
      if (!isNaN(startValue) || !isNaN(endValue)) {
        if (!isNaN(startValue) && !isNaN(endValue)) {
          target[id] = mix(startValue, endValue, amount);
        }
      } else {
        interpolate(startValue, endValue, target[id], amount);
      }
    }
  }
}

function interpolateState(entity: Entity, time: number) {
  let start = entity.interpolated.state.collapsedStart;
  let end = entity.interpolated.state.collapsedEnd;
  let amount = (time - entity.interpolated.state.timeStarted) / entity.interpolated.length;
  amount = entity.interpolated.state.reverse ? 1 - amount : amount;
  interpolate(start, end, entity, amount);
}

export function Setup() {
  Update.Subscribe((time) => {
    let interpolatedEntities = ces.GetEntities(isInterpolated);

    for (let entity of interpolatedEntities) {
      let interpolated = entity.interpolated;
      let state = entity.interpolated.state;
      if (!state) {
        initializeState(entity, time);
      } else {
        if (time - state.timeStarted > interpolated.length) {
          if (interpolated.repeating) {
            repeat(entity, time);
          } else {
            if (interpolated.kill) {
              ces.RemoveEntity(entity);
            }
          }
        } else {
          interpolateState(entity, time);
        }
      }
    }
  });
}
