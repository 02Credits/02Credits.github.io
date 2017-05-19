export function absoluteMin(xs: number[]) {
  let currentMin = xs[0];
  for (let i = 1; i < xs.length; i ++) {
    if (Math.abs(currentMin) > Math.abs(xs[i])) {
      currentMin = xs[i];
    }
  }
  return currentMin;
}

export function spliceArray<T>(dest: T[], offset: number, data: T[]) {
  for (let i = 0; i < data.length; i++) {
    dest[offset + i] = data[i];
  }
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Point {
  x: number,
  y: number,
  z?: number
}
export type VecArray = number[];
export type Vec = VecArray | Dimensions | Point;
function isPoint(object: Vec): object is Point { return "x" in object; }
function isDimensions(object: Vec): object is Dimensions { return "width" in object; }

export function toVecArray(vec: Vec) {
  if (isPoint(vec)) {
    return [vec.x, vec.y, vec.z || 0];
  } else if (isDimensions(vec)) {
    return [vec.width, vec.height];
  } else {
    return vec;
  }
}

export function toPoint(vec: Vec) {
  if (isPoint(vec)) {
    return vec;
  } else {
    vec = toVecArray(vec);
    let returnVec = {x: vec[0], y: vec[1]} as Point;
    if (vec.length >= 2) {
      returnVec.z = vec[2];
    }
    return returnVec;
  }
}

export function toDimensions(vec: Vec) {
  if (isDimensions(vec)) {
    return vec;
  } else {
    vec = toVecArray(vec);
    return {width: vec[0], height: vec[1]};
  }
}

export function clone<T extends Vec>(vec: T): T {
  if (isDimensions(vec)) {
    return {width: vec.width, height: vec.height} as T;
  } else if (isPoint(vec)) {
    let returnVec: Point = {x: vec.x, y: vec.y};
    if ("z" in vec) {
      returnVec.z = vec.z;
    }
    return returnVec as T;
  } else {
    let vecArray = vec as number[];
    let returnArray = new Array(vecArray.length);
    for (let i = 0; i < returnArray.length; i++) {
      returnArray[i] = vecArray[i];
    }
    return returnArray as T;
  }
}

export function normal(vec: Vec): VecArray {
  vec = toVecArray(vec);
  return [vec[1], -vec[0]];
}

export function sum(vec1: Vec, vec2: Vec): VecArray {
  vec1 = toVecArray(vec1);
  vec2 = toVecArray(vec2);
  let max = clone(vec1.length > vec2.length ? vec1 : vec2);
  let min = vec1 === max ? vec2 : vec1;
  for (let i = 0; i < min.length; i++) {
    max[i] += min[i];
  }
  return [vec1[0] + vec2[0], vec1[1] + vec2[1]];
}

export function sub(vec1: Vec, vec2: Vec): VecArray {
  return sum(vec1, scale(vec2, -1));
}

export function mult(vec1: Vec, vec2: Vec): VecArray {
  vec1 = toVecArray(vec1);
  vec2 = toVecArray(vec2);
  let max = clone(vec1.length > vec2.length ? vec1 : vec2);
  let min = vec1 === max ? vec2 : vec1;
  for (let i = 0; i < min.length; i++) {
    max[i] *= min[i];
  }
  return max;
}

export function dot(vec1: Vec, vec2: Vec): number {
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

export function scale(vec: Vec, scale: number): VecArray {
  vec = clone(toVecArray(vec));
  for (let i = 0; i < vec.length; i++) {
    vec[i] *= scale;
  }
  return vec;
}

export function shrink(vec: Vec, s: number): VecArray {
  return scale(vec, 1/s);
}

export function length(vec: Vec): number {
  vec = toVecArray(vec);
  let sum = 0;
  for (let el of vec) {
    sum += el * el;
  }
  return Math.sqrt(sum);
}

export function angle(vec: Vec): number {
  vec = toVecArray(vec);
  return Math.atan2(vec[1], vec[0]);
}

export let distance = length;

export function unit(vec: Vec): VecArray {
  vec = toVecArray(vec);
  let len = length(vec);
  return shrink(vec, len);
}

export function transform(vec: Vec, position: Vec, rotation: number = 0, scale: number = 1) {
  vec = toVecArray(vec);
  position = toVecArray(position);
  let relX = (vec[0] - position[0]) * scale;
  let relY = (vec[1] - position[1]) * scale;
  return [
    position[0] + relX * Math.cos(rotation) - relY * Math.sin(rotation),
    position[1] + relX * Math.sin(rotation) + relY * Math.cos(rotation)
  ];
}

export type Polygon = Vec[];

export function polyFromCircle(x: number, y: number, r: number, points: number = 20) {
  let retList: Polygon = [];
  for (let i = 0; i < points; i++) {
    let theta = i * 2 * Math.PI / points;
    retList.push([x + r * Math.cos(theta), y + r * Math.sin(theta)]);
  }
  return retList;
}

export function polyFromRect(x: number, y: number, width: number, height: number, pointMode: "topLeft" | "center" | "twoPoint" = "topLeft"): Polygon {
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

export function transformPoly(poly: Polygon, position: Vec, rotation: number = 0, scale: number = 1) {
  let retPoly: Polygon = [];
  for (let point of poly) {
    retPoly.push(transform(point, position, rotation, scale));
  }
  return retPoly;
}

export function castOnSegment(rp: Vec, rd: Vec, s1: Vec, s2: Vec): Vec | undefined {
  rp = toVecArray(rp);
  rd = toVecArray(rd);
  s1 = toVecArray(s1);
  s2 = toVecArray(s2);
  let sp = s1;
  let sd = sub(s2, s1);
  let sLen = length(sd);
  let st = (rd[0] * (sp[1] - rp[1]) + rd[1] * (rp[0] - sp[0]))/(rd[1] * sd[0] - rd[0] * sd[1]);
  let rt = (sp[0] + sd[0] * st - rp[0]) / rd[0];
  if (st < sLen && rt > 0) {
    return sum(rp, scale(rd, rt));
  }
}

export function castOnPolygon(rp: Vec, rd: Vec, poly: Polygon): Vec | undefined {
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
