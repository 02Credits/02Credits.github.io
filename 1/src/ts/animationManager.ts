import {EventManager0, EventManager1} from "./eventManager";
import ces from "./ces";

export let Time = 0;
export let Running = true;
export let Update = new EventManager1<number>();
export let Init = new EventManager0();

function animate() {
  if (Running) {
    Time += 0.01667;
    Update.Publish(Time);
  }
  requestAnimationFrame(animate);
}

export function Setup() {
  Init.Publish();
  requestAnimationFrame(animate);
}
