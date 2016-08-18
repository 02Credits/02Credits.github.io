/// <reference path="../typings/index.d.ts"/>

import events from "./events.js";
import _ from "underscore";

export module CES {
    var currentId = 0;
    export var entities: any[] = [];

    export function PublishEvent(eventName: string) {
        var success = true;
        if (events.Publish("ces." + eventName)) {
            _(entities).each((entity) => {
                var newEventNames =
                    _(entity)
                        .keys()
                        .map((key) => "ces." + eventName + "." + key);
                if (!events.PublishMultiple(newEventNames, entity)) {
                    success = false;
                }
            });
        }
        return success;
    }

    export function AddEntity(entity: any) {
        var eventNames = _(entity).keys().map(key => "ces.checkEntity." + key);
        var succeed = events.PublishMultiple(eventNames, entity);
        if (succeed) {
            entity.id = currentId;
            currentId++;
            entities.push(entity);
            eventNames = _(entity).keys().map(key => "ces.addEntity." + key);
            events.PublishMultiple(eventNames, entity);
        }
        return succeed;
    }

    export function RemoveEntity(entity: any) {
        var eventNames = _(entity).keys().map(key => "ces.removeEntity." + key);
        events.PublishMultiple(eventNames, entity);
        entities = _.without(entities, entity);
    }
}

export default CES;
