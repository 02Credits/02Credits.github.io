System.register(["./ces", "./animationManager", "./eventManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isCollidable(entity) { return "collidable" in entity; }
    exports_1("isCollidable", isCollidable);
    // Algorithm modified from http://wiki.roblox.com/index.php?title=2D_Collision_Detection
    function getNormal(vec) {
        return [vec[1], -vec[0]];
    }
    function subVec(vec1, vec2) {
        let retVec = [];
        for (let i = 0; i < vec1.length; i++) {
            retVec[i] = vec1[i] - vec2[i];
        }
        return retVec;
    }
    function dotVec(vec1, vec2) {
        let retVal = 0;
        for (let i = 0; i < vec1.length; i++) {
            retVal += vec1[i] * vec2[i];
        }
        return retVal;
    }
    function vecLength(vec) {
        return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    }
    function unitVec(vec) {
        let length = vecLength(vec);
        return [
            vec[0] / length,
            vec[1] / length
        ];
    }
    function rotateAndTranslate(entity, relativePoint) {
        let center = [entity.position.x, entity.position.y];
        let rotation = 0;
        let scale = ((entity || obj).renderer || obj).scale || 1;
        if ("rotation" in entity.position) {
            rotation = entity.position.rotation;
        }
        let newX = center[0] + (relativePoint[0] * scale - center[0]) * Math.cos(rotation) - (relativePoint[1] * scale - center[1]) * Math.sin(rotation);
        let newY = center[1] + (relativePoint[0] * scale - center[0]) * Math.sin(rotation) + (relativePoint[1] * scale - center[1]) * Math.cos(rotation);
        relativePoint[0] = newX;
        relativePoint[1] = newY;
    }
    function getCorners(entity) {
        if (entity.collisionShape == null || entity.collisionShape.kind === "rectangle") {
            let scale = ((entity || obj).renderer || obj).scale || 1;
            let left = entity.position.x + entity.dimensions.width * entity.position.cx * scale;
            let right = entity.position.x - entity.dimensions.width * (1 - entity.position.cx) * scale;
            let bottom = entity.position.y + entity.dimensions.height * entity.position.cy * scale;
            let top = entity.position.y - entity.dimensions.height * (1 - entity.position.cy) * scale;
            let corners = [
                [left, top],
                [right, top],
                [right, bottom],
                [left, bottom]
            ];
            for (let corner of corners) {
                rotateAndTranslate(entity, corner);
            }
            return corners;
        }
        else if (entity.collisionShape.kind === "polygon") {
            let corners = entity.collisionShape.points;
            for (let corner of corners) {
                rotateAndTranslate(entity, corner);
            }
        }
        else {
            return [];
        }
    }
    function getAxis(entity) {
        if (entity.collisionShape == null || entity.collisionShape.kind != "circle") {
            let corners = getCorners(entity);
            return [
                getNormal(unitVec(subVec(corners[0], corners[1]))),
                getNormal(unitVec(subVec(corners[0], corners[3])))
            ];
        }
        else {
            return [];
        }
    }
    function projectedBounds(entity, axis) {
        if (entity.collisionShape != null && entity.collisionShape.kind === "circle") {
            let scale = ((entity || obj).renderer || obj).scale || 1;
            let center = dotVec([entity.position.x, entity.position.y], axis);
            let radius = Math.max(entity.dimensions.width * scale, entity.dimensions.height * scale) / 2;
            return { max: center + radius, min: center - radius };
        }
        else {
            let corners = getCorners(entity);
            let min = dotVec(corners[0], axis);
            let max = min;
            for (let i = 1; i < corners.length; i++) {
                let corner = corners[i];
                let projectedCorner = dotVec(corner, axis);
                if (projectedCorner > max)
                    max = projectedCorner;
                if (projectedCorner < min)
                    min = projectedCorner;
            }
            return { min: min, max: max };
        }
    }
    function calculateOverlap(e1, e2, axis) {
        let b1 = projectedBounds(e1, axis);
        let b2 = projectedBounds(e2, axis);
        if (b2.min > b1.max || b2.max < b1.min) {
            return null;
        }
        return b1.max > b2.max ? -(b2.max - b1.min) : (b1.max - b2.min);
    }
    function getOverlap(e1, e2) {
        let c1 = getCorners(e1);
        let c2 = getCorners(e2);
        let result = null;
        let normal = [];
        for (let axis of getAxis(e1).concat(getAxis(e2))) {
            let overlap = calculateOverlap(e1, e2, axis);
            if (overlap == null)
                return null;
            if (result == null || Math.abs(overlap) < result.depth) {
                if (overlap < 0) {
                    result = {
                        depth: -overlap,
                        normal: [
                            -axis[0],
                            -axis[1]
                        ]
                    };
                }
                else {
                    result = {
                        depth: overlap,
                        normal: axis
                    };
                }
            }
        }
        return result;
    }
    function Setup() {
        animationManager_1.Update.Subscribe(() => {
            let collidables = ces.GetEntities(isCollidable);
            for (let collider of collidables) {
                for (let collidable of collidables) {
                    if (collidable !== collider) {
                        let result = getOverlap(collider, collidable);
                        if (result !== null) {
                            Collision.Publish(collider, collidable, result);
                        }
                    }
                }
            }
        });
    }
    exports_1("Setup", Setup);
    var ces, animationManager_1, eventManager_1, obj, Collision;
    return {
        setters: [
            function (ces_1) {
                ces = ces_1;
            },
            function (animationManager_1_1) {
                animationManager_1 = animationManager_1_1;
            },
            function (eventManager_1_1) {
                eventManager_1 = eventManager_1_1;
            }
        ],
        execute: function () {
            obj = {};
            exports_1("Collision", Collision = new eventManager_1.EventManager3());
        }
    };
});

//# sourceMappingURL=collisionManager.js.map
