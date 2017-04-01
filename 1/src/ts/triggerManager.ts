import events from "./events";

export default () => {
    events.Subscribe("ces.checkEntity.trigger", (entity: any) => {
        return "action" in entity.trigger;
    });

    events.Subscribe("collision", (event: any) => {
        var player = event.collider;
        var collidable = event.collidable;
        var details = event.details;
        if ("player" in player) {
            if ("trigger" in collidable) {
                if (collidable.trigger.once) {
                    if (!collidable.trigger.complete) {
                        new Function('events', 'player', collidable.trigger.action)(events, player);
                    }
                } else {
                    new Function('events', 'player', collidable.trigger.action)(events, player);
                }
                collidable.trigger.complete = true;
            }
        }
    });
};
