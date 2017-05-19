System.register(["./ces", "./webglManager", "./playerManager", "./collisionManager", "./cameraManager", "./triggerManager", "./wallManager", "./holeManager", "./statueManager", "./animationManager", "./interpolationManager", "./particleManager", "./inputManager", "./parentManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ces, webglManager, playerManager, collisionManager, cameraManager, triggerManager, wallManager, holeManager, statueManager, animationManager, interpolationManager, particleManager, inputManager, parentManager;
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
            },
            function (parentManager_1) {
                parentManager = parentManager_1;
            }
        ],
        execute: function () {
            webglManager.Setup(["Wall.png", "Player.png"]).then(async () => {
                await collisionManager.setup();
                await playerManager.setup();
                await cameraManager.setup();
                await triggerManager.setup();
                await wallManager.setup();
                await holeManager.setup();
                await statueManager.setup();
                await interpolationManager.setup();
                await particleManager.setup();
                await inputManager.setup();
                await parentManager.setup();
                ces.addEntity({
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
                ces.addEntity({
                    "id": "player",
                    "texture": "Player.png",
                    "position": {
                        "x": 0,
                        "y": 0,
                        "z": 5
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
                ces.addEntity({
                    "texture": "Wall.png",
                    "position": {
                        "x": 0,
                        "y": 0,
                        "z": 4
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
                ces.addEntity({
                    "texture": "Wall.png",
                    "position": {
                        "x": 0,
                        "y": 0,
                        "z": 4
                    },
                    "center": {
                        "x": 0.5,
                        "y": 0.5
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
