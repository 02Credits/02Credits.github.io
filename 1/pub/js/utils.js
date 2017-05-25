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
    function isPoint(object) { return "x" in object; }
    function isDimensions(object) { return "width" in object; }
    function toVecArray(vec) {
        if (isPoint(vec)) {
            return [vec.x, vec.y, vec.z || 0];
        }
        else if (isDimensions(vec)) {
            return [vec.width, vec.height];
        }
        else {
            return vec;
        }
    }
    exports_1("toVecArray", toVecArray);
    function toPoint(vec) {
        if (isPoint(vec)) {
            return vec;
        }
        else {
            vec = toVecArray(vec);
            let returnVec = { x: vec[0], y: vec[1] };
            if (vec.length >= 2) {
                returnVec.z = vec[2];
            }
            return returnVec;
        }
    }
    exports_1("toPoint", toPoint);
    function toDimensions(vec) {
        if (isDimensions(vec)) {
            return vec;
        }
        else {
            vec = toVecArray(vec);
            return { width: vec[0], height: vec[1] };
        }
    }
    exports_1("toDimensions", toDimensions);
    function clone(vec) {
        if (isDimensions(vec)) {
            return { width: vec.width, height: vec.height };
        }
        else if (isPoint(vec)) {
            let returnVec = { x: vec.x, y: vec.y };
            if ("z" in vec) {
                returnVec.z = vec.z;
            }
            return returnVec;
        }
        else {
            let vecArray = vec;
            let returnArray = new Array(vecArray.length);
            for (let i = 0; i < returnArray.length; i++) {
                returnArray[i] = vecArray[i];
            }
            return returnArray;
        }
    }
    exports_1("clone", clone);
    function normal(vec) {
        vec = toVecArray(vec);
        return [vec[1], -vec[0]];
    }
    exports_1("normal", normal);
    function sum(vec1, vec2) {
        vec1 = toVecArray(vec1);
        vec2 = toVecArray(vec2);
        let max = clone(vec1.length > vec2.length ? vec1 : vec2);
        let min = vec1 === max ? vec2 : vec1;
        for (let i = 0; i < min.length; i++) {
            max[i] += min[i];
        }
        return max;
    }
    exports_1("sum", sum);
    function sub(vec1, vec2) {
        return sum(vec1, scale(vec2, -1));
    }
    exports_1("sub", sub);
    function mult(vec1, vec2) {
        vec1 = toVecArray(vec1);
        vec2 = toVecArray(vec2);
        let max = clone(vec1.length > vec2.length ? vec1 : vec2);
        let min = vec1 === max ? vec2 : vec1;
        for (let i = 0; i < min.length; i++) {
            max[i] *= min[i];
        }
        return max;
    }
    exports_1("mult", mult);
    function dot(vec1, vec2) {
        vec1 = toVecArray(vec1);
        vec2 = toVecArray(vec2);
        let max = vec1.length > vec2.length ? vec1 : vec2;
        let min = vec1 === max ? vec2 : vec1;
        let sum = 0;
        for (let i = 0; i < min.length; i++) {
            sum += vec1[i] * vec2[i];
        }
        return sum;
    }
    exports_1("dot", dot);
    function scale(vec, scale) {
        vec = clone(toVecArray(vec));
        for (let i = 0; i < vec.length; i++) {
            vec[i] *= scale;
        }
        return vec;
    }
    exports_1("scale", scale);
    function shrink(vec, s) {
        return scale(vec, 1 / s);
    }
    exports_1("shrink", shrink);
    function length(vec) {
        vec = toVecArray(vec);
        let sum = 0;
        for (let el of vec) {
            sum += el * el;
        }
        return Math.sqrt(sum);
    }
    exports_1("length", length);
    function angle(vec) {
        vec = toVecArray(vec);
        return Math.atan2(vec[1], vec[0]);
    }
    exports_1("angle", angle);
    function unit(vec) {
        vec = toVecArray(vec);
        let len = length(vec);
        return shrink(vec, len);
    }
    exports_1("unit", unit);
    function transform(vec, position, rotation = 0, s = 1) {
        vec = toVecArray(vec);
        position = clone(toVecArray(position));
        let rel = scale(sub(vec, position), s);
        position[0] += rel[0] * Math.cos(rotation) - rel[1] * Math.sin(rotation);
        position[1] += rel[0] * Math.sin(rotation) + rel[1] * Math.cos(rotation);
        return position;
    }
    exports_1("transform", transform);
    function polyFromCircle(x, y, r, points = 20) {
        let retList = [];
        for (let i = 0; i < points; i++) {
            let theta = i * 2 * Math.PI / points;
            retList.push([x + r * Math.cos(theta), y + r * Math.sin(theta)]);
        }
        return retList;
    }
    exports_1("polyFromCircle", polyFromCircle);
    function polyFromRect(x, y, width, height, pointMode = "topLeft") {
        switch (pointMode) {
            case "topLeft":
                return [
                    [x, y],
                    [x + width, y],
                    [x + width, y + height],
                    [x, y + height]
                ];
            case "center":
                let halfW = width / 2;
                let halfH = height / 2;
                return [
                    [x - halfW, y - halfH],
                    [x + halfW, y - halfH],
                    [x + halfW, y + halfH],
                    [x - halfW, y + halfH]
                ];
            case "twoPoint":
                return [
                    [x, y],
                    [width, y],
                    [width, height],
                    [x, height]
                ];
        }
    }
    exports_1("polyFromRect", polyFromRect);
    function transformPoly(poly, position, rotation = 0, scale = 1) {
        let retPoly = [];
        for (let point of poly) {
            retPoly.push(transform(point, position, rotation, scale));
        }
        return retPoly;
    }
    exports_1("transformPoly", transformPoly);
    function castOnSegment(rp, rd, s1, s2) {
        rp = toVecArray(rp);
        rd = toVecArray(rd);
        s1 = toVecArray(s1);
        s2 = toVecArray(s2);
        let sp = s1;
        let sd = sub(s2, s1);
        let sLen = length(sd);
        let st = (rd[0] * (sp[1] - rp[1]) + rd[1] * (rp[0] - sp[0])) / (rd[1] * sd[0] - rd[0] * sd[1]);
        let rt = (sp[0] + sd[0] * st - rp[0]) / rd[0];
        if (st < sLen && rt > 0) {
            return sum(rp, scale(rd, rt));
        }
    }
    exports_1("castOnSegment", castOnSegment);
    function castOnPolygon(rp, rd, poly) {
        let closest;
        let closestDist;
        let pPrevious = poly[poly.length - 1];
        for (let p of poly) {
            let i = castOnSegment(rp, rd, pPrevious, p);
            let newDist = length(sub(i, rp));
            if (!closestDist || newDist < closestDist) {
                closest = i;
                closestDist = newDist;
            }
            pPrevious = p;
        }
        return closest;
    }
    exports_1("castOnPolygon", castOnPolygon);
    var distance;
    return {
        setters: [],
        execute: function () {
            exports_1("distance", distance = length);
        }
    };
});

//# sourceMappingURL=utils.js.map
