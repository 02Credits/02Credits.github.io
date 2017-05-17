System.register(["./ces", "./webglManager", "./playerManager", "./collisionManager", "./parentManager", "./cameraManager", "./triggerManager", "./wallManager", "./holeManager", "./statueManager", "./animationManager", "./interpolationManager", "./particleManager", "./inputManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ces, webglManager, playerManager, collisionManager, parentManager, cameraManager, triggerManager, wallManager, holeManager, statueManager, animationManager, interpolationManager, particleManager, inputManager;
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
            },
            function (interpolationManager_1) {
                interpolationManager = interpolationManager_1;
            },
            function (particleManager_1) {
                particleManager = particleManager_1;
            },
            function (inputManager_1) {
                inputManager = inputManager_1;
            }
        ],
        execute: function () {
            webglManager.Setup(["Wall.png", "Player.png"]).then(async () => {
                await collisionManager.Setup();
                await playerManager.Setup();
                await parentManager.Setup();
                await cameraManager.Setup();
                await triggerManager.Setup();
                await wallManager.Setup();
                await holeManager.Setup();
                await statueManager.Setup();
                await animationManager.Setup();
                await interpolationManager.Setup();
                await particleManager.Setup();
                await inputManager.Setup();
                await ces.AddEntity({
                    "position": {
                        "x": 0,
                        "y": 0
                    },
                    "dimensions": {
                        "width": 100,
                        "height": 100
                    },
                    "camera": {
                        "targetX": 0,
                        "targetY": 0
                    }
                });
                await ces.AddEntity({
                    "texture": "Player.png",
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
                    "scale": 2,
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
                await ces.AddEntity({
                    "id": "player",
                    "texture": "Player.png",
                    "position": {
                        "x": 0,
                        "y": 0,
                        "z": 5,
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
                    },
                    "particleGenerator": {
                        "relativeStart": {
                            "dimensions": {
                                "width": 0,
                                "height": 0
                            },
                            "position": {
                                "x": 0,
                                "y": 0
                            }
                        },
                        "relativeEnd": {
                            "dimensions": {
                                "width": -5,
                                "height": -5
                            },
                            "position": {
                                "x": [-50, 50],
                                "y": [-50, 50]
                            }
                        },
                        "constant": {
                            "texture": "Player.png",
                            "position": {
                                "cx": 0.5,
                                "cy": 0.5
                            },
                            "rotation": 0
                        },
                        "length": 1,
                        "frequency": 100
                    }
                });
                await ces.AddEntity({
                    "texture": "Wall.png",
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
                await ces.AddEntity({
                    "texture": "Wall.png",
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
            });
        }
    };
});

//# sourceMappingURL=bootstrap.js.map
