System.register(["pixi.js", "./ces", "./animationManager", "./pixiManager", "./eventManager", "./geometryUtils"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isCollidable(entity) { return "collidable" in entity; }
    exports_1("isCollidable", isCollidable);
    // Algorithm modified from http://wiki.roblox.com/index.php?title=2D_Collision_Detection
    function getCorners(entity) {
        let scale = (entity.renderer || obj).scale || 1;
        let rotation = entity.position.rotation || 0;
        let position = [entity.position.x, entity.position.y];
        let corners = [];
        if (entity.collisionShape == null || entity.collisionShape.kind === "rectangle") {
            let left = entity.position.x + entity.dimensions.width * entity.position.cx;
            let right = entity.position.x - entity.dimensions.width * (1 - entity.position.cx);
            let bottom = entity.position.y + entity.dimensions.height * entity.position.cy;
            let top = entity.position.y - entity.dimensions.height * (1 - entity.position.cy);
            corners.push([
                [left, top],
                [right, top],
                [right, bottom],
                [left, bottom]
            ]);
        }
        else if (entity.collisionShape.kind === "polygon") {
            corners = [entity.collisionShape.points];
        }
        else if (entity.collisionShape.kind === "compound polygon") {
            for (let child of entity.collisionShape.children) {
                corners.push(child);
            }
        }
        let retList = [];
        for (let cornersList of corners) {
            retList.push(geometryUtils.transformPoly(cornersList, position, rotation, scale));
        }
        return retList;
    }
    exports_1("getCorners", getCorners);
    function getAxis(entity) {
        if (entity.collisionShape == null || entity.collisionShape.kind != "circle") {
            let axis = [];
            let childCorners = getCorners(entity);
            for (let child of childCorners) {
                let previous = child[child.length - 1];
                for (let corner of child) {
                    axis.push(geometryUtils.normal(geometryUtils.unit(geometryUtils.sub(corner, previous))));
                    previous = corner;
                }
            }
            return axis;
        }
        else {
            return [];
        }
    }
    function projectedBounds(entity, axis) {
        if (entity.collisionShape != null && entity.collisionShape.kind === "circle") {
            let scale = ((entity || obj).renderer || obj).scale || 1;
            let center = geometryUtils.dot([entity.position.x, entity.position.y], axis);
            let radius = Math.max(entity.dimensions.width * scale, entity.dimensions.height * scale) / 2;
            return { max: center + radius, min: center - radius };
        }
        else {
            let corners = getCorners(entity);
            let min = geometryUtils.dot(corners[0][0], axis);
            let max = min;
            for (let child of corners) {
                for (let corner of child) {
                    let projectedCorner = geometryUtils.dot(corner, axis);
                    if (projectedCorner > max)
                        max = projectedCorner;
                    if (projectedCorner < min)
                        min = projectedCorner;
                }
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
        let physicsOverlay = new pixi.Graphics();
        pixiManager_1.overlay.addChild(physicsOverlay);
        animationManager_1.Update.Subscribe(() => {
            let collidables = ces.GetEntities(isCollidable);
            physicsOverlay.clear();
            for (let collider of collidables) {
                if (!collider.collisionShape || collider.collisionShape.kind === "rectangle") {
                }
            }
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
    var pixi, ces, animationManager_1, pixiManager_1, eventManager_1, geometryUtils, obj, Collision;
    return {
        setters: [
            function (pixi_1) {
                pixi = pixi_1;
            },
            function (ces_1) {
                ces = ces_1;
            },
            function (animationManager_1_1) {
                animationManager_1 = animationManager_1_1;
            },
            function (pixiManager_1_1) {
                pixiManager_1 = pixiManager_1_1;
            },
            function (eventManager_1_1) {
                eventManager_1 = eventManager_1_1;
            },
            function (geometryUtils_1) {
                geometryUtils = geometryUtils_1;
            }
        ],
        execute: function () {
            obj = {};
            exports_1("Collision", Collision = new eventManager_1.EventManager3());
        }
    };
});

//# sourceMappingURL=collisionManager.js.map
