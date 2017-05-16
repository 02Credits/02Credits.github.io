System.register(["./animationManager", "./eventManager", "./ces"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isInterpolated(entity) { return "interpolated" in entity; }
    exports_1("isInterpolated", isInterpolated);
    function mix(x, y, a) {
        return x * (1 - a) + y * a;
    }
    function collapseTarget(target, destination) {
        for (let id in target) {
            let value = target[id];
            if (!isNaN(value)) {
                destination[id] = value;
            }
            else if (Array.isArray(value)) {
                let max = Math.max(value[0], value[1]);
                let min = Math.min(value[0], value[1]);
                destination[id] = Math.random() * (max - min) + min;
            }
            else if (typeof value == "object") {
                if (!destination[id]) {
                    destination[id] = {};
                }
                collapseTarget(value, destination[id]);
            }
            else {
                destination[id] = target[id];
            }
        }
    }
    exports_1("collapseTarget", collapseTarget);
    function initializeState(entity, time) {
        let state = entity.interpolated.state;
        collapseTarget(entity.interpolated.start, state.collapsedStart);
        collapseTarget(entity.interpolated.end, state.collapsedEnd);
        state.timeStarted = time;
        state.reverse = false;
        state.initialized = true;
    }
    function repeat(entity, time) {
        if (entity.interpolated.reversable) {
            entity.interpolated.state.reverse = !entity.interpolated.state.reverse;
            if (entity.interpolated.state.reverse) {
                collapseTarget(entity.interpolated.start, entity.interpolated.state.collapsedStart);
            }
            else {
                collapseTarget(entity.interpolated.end, entity.interpolated.state.collapsedEnd);
            }
        }
        else {
            initializeState(entity, time);
        }
        entity.interpolated.state.timeStarted = time;
    }
    function interpolate(start, end, target, amount) {
        for (let id in start) {
            if (id in end) {
                let startValue = start[id];
                let endValue = end[id];
                if (!isNaN(startValue) || !isNaN(endValue)) {
                    if (!isNaN(startValue) && !isNaN(endValue)) {
                        target[id] = mix(startValue, endValue, amount);
                    }
                }
                else {
                    interpolate(startValue, endValue, target[id], amount);
                }
            }
        }
    }
    function interpolateState(entity, time) {
        let start = entity.interpolated.state.collapsedStart;
        let end = entity.interpolated.state.collapsedEnd;
        let amount = (time - entity.interpolated.state.timeStarted) / entity.interpolated.length;
        amount = entity.interpolated.state.reverse ? 1 - amount : amount;
        interpolate(start, end, entity, amount);
    }
    function Setup() {
        ces.CheckEntity.Subscribe((entity) => {
            if (isInterpolated(entity)) {
                entity.interpolated.state = {
                    collapsedStart: {},
                    collapsedEnd: {},
                    timeStarted: NaN,
                    reverse: false,
                    initialized: false
                };
            }
            return true;
        });
        animationManager_1.Update.Subscribe((time) => {
            let interpolatedEntities = ces.GetEntities(isInterpolated);
            for (let entity of interpolatedEntities) {
                let interpolated = entity.interpolated;
                let state = entity.interpolated.state;
                if (!state.initialized) {
                    initializeState(entity, time);
                }
                else {
                    if (time - state.timeStarted > interpolated.length) {
                        if (interpolated.repeating) {
                            repeat(entity, time);
                        }
                        else {
                            if (interpolated.kill) {
                                ces.RemoveEntity(entity);
                            }
                            else {
                                AnimationFinished.Publish(entity);
                            }
                        }
                    }
                    else {
                        interpolateState(entity, time);
                    }
                }
            }
        });
    }
    exports_1("Setup", Setup);
    var animationManager_1, eventManager_1, ces, AnimationFinished;
    return {
        setters: [
            function (animationManager_1_1) {
                animationManager_1 = animationManager_1_1;
            },
            function (eventManager_1_1) {
                eventManager_1 = eventManager_1_1;
            },
            function (ces_1) {
                ces = ces_1;
            }
        ],
        execute: function () {
            exports_1("AnimationFinished", AnimationFinished = new eventManager_1.EventManager1());
        }
    };
});

//# sourceMappingURL=interpolationManager.js.map
