import {PollManager1, EventManager1} from "./eventManager";
import {CombinedEntity} from "./entity";

let currentId = 0;
let entities: {[id: string]: TrackedEntity} = {};

export type TrackedEntity = { id: string } & CombinedEntity;
function isTracked(entity: CombinedEntity | TrackedEntity): entity is TrackedEntity { return "id" in entity; }

export let CheckEntity = new PollManager1<CombinedEntity, boolean>();
export let EntityAdded = new EventManager1<TrackedEntity>();
export let EntityRemoved = new EventManager1<TrackedEntity>();

export async function AddEntity(entity: CombinedEntity | TrackedEntity) {
    let results = await CheckEntity.Poll(entity);
    if (results.every(result => result || result === undefined)) {
        let trackedEntity: TrackedEntity;
        if (isTracked(entity)) {
            if (entity.id in entities) {
                console.log("WARNING: repeat id for " + JSON.stringify(entity));
                return null;
            } else {
                entities[entity.id] = entity;
            }
            trackedEntity = entity;
        } else {
            trackedEntity = {...entity, id: currentId.toString()};
            entities[currentId] = trackedEntity;
            currentId++;
        }
        await EntityAdded.Publish(trackedEntity);
        return entity;
    }
    return null;
}

export async function RemoveEntity(entity: any) {
    EntityRemoved.Publish(entity);
    delete entities[entity.id];
}

export function GetEntities(component: string) {
    return Object.keys(entities).map(key => entities[key]).filter(e => component in e);
}

export function GetEntity(id: string) {
    return entities[id];
}
