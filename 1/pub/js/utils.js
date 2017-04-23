System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Utils;
    return {
        setters: [],
        execute: function () {
            (function (Utils) {
                function defaultValue(getX, defaultValue) {
                    try {
                        let x;
                        if (typeof getX == "function") {
                            x = getX();
                        }
                        else {
                            x = getX;
                        }
                        if (x != null) {
                            return x;
                        }
                        else {
                            return defaultValue;
                        }
                    }
                    catch (e) {
                        return defaultValue;
                    }
                }
                Utils.defaultValue = defaultValue;
                function absoluteMin(xs) {
                    let currentMin = xs[0];
                    for (let i = 1; i < xs.length; i++) {
                        if (Math.abs(currentMin) > Math.abs(xs[i])) {
                            currentMin = xs[i];
                        }
                    }
                    return currentMin;
                }
                Utils.absoluteMin = absoluteMin;
                function standardizeCoords(coords) {
                    if (Array.isArray(coords)) {
                        return { x: coords[0], y: coords[0] };
                    }
                    else {
                        return coords;
                    }
                }
                Utils.standardizeCoords = standardizeCoords;
                function distance(coords) {
                    let standardCoords = standardizeCoords(coords);
                    return Math.sqrt(standardCoords.x * standardCoords.x + standardCoords.y * standardCoords.y);
                }
                Utils.distance = distance;
                function sub(coords1, coords2) {
                    let c1 = standardizeCoords(coords1);
                    let c2 = standardizeCoords(coords2);
                    return { x: c1.x - c2.x, y: c1.y - c2.y };
                }
                Utils.sub = sub;
                function add(coords1, coords2) {
                    let c1 = standardizeCoords(coords1);
                    let c2 = standardizeCoords(coords2);
                    return { x: c1.x + c2.x, y: c1.y + c2.y };
                }
                Utils.add = add;
                function mult(coords, s) {
                    let c = standardizeCoords(coords);
                    return { x: c.x * s, y: c.y * s };
                }
                Utils.mult = mult;
                function div(coords, s) {
                    let c = standardizeCoords(coords);
                    return { x: c.x / s, y: c.y / s };
                }
                Utils.div = div;
            })(Utils || (Utils = {}));
            exports_1("Utils", Utils);
            exports_1("default", Utils);
        }
    };
});

//# sourceMappingURL=utils.js.map
