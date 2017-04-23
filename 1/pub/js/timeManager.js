System.register(["./events"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var events_1, Time;
    return {
        setters: [
            function (events_1_1) {
                events_1 = events_1_1;
            }
        ],
        execute: function () {
            (function (Time) {
                Time.time = 0;
                events_1.default.Subscribe("update", () => {
                    Time.time += 0.01667;
                });
            })(Time || (Time = {}));
            exports_1("Time", Time);
            exports_1("default", Time);
        }
    };
});

//# sourceMappingURL=timeManager.js.map
