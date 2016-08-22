System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var InputManager;
    return {
        setters:[],
        execute: function() {
            (function (InputManager) {
                var keys = [];
                var enabled = false;
                var mouseDown = false;
                var mouseX = 0;
                var mouseY = 0;
                var gameDiv = document.getElementById("game");
                gameDiv.onkeydown = function (e) {
                    keys[e.key] = true;
                };
                gameDiv.onkeyup = function (e) {
                    keys[e.key] = false;
                };
                gameDiv.onmousedown = function () {
                    mouseDown = true;
                };
                gameDiv.onmouseup = function () {
                    mouseDown = false;
                };
                gameDiv.onmousemove = function (e) {
                    mouseX = e.offsetX;
                    mouseY = e.offsetY;
                };
                gameDiv.onmouseenter = function () {
                    gameDiv.focus();
                    enabled = true;
                };
                gameDiv.onmouseleave = function () {
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
                    return {
                        mouseDown: mouseDown,
                        x: mouseX,
                        y: mouseY,
                        enabled: enabled
                    };
                }
                InputManager.MouseState = MouseState;
            })(InputManager = InputManager || (InputManager = {}));
            exports_1("InputManager", InputManager);
            exports_1("default",InputManager);
        }
    }
});
//# sourceMappingURL=inputManager.js.map