System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function absoluteMin(xs) {
        let currentMin = xs[0];
        for (let i = 1; i < xs.length; i++) {
            if (Math.abs(currentMin) > Math.abs(xs[i])) {
                currentMin = xs[i];
            }
        }
        return currentMin;
    }
    exports_1("absoluteMin", absoluteMin);
    function spliceArray(dest, offset, data) {
        for (let i = 0; i < data.length; i++) {
            dest[offset + i] = data[i];
        }
    }
    exports_1("spliceArray", spliceArray);
    function standardizeCoords(coords) {
        if (Array.isArray(coords)) {
            return { x: coords[0], y: coords[0] };
        }
        else {
            return coords;
        }
    }
    exports_1("standardizeCoords", standardizeCoords);
    function distance(coords) {
        let standardCoords = standardizeCoords(coords);
        return Math.sqrt(standardCoords.x * standardCoords.x + standardCoords.y * standardCoords.y);
    }
    exports_1("distance", distance);
    function sub(coords1, coords2) {
        let c1 = standardizeCoords(coords1);
        let c2 = standardizeCoords(coords2);
        return { x: c1.x - c2.x, y: c1.y - c2.y };
    }
    exports_1("sub", sub);
    function add(coords1, coords2) {
        let c1 = standardizeCoords(coords1);
        let c2 = standardizeCoords(coords2);
        return { x: c1.x + c2.x, y: c1.y + c2.y };
    }
    exports_1("add", add);
    function mult(coords, s) {
        let c = standardizeCoords(coords);
        return { x: c.x * s, y: c.y * s };
    }
    exports_1("mult", mult);
    function div(coords, s) {
        let c = standardizeCoords(coords);
        return { x: c.x / s, y: c.y / s };
    }
    exports_1("div", div);
    return {
        setters: [],
        execute: function () {
        }
    };
});

//# sourceMappingURL=utils.js.map
