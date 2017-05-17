System.register(["./eventManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isTracked(entity) { return "id" in entity; }
    function addToLists(entity) {
        for (let condition of sortedEntities.keys()) {
            if (condition(entity)) {
                sortedEntities.get(condition).add(entity);
            }
        }
        entities.set(entity.id, entity);
    }
    function addEntity(entity) {
        let results = CheckEntity.Poll(entity);
        if (results.every(result => result || result === undefined)) {
            let trackedEntity;
            if (isTracked(entity)) {
                if (entity.id in entities) {
                    console.warn("WARNING: repeat id for " + JSON.stringify(entity));
                    return null;
                }
                else {
                    addToLists(entity);
                }
                trackedEntity = entity;
            }
            else {
                trackedEntity = Object.assign({}, entity, { id: currentId.toString() });
                addToLists(trackedEntity);
                currentId++;
            }
            EntityAdded.Publish(trackedEntity);
            return trackedEntity;
        }
        return null;
    }
    exports_1("addEntity", addEntity);
    function removeEntity(entity) {
        EntityRemoved.Publish(entity);
        for (let guard of sortedEntities.keys()) {
            let entitySet = sortedEntities.get(guard);
            if (entitySet.has(entity)) {
                entitySet.delete(entity);
            }
        }
        entities.delete(entity.id);
    }
    exports_1("removeEntity", removeEntity);
    function getEntities(guard) {
        if (sortedEntities.has(guard)) {
            return Array.from(sortedEntities.get(guard).values());
        }
        else {
            let newSet = new Set();
            for (let id of entities.keys()) {
                let entity = entities.get(id);
                if (guard(entity)) {
                    newSet.add(entity);
                }
            }
            sortedEntities.set(guard, newSet);
            return Array.from(newSet.values());
        }
    }
    exports_1("getEntities", getEntities);
    function getEntity(id) {
        return entities.get(id);
    }
    exports_1("getEntity", getEntity);
    var eventManager_1, currentId, entities, sortedEntities, CheckEntity, EntityAdded, EntityRemoved;
    return {
        setters: [
            function (eventManager_1_1) {
                eventManager_1 = eventManager_1_1;
            }
        ],
        execute: function () {
            currentId = 0;
            exports_1("entities", entities = new Map());
            exports_1("sortedEntities", sortedEntities = new Map());
            exports_1("CheckEntity", CheckEntity = new eventManager_1.PollManager1());
            exports_1("EntityAdded", EntityAdded = new eventManager_1.EventManager1());
            exports_1("EntityRemoved", EntityRemoved = new eventManager_1.EventManager1());
        }
    };
});

//# sourceMappingURL=ces.js.map
