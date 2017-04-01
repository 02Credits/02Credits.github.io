import events from "./events.js";

export module CES {
    let currentId = 0;
    export let paused = false;
    export let entities: {[id: string]: any} = {};

    export async function PublishEvent(eventName: string) {
        if (!paused) {
            let success = true;
            let eventResults = await events.Publish("ces." + eventName + ".all");
            if (eventResults.every(result => result)) {
                for (let id in CES.entities) {
                    let entity = CES.entities[id];
                    let eventNames = Object.keys(entity).map(key => "ces." + eventName + "." + key)
                    success = success && (await events.PublishMultiple(eventNames, entity)).every(result => result);
                }
            }
            return success;
        }
    }

    export async function AddEntity(entity: any) {
        let eventNames = Object.keys(entity).map(key => "ces.checkEntity." + key);
        let eventResults = await events.PublishMultiple(eventNames, entity);
        if (eventResults.every(result => result)) {
            if ("id" in entity) {
                if (entity.id in entities) {
                    console.log("WARNING: repeat id for " + JSON.stringify(entity));
                    return null;
                } else {
                    entities[entity.id] = entity;
                }
            } else {
                entity.id = currentId;
                entities[currentId] = entity;
                currentId++;
            }
            eventNames = Object.keys(entity).map(key => "ces.addEntity." + key);
            await events.PublishMultiple(eventNames, entity);
            return entity;
        }
        console.log("WARNING: " + JSON.stringify(entity) + " not added.");
        return null;
    }

    export async function RemoveEntity(entity: any) {
        let eventNames = Object.keys(entity).map(key => "ces.removeEntity." + key);
        await events.PublishMultiple(eventNames, entity);
        delete CES.entities[entity.id];
    }

    export function GetEntities(component: string) {
        return Object.keys(CES.entities).map(key => CES.entities[key]).filter(e => component in e);
    }

    export function GetEntity(id: string) {
        return entities[id];
    }
}

export default CES;
