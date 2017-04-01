import events from "./events";
import ces from "./ces"
import {defaultValue} from "./utils";

export default () => {
    events.Subscribe("ces.checkEntity.child", (childEntity: any) => {
        return "parent" in childEntity;
    });

    events.Subscribe("ces.update.child", (childEntity: any) => {
        let parent = ces.GetEntity(childEntity.parent);
        let parentRotation = defaultValue(() => parent.position.rotation, 0);
        let parentScale = defaultValue(() => parent.rendered.scale, 1);
        let parentX = defaultValue(() => parent.position.x, 0);
        let parentY = defaultValue(() => parent.position.y, 0);
        let parentAlpha = defaultValue(() => parent.rendered.alpha, 1);
        childEntity.child.relativePosition = defaultValue(() => childEntity.child.relativePosition, {});
        childEntity.child.relativePosition.x = defaultValue(() => childEntity.child.relativePosition.x, 0);
        childEntity.child.relativePosition.y = defaultValue(() => childEntity.child.relativePosition.y, 0);
        childEntity.position.x =
            (Math.cos(parentRotation) * childEntity.child.relativePosition.x -
            Math.sin(parentRotation) * childEntity.child.relativePosition.y) * parentScale +
            parentX;
        childEntity.position.y =
            (Math.sin(parentRotation) * childEntity.child.relativePosition.x +
            Math.cos(parentRotation) * childEntity.child.relativePosition.y) * parentScale +
            parentY;
        childEntity.child.relativePosition.rotation = defaultValue(childEntity.child.relativePosition.rotation, 0);
        childEntity.position.rotation = childEntity.child.relativePosition.rotation + parentRotation;
        childEntity.child.relativeScale = defaultValue(childEntity.child.relativeScale, 1);
        childEntity.rendered.scale = childEntity.child.relativeScale * parentScale;
        childEntity.child.relativeAlpha = defaultValue(childEntity.child.relativeAlpha, 1);
        childEntity.rendered.alpha = childEntity.child.relativeAlpha * parentAlpha;
    });
}
