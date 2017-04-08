import events from "./events";

export module Time {
    export let time = 0;

    events.Subscribe("update", () => {
        time += 0.01667;
    });
}

export default Time;

