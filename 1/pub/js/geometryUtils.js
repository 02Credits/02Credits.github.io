System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function normal(vec) {
        return [vec[1], -vec[0]];
    }
    exports_1("normal", normal);
    function sum(vec1, vec2) {
        return [vec1[0] + vec2[0], vec1[1] + vec2[1]];
    }
    exports_1("sum", sum);
    function sub(vec1, vec2) {
        return [vec1[0] - vec2[0], vec1[1] - vec2[1]];
    }
    exports_1("sub", sub);
    function dot(vec1, vec2) {
        return vec1[0] * vec2[0] + vec1[1] * vec2[1];
    }
    exports_1("dot", dot);
    function scale(vec, scale) {
        return [vec[0] * scale, vec[1] * scale];
    }
    exports_1("scale", scale);
    function length(vec) {
        return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    }
    exports_1("length", length);
    function unit(vec) {
        let len = length(vec);
        return [
            vec[0] / len,
            vec[1] / len
        ];
    }
    exports_1("unit", unit);
    function transform(vec, position, rotation = 0, scale = 1) {
        let relX = (vec[0] - position[0]) * scale;
        let relY = (vec[1] - position[1]) * scale;
        return [
            position[0] + relX * Math.cos(rotation) - relY * Math.sin(rotation),
            position[1] + relX * Math.sin(rotation) + relY * Math.cos(rotation)
        ];
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
    return {
        setters: [],
        execute: function () {
        }
    };
});

//# sourceMappingURL=geometryUtils.js.map
