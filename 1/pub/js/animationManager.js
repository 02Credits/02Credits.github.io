System.register(["./eventManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function animate() {
        if (Running) {
            exports_1("Time", Time += 0.01667);
            Update.Publish(Time);
        }
        requestAnimationFrame(animate);
    }
    function Setup() {
        requestAnimationFrame(animate);
    }
    exports_1("Setup", Setup);
    var eventManager_1, Time, Running, Update;
    return {
        setters: [
            function (eventManager_1_1) {
                eventManager_1 = eventManager_1_1;
            }
        ],
        execute: function () {
            exports_1("Time", Time = 0);
            exports_1("Running", Running = true);
            exports_1("Update", Update = new eventManager_1.EventManager1());
        }
    };
});

//# sourceMappingURL=animationManager.js.map
