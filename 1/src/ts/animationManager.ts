import {EventManager0} from "./eventManager";
import ces from "./ces";

export module AnimationManager {
    export let UpdateEvent = new EventManager0();

    export function animate() {
        UpdateEvent.Publish();
        ces.PublishEvent("update");
        requestAnimationFrame(animate);
    }
}

export default AnimationManager;

