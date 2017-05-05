System.register(["./ces", "./webglManager", "./playerManager", "./collisionManager", "./parentManager", "./cameraManager", "./triggerManager", "./wallManager", "./holeManager", "./statueManager", "./animationManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ces, webglManager, playerManager, collisionManager, parentManager, cameraManager, triggerManager, wallManager, holeManager, statueManager, animationManager;
    return {
        setters: [
            function (ces_1) {
                ces = ces_1;
            },
            function (webglManager_1) {
                webglManager = webglManager_1;
            },
            function (playerManager_1) {
                playerManager = playerManager_1;
            },
            function (collisionManager_1) {
                collisionManager = collisionManager_1;
            },
            function (parentManager_1) {
                parentManager = parentManager_1;
            },
            function (cameraManager_1) {
                cameraManager = cameraManager_1;
            },
            function (triggerManager_1) {
                triggerManager = triggerManager_1;
            },
            function (wallManager_1) {
                wallManager = wallManager_1;
            },
            function (holeManager_1) {
                holeManager = holeManager_1;
            },
            function (statueManager_1) {
                statueManager = statueManager_1;
            },
            function (animationManager_1) {
                animationManager = animationManager_1;
            }
        ],
        execute: function () {
            webglManager.Setup(["Wall.png", "Player.png"]).then(() => {
                collisionManager.Setup();
                playerManager.Setup();
                parentManager.Setup();
                cameraManager.Setup();
                triggerManager.Setup();
                wallManager.Setup();
                holeManager.Setup();
                statueManager.Setup();
                animationManager.Setup();
                ces.AddEntity({
                    "position": {
                        "x": 0,
                        "y": 0
                    },
                    "camera": {
                        "targetX": 0,
                        "targetY": 0
                    }
                });
                ces.AddEntity({
                    "rendered": {
                        "texture": "Player.png",
                    },
                    "position": {
                        "x": 40,
                        "y": 0,
                        "z": 5,
                        "cx": 0.5,
                        "cy": 0.5
                    },
                    "dimensions": {
                        "width": 5,
                        "height": 5
                    },
                    "fallable": true,
                    "collidable": true,
                    "statue": {
                        "activationRadius": 30,
                        "timeBetweenJumps": 5,
                        "maxJumpDistance": 5,
                        "jumpTimeLength": 1,
                        "jumpScaling": 1.25,
                        "knockBack": 5,
                        "rotationSpeed": Math.PI / 100,
                        "rotationSlowdown": 0.9
                    }
                });
                ces.AddEntity({
                    "rendered": {
                        "texture": "Wall.png",
                    },
                    "position": {
                        "x": 20,
                        "y": 20,
                        "cx": 0.5,
                        "cy": 0.5
                    },
                    "dimensions": {
                        "width": 5,
                        "height": 5
                    },
                    "collidable": true,
                    "trigger": {
                        "action": () => cameraManager.Shake(10)
                    }
                });
                ces.AddEntity({
                    "rendered": {
                        "texture": "Wall.png"
                    },
                    "position": {
                        "x": 40,
                        "y": 20,
                        "z": 0,
                        "cx": 0.5,
                        "cy": 0.5
                    },
                    "dimensions": {
                        "width": 20,
                        "height": 20
                    },
                    "collidable": true,
                    "hole": {
                        "steepness": 0.1
                    }
                });
                ces.AddEntity({
                    "id": "player",
                    "rendered": {
                        "texture": "Player.png",
                    },
                    "position": {
                        "x": 0,
                        "y": 0,
                        "cx": 0.5,
                        "cy": 0.5
                    },
                    "dimensions": {
                        "width": 5,
                        "height": 5
                    },
                    "collidable": true,
                    "collisionShape": {
                        "kind": "circle",
                    },
                    "fallable": true,
                    "player": {
                        "stepSpeed": 0.3,
                        "stepSize": 5
                    }
                });
                ces.AddEntity({
                    "rendered": {
                        "texture": "Wall.png"
                    },
                    "position": {
                        "x": 0,
                        "y": 0,
                        "z": 4,
                        "cx": 0.5,
                        "cy": 0.5
                    },
                    "dimensions": {
                        "width": 1,
                        "height": 1
                    },
                    "parent": "player",
                    "child": {
                        "relativePosition": {
                            "x": -1
                        }
                    },
                    "foot": true
                });
                ces.AddEntity({
                    "rendered": {
                        "texture": "Wall.png"
                    },
                    "position": {
                        "x": 0,
                        "y": 0,
                        "z": 4,
                        "cx": 0.5,
                        "cy": 0.5
                    },
                    "dimensions": {
                        "width": 1,
                        "height": 1
                    },
                    "parent": "player",
                    "child": {
                        "relativePosition": {
                            "x": 1
                        }
                    },
                    "foot": true
                });
                animationManager.Setup();
                animationManager.Update.Subscribe(() => {
                    ces.GetEntities(collisionManager.isCollidable).forEach((entity) => {
                        entity.position.rotation = entity.position.rotation || 0;
                        entity.position.rotation += Math.PI / 20;
                    });
                });
            });
        }
    };
});

//# sourceMappingURL=bootstrap.js.map
