import events from "./events";

export default () => {
    events.Subscribe("ces.update.child", (childEntity: any) => {
        let parent = childEntity.parent;
        childEntity.position.x =
            (Math.cos(parent.Rotation) * childEntity.child.relativePosition.x -
             Math.sin(parent.Rotation) * childEntity.child.relativePosition.y) * parent.rendered.scale +
            parent.position.x;
        childEntity.position.y =
            (Math.sin(parent.Rotation) * childEntity.child.relativePosition.x -
             Math.cos(parent.Rotation) * childEntity.child.relativePosition.y) * parent.rendered.scale +
            parent.position.y;
        childEntity.position.rotation = childEntity.child.relativeRotation + parent.position.rotation;
        childEntity.rendered.scale = parent.rendered.scale * childEntity.child.relativeScale;
    });
}
