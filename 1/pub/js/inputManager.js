System.register(["./ces", "./utils", "./cameraManager", "./webglManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function mouseEventHandler(e) {
        mouseButtons.left = (e.buttons & 1) === 1;
        mouseButtons.right = ((e.buttons >> 1) & 1) === 1;
        mouseButtons.middle = ((e.buttons >> 2) & 1) === 1;
        mouseScreenPos.x = e.offsetX;
        mouseScreenPos.y = e.offsetY;
    }
    function mouseEnterHandler() {
        gameDiv.focus();
        enabled = true;
    }
    function mouseLeaveHandler() {
        enabled = false;
    }
    function keyUpHandler(e) {
        keys[e.key] = false;
    }
    function keyDownHandler(e) {
        keys[e.key] = true;
    }
    function KeyDown(key) {
        if (keys[key]) {
            return true;
        }
        else {
            return false;
        }
    }
    exports_1("KeyDown", KeyDown);
    function MouseState() {
        // NOTE I should probably change this to not do the transform here and instead leave it to the pixi Manager...
        let camera = ces.getEntities(cameraManager_1.isCamera)[0];
        let canvasDimensions = { x: webglManager_1.canvasSize, y: webglManager_1.canvasSize, z: 0 };
        let mousePos;
        if (webglManager_1.canvasSize != 0) {
            mousePos = utils_1.mult(utils_1.mult(utils_1.sub(mouseScreenPos, utils_1.scale(canvasDimensions, 0.5)), utils_1.shrink(camera.dimensions, webglManager_1.canvasSize)), { x: 1, y: -1, z: 0 });
        }
        else {
            mousePos = { x: 0, y: 0, z: 0 };
        }
        return {
            mouseButtons: mouseButtons,
            position: mousePos,
            enabled: enabled
        };
    }
    exports_1("MouseState", MouseState);
    function setup() {
        gameDiv = document.getElementById("game");
        document.addEventListener("mouseup", mouseEventHandler);
        document.addEventListener("mousedown", mouseEventHandler);
        document.addEventListener("mousemove", mouseEventHandler);
        document.addEventListener("keydown", keyDownHandler);
        document.addEventListener("keyup", keyUpHandler);
        document.addEventListener("mouseenter", mouseEnterHandler);
        document.addEventListener("mouseleave", mouseLeaveHandler);
    }
    exports_1("setup", setup);
    var ces, utils_1, cameraManager_1, webglManager_1, keys, mouseButtons, enabled, mouseDown, mouseScreenPos, gameDiv;
    return {
        setters: [
            function (ces_1) {
                ces = ces_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (cameraManager_1_1) {
                cameraManager_1 = cameraManager_1_1;
            },
            function (webglManager_1_1) {
                webglManager_1 = webglManager_1_1;
            }
        ],
        execute: function () {
            keys = {};
            mouseButtons = {};
            enabled = false;
            mouseDown = false;
            mouseScreenPos = { x: 0, y: 0, z: 0 };
        }
    };
});

//# sourceMappingURL=inputManager.js.map
