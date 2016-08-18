import _ from "underscore";
import events from "./events.js";

export default () => {
    events.Subscribe("ces.checkEntity.player", (entity) => {
        return _.has(entity, "position");
    });
}
