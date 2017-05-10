import * as ces from "./ces"
import {Update} from "./animationManager";
import {Position, Entity as RenderableEntity, isRenderable} from "./webglManager";
import utils from "./utils";
import {CombinedEntity} from "./entity";

export interface Entity extends RenderableEntity {
  child: {
    relativePosition?: Position,
    relativeRotation?: number,
    relativeScale?: number,
    relativeAlpha?: number
  },
  parent: string
}
export function isChild(entity: CombinedEntity): entity is Entity { return "child" in entity; }

export function Setup() {
  Update.Subscribe(() => {
    for (let childEntity of ces.GetEntities(isChild)) {
      let parent = ces.GetEntity(childEntity.parent);
      if (isRenderable(parent)) {
        let parentRotation = parent.rotation || 0;
        let parentScale = parent.scale || 1;
        let parentX = parent.position.x || 0;
        let parentY = parent.position.y || 0;
        // let parentAlpha = parent.rendered.alpha || 1;
        childEntity.child.relativePosition = childEntity.child.relativePosition || {y: 0, x: 0};
        childEntity.position.x =
          (Math.cos(parentRotation) * childEntity.child.relativePosition.x -
           Math.sin(parentRotation) * childEntity.child.relativePosition.y) * parentScale +
          parentX;
        childEntity.position.y =
          (Math.sin(parentRotation) * childEntity.child.relativePosition.x +
           Math.cos(parentRotation) * childEntity.child.relativePosition.y) * parentScale +
          parentY;
        childEntity.child.relativeRotation = childEntity.child.relativeRotation || 0;
        childEntity.rotation = childEntity.child.relativeRotation + parentRotation;
        childEntity.child.relativeScale = childEntity.child.relativeScale || 1;
        childEntity.scale = childEntity.child.relativeScale * parentScale;
        // childEntity.child.relativeAlpha = childEntity.child.relativeAlpha || 1;
        // childEntity.rendered.alpha = childEntity.child.relativeAlpha * parentAlpha;
      }
    }
  });
}
