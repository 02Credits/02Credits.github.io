import events from "./events";
import ces from "./ces";
function animate() {
    events.Publish("update");
    ces.PublishEvent("update");
    requestAnimationFrame(animate);
}

export default () => {
    animate();
}

