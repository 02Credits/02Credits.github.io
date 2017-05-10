System.register(["./eventManager"], function (exports_1, context_1) {
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __moduleName = context_1 && context_1.id;
    function isTracked(entity) { return "id" in entity; }
    function AddEntity(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield CheckEntity.Poll(entity);
            if (results.every(result => result || result === undefined)) {
                let trackedEntity;
                if (isTracked(entity)) {
                    if (entity.id in entities) {
                        console.log("WARNING: repeat id for " + JSON.stringify(entity));
                        return null;
                    }
                    else {
                        entities[entity.id] = entity;
                    }
                    trackedEntity = entity;
                }
                else {
                    trackedEntity = Object.assign({}, entity, { id: currentId.toString() });
                    entities[currentId] = trackedEntity;
                    currentId++;
                }
                yield EntityAdded.Publish(trackedEntity);
                return entity;
            }
            return null;
        });
    }
    exports_1("AddEntity", AddEntity);
    function RemoveEntity(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            EntityRemoved.Publish(entity);
            delete entities[entity.id];
        });
    }
    exports_1("RemoveEntity", RemoveEntity);
    function GetEntities(guard) {
        let returnArray = [];
        for (let id of Object.keys(entities)) {
            let entity = entities[id];
            if (guard(entity)) {
                returnArray.push(entity);
            }
        }
        return returnArray;
    }
    exports_1("GetEntities", GetEntities);
    function GetEntitiesWith(component) {
        return Object.keys(entities).map(key => entities[key]).filter(e => component in e);
    }
    exports_1("GetEntitiesWith", GetEntitiesWith);
    function GetEntity(id) {
        return entities[id];
    }
    exports_1("GetEntity", GetEntity);
    var eventManager_1, currentId, entities, CheckEntity, EntityAdded, EntityRemoved;
    return {
        setters: [
            function (eventManager_1_1) {
                eventManager_1 = eventManager_1_1;
            }
        ],
        execute: function () {
            currentId = 0;
            entities = {};
            exports_1("CheckEntity", CheckEntity = new eventManager_1.PollManager1());
            exports_1("EntityAdded", EntityAdded = new eventManager_1.EventManager1());
            exports_1("EntityRemoved", EntityRemoved = new eventManager_1.EventManager1());
        }
    };
});

//# sourceMappingURL=ces.js.map