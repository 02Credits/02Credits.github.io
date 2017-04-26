export module Utils {
    // export function defaultValue<T>(getX: T|(() => T), defaultValue: T) {
    //     try {
    //         let x: T;
    //         if (typeof getX == "function") {
    //             x = getX();
    //         } else {
    //             x = getX;
    //         }
    //         if (x != null) {
    //             return x;
    //         } else {
    //             return defaultValue;
    //         }
    //     } catch (e) {
    //         return defaultValue;
    //     }
    // }

    export function absoluteMin(xs: number[]) {
        let currentMin = xs[0];
        for (let i = 1; i < xs.length; i ++) {
            if (Math.abs(currentMin) > Math.abs(xs[i])) {
                currentMin = xs[i];
            }
        }
        return currentMin;
    }

    interface CoordObject {
        x: number;
        y: number;
    }

    type CoordArray = number[];

    type Coords = CoordObject|CoordArray;

    export function standardizeCoords(coords: Coords) {
        if (Array.isArray(coords)) {
            return {x: coords[0], y: coords[0]};
        } else {
            return coords;
        }
    }

    export function distance(coords: Coords) {
        let standardCoords = standardizeCoords(coords);
        return Math.sqrt(standardCoords.x * standardCoords.x + standardCoords.y * standardCoords.y);
    }

    export function sub(coords1: Coords, coords2: Coords) {
        let c1 = standardizeCoords(coords1);
        let c2 = standardizeCoords(coords2);
        return {x: c1.x - c2.x, y: c1.y - c2.y};
    }

    export function add(coords1: Coords, coords2: Coords) {
        let c1 = standardizeCoords(coords1);
        let c2 = standardizeCoords(coords2);
        return {x: c1.x + c2.x, y: c1.y + c2.y};
    }

    export function mult(coords: Coords, s: number) {
        let c = standardizeCoords(coords);
        return {x: c.x * s, y: c.y * s};
    }

    export function div(coords: Coords, s: number) {
        let c = standardizeCoords(coords);
        return {x: c.x / s, y: c.y / s};
    }
}

export default Utils;
