System.register(["./ces", "./cameraManager", "./webglManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ces, cameraManager_1, webglManager_1, InputManager;
    return {
        setters: [
            function (ces_1) {
                ces = ces_1;
            },
            function (cameraManager_1_1) {
                cameraManager_1 = cameraManager_1_1;
            },
            function (webglManager_1_1) {
                webglManager_1 = webglManager_1_1;
            }
        ],
        execute: function () {
            (function (InputManager) {
                let keys = {};
                let mouseButtons = {};
                let enabled = false;
                let mouseDown = false;
                let mouseX = 0;
                let mouseY = 0;
                let gameDiv = document.getElementById("game");
                gameDiv.onkeydown = (e) => {
                    keys[e.key] = true;
                };
                gameDiv.onkeyup = (e) => {
                    keys[e.key] = false;
                };
                gameDiv.onmousedown = gameDiv.onmouseup = gameDiv.onmousemove = (e) => {
                    mouseButtons.left = (e.buttons & 1) === 1;
                    mouseButtons.right = ((e.buttons >> 1) & 1) === 1;
                    mouseButtons.middle = ((e.buttons >> 2) & 1) === 1;
                    mouseX = e.offsetX;
                    mouseY = e.offsetY;
                };
                gameDiv.onmouseenter = () => {
                    gameDiv.focus();
                    enabled = true;
                };
                gameDiv.onmouseleave = () => {
                    enabled = false;
                };
                function KeyDown(key) {
                    if (keys[key]) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                InputManager.KeyDown = KeyDown;
                function MouseState() {
                    // NOTE I should probably change this to not do the transform here and instead leave it to the pixi Manager...
                    let camera = ces.GetEntities(cameraManager_1.isCamera)[0];
                    return {
                        mouseButtons: mouseButtons,
                        x: (mouseX - webglManager_1.canvasSize / 2) * camera.dimensions.width / webglManager_1.canvasSize,
                        y: -(mouseY - webglManager_1.canvasSize / 2) * camera.dimensions.height / webglManager_1.canvasSize,
                        enabled: enabled
                    };
                }
                InputManager.MouseState = MouseState;
            })(InputManager || (InputManager = {}));
            exports_1("InputManager", InputManager);
            exports_1("default", InputManager);
        }
    };
});

//# sourceMappingURL=inputManager.js.map
