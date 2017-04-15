import {EventManager1} from "./eventManager";
import ces from "./ces";

export let Time = 0;
export let Running = true;
export let Update = new EventManager1<number>();

function animate() {
    if (Running) {
        Time += 0.01667;
        Update.Publish(Time);
    }
    requestAnimationFrame(animate);
}

export function Setup() {
    requestAnimationFrame(animate);
}
