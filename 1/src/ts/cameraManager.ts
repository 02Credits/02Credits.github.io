import events from "./events";
import ces from "./ces";

let shake = 0;
let shakeFade = 0.95;

export default () => {
    events.Subscribe("camera.shake", (amount: number) => {
        shake = amount;
    });

    events.Subscribe("camera.retarget", (target: {targetX: number, targetY: number}) => {
        var cameraEntity = ces.GetEntities("camera")[0];
        cameraEntity.camera.targetX = target.targetX;
        cameraEntity.camera.targetY = target.targetY;
    })

    events.Subscribe("ces.update.camera", (cameraEntity: any) => {
        var dx = cameraEntity.camera.targetX - cameraEntity.position.x;
        var dy = cameraEntity.camera.targetY - cameraEntity.position.y;

        cameraEntity.position.x += dx * 0.05 + (Math.random() - 0.5) * shake;
        cameraEntity.position.y += dy * 0.05 + (Math.random() - 0.5) * shake;

        shake = shake * shakeFade;
    });
};
