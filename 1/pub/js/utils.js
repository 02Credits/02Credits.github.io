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
    function clone(p) {
        return { x: p.x, y: p.y, z: p.z };
    }
    exports_1("clone", clone);
    function xyNormal(p) {
        return { x: p.y, y: -p.x, z: p.z };
    }
    exports_1("xyNormal", xyNormal);
    function sum(p1, p2) {
        return { x: p1.x + p2.x, y: p1.y + p2.y, z: p1.z + p2.z };
    }
    exports_1("sum", sum);
    function sub(p1, p2) {
        return sum(p1, scale(p2, -1));
    }
    exports_1("sub", sub);
    function mult(p1, p2) {
        return { x: p1.x * p2.x, y: p1.y * p2.y, z: p1.z * p2.z };
    }
    exports_1("mult", mult);
    function div(p1, p2) {
        return { x: p1.x / p2.x, y: p1.y / p2.y, z: p1.z / p2.z };
    }
    exports_1("div", div);
    function dot(p1, p2) {
        return p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;
    }
    exports_1("dot", dot);
    function scale(p, s) {
        return { x: p.x * s, y: p.y * s, z: p.z * s };
    }
    exports_1("scale", scale);
    function shrink(p, s) {
        return scale(p, 1 / s);
    }
    exports_1("shrink", shrink);
    function length(p) {
        return Math.sqrt(dot(p, p));
    }
    exports_1("length", length);
    function xyAngle(p) {
        return Math.atan2(p.y, p.x);
    }
    exports_1("xyAngle", xyAngle);
    function flatten(p) {
        return { x: p.x, y: p.y, z: 0 };
    }
    exports_1("flatten", flatten);
    function average(ps) {
        let returnPoint = { x: 0, y: 0, z: 0 };
        if (ps.length > 0) {
            for (let p of ps) {
                returnPoint = sum(returnPoint, p);
            }
            return shrink(returnPoint, ps.length);
        }
        else {
            return returnPoint;
        }
    }
    exports_1("average", average);
    function normalize(p) {
        let len = length(p);
        if (len != 0) {
            return shrink(p, len);
        }
        else {
            return p;
        }
    }
    exports_1("normalize", normalize);
    function unit(p) {
        return shrink(p, length(p));
    }
    exports_1("unit", unit);
    function transform(p, position, rotation = 0, s = 1) {
        position = clone(position);
        let rel = scale(sub(p, position), s);
        position.x += rel.x * Math.cos(rotation) - rel.y * Math.sin(rotation);
        position.y += rel.x * Math.sin(rotation) + rel.y * Math.cos(rotation);
        return position;
    }
    exports_1("transform", transform);
    function polyFromCircle(x, y, z, r, points = 20) {
        let retList = [];
        for (let i = 0; i < points; i++) {
            let theta = i * 2 * Math.PI / points;
            retList.push({ x: x + r * Math.cos(theta), y: y + r * Math.sin(theta), z: z });
        }
        return retList;
    }
    exports_1("polyFromCircle", polyFromCircle);
    function polyFromRect(x, y, z, width, height, pointMode = "topLeft") {
        switch (pointMode) {
            case "topLeft":
                return [
                    { x: x, y: y, z: z },
                    { x: x + width, y: y, z: z },
                    { x: x + width, y: y + height, z: z },
                    { x: x, y: y + height, z: z }
                ];
            case "center":
                let halfW = width / 2;
                let halfH = height / 2;
                return [
                    { x: x - halfW, y: y - halfH, z: z },
                    { x: x + halfW, y: y - halfH, z: z },
                    { x: x + halfW, y: y + halfH, z: z },
                    { x: x - halfW, y: y + halfH, z: z }
                ];
            case "twoPoint":
                return [
                    { x: x, y: y, z: z },
                    { x: width, y: y, z: z },
                    { x: width, y: height, z: z },
                    { x: x, y: height, z: z }
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
        let sp = s1;
        let sd = sub(s2, s1);
        let sLen = length(sd);
        let st = (rd.x * (sp.y - rp.y) + rd.y * (rp.x - sp.x)) / (rd.y * sd.x - rd.x * sd.y);
        let rt = (sp.y + sd.x * st - rp.x) / rd.x;
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
