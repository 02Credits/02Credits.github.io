System.register(["./eventManager"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function loop(time) {
        time = time / 1000;
        if (!Time) {
            exports_1("Time", Time = time);
        }
        if (time - Time > 0.01667) {
            if (Running) {
                let iterations = 0;
                while (time - Time > 0.01667) {
                    if (iterations > 50) {
                        exports_1("Time", Time = time);
                    }
                    Update.Publish(Time);
                    exports_1("Time", Time += 0.01667);
                    iterations++;
                }
                Draw.Publish(Time);
            }
            else {
                exports_1("Time", Time = time);
            }
        }
        requestAnimationFrame(loop);
    }
    function Setup() {
        Init.Publish();
        requestAnimationFrame(loop);
    }
    exports_1("Setup", Setup);
    var eventManager_1, Time, Running, Update, Draw, Init;
    return {
        setters: [
            function (eventManager_1_1) {
                eventManager_1 = eventManager_1_1;
            }
        ],
        execute: function () {
            exports_1("Time", Time = null);
            exports_1("Running", Running = true);
            exports_1("Update", Update = new eventManager_1.EventManager1());
            exports_1("Draw", Draw = new eventManager_1.EventManager1());
            exports_1("Init", Init = new eventManager_1.EventManager0());
        }
    };
});

//# sourceMappingURL=animationManager.js.map
