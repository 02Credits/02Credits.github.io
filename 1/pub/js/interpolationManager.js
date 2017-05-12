System.register(["./animationManager", "./ces"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isInterpolated(entity) { return "interpolated" in entity; }
    exports_1("isInterpolated", isInterpolated);
    function mix(x, y, a) {
        return x * (1 - a) + y * a;
    }
    function collapseTarget(target) {
        let returnTarget = {};
        for (let id in target) {
            let value = target[id];
            if (!isNaN(value)) {
                returnTarget[id] = value;
            }
            else if (Array.isArray(value)) {
                let max = Math.max(value[0], value[1]);
                let min = Math.min(value[0], value[1]);
                returnTarget[id] = Math.random() * (max - min) + min;
            }
            else if (typeof value == "object") {
                returnTarget[id] = collapseTarget(value);
            }
            else {
                returnTarget[id] = target[id];
            }
        }
        return returnTarget;
    }
    exports_1("collapseTarget", collapseTarget);
    function initializeState(entity, time) {
        entity.interpolated.state = {
            collapsedStart: collapseTarget(entity.interpolated.start),
            collapsedEnd: collapseTarget(entity.interpolated.end),
            timeStarted: time,
            reverse: false
        };
    }
    function repeat(entity, time) {
        if (entity.interpolated.reversable) {
            entity.interpolated.state.reverse = !entity.interpolated.state.reverse;
            if (entity.interpolated.state.reverse) {
                entity.interpolated.state.collapsedStart = collapseTarget(entity.interpolated.start);
            }
            else {
                entity.interpolated.state.collapsedEnd = collapseTarget(entity.interpolated.end);
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
        animationManager_1.Update.Subscribe((time) => {
            let interpolatedEntities = ces.GetEntities(isInterpolated);
            for (let entity of interpolatedEntities) {
                let interpolated = entity.interpolated;
                let state = entity.interpolated.state;
                if (!state) {
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
    var animationManager_1, ces;
    return {
        setters: [
            function (animationManager_1_1) {
                animationManager_1 = animationManager_1_1;
            },
            function (ces_1) {
                ces = ces_1;
            }
        ],
        execute: function () {
        }
    };
});

//# sourceMappingURL=interpolationManager.js.map
