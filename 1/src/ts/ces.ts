import events from "./events.js";

import * as _ from "underscore";

export module CES {
    var currentId = 0;
    export var entities: {[id: number]: any} = {};

    export async function PublishEvent(eventName: string) {
        var success = true;
        var eventResults = await events.Publish("ces." + eventName + ".all");
        if (_.all(eventResults)) {
            for (let id in CES.entities) {
                let entity = CES.entities[id];
                let eventNames = _(entity).keys().map(key => "ces." + eventName + "." + key);
                success = success && _(await events.PublishMultiple(eventNames, entity)).all();
            }
        }
        return success;
    }

    export async function AddEntity(entity: any) {
        var eventNames = _(entity).keys().map(key => "ces.checkEntity." + key);
        if (_(await events.PublishMultiple(eventNames, entity)).all()) {
            entity.id = currentId;
            entities[currentId] = entity;
            currentId++;
            eventNames = _(entity).keys().map(key => "ces.addEntity." + key);
            await events.PublishMultiple(eventNames, entity);
            return true;
        }
        return false;
    }

    export async function RemoveEntity(entity: any) {
        var eventNames = _(entity).keys().map(key => "ces.removeEntity." + key);
        await events.PublishMultiple(eventNames, entity);
        delete CES.entities[entity.id];
    }

    export function GetEntities(component: string) {
        return _(CES.entities).pairs().map(p => p[1]).filter(e => _(e).has(component));
    }
}

export default CES;
