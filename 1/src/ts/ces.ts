import events from "./events.js";

export module CES {
    var currentId = 0;
    export var entities: {[id: string]: any} = {};

    export async function PublishEvent(eventName: string) {
        var success = true;
        var eventResults = await events.Publish("ces." + eventName + ".all");
        if (eventResults.every(result => result)) {
            for (let id in CES.entities) {
                let entity = CES.entities[id];
                let eventNames = Object.keys(entity).map(key => "ces." + eventName + "." + key)
                success = success && (await events.PublishMultiple(eventNames, entity)).every(result => result);
            }
        }
        return success;
    }

    export async function AddEntity(entity: any) {
        var eventNames = Object.keys(entity).map(key => "ces.checkEntity." + key);
        if ((await events.PublishMultiple(eventNames, entity)).every(result => result)) {
            entity.id = currentId;
            entities[currentId] = entity;
            currentId++;
            eventNames = Object.keys(entity).map(key => "ces.addEntity." + key);
            await events.PublishMultiple(eventNames, entity);
            return true;
        }
        console.log(entity + " not added.");
        return false;
    }

    export async function RemoveEntity(entity: any) {
        var eventNames = Object.keys(entity).map(key => "ces.removeEntity." + key);
        await events.PublishMultiple(eventNames, entity);
        delete CES.entities[entity.id];
    }

    export function GetEntities(component: string) {
        return Object.keys(CES.entities).map(key => CES.entities[key]).filter(e => component in e);
    }
}

export default CES;
