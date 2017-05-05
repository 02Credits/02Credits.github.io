export type Vec = number[];

export function normal(vec: Vec): Vec {
  return [vec[1], -vec[0]];
}

export function sum(vec1: Vec, vec2: Vec): Vec {
  return [vec1[0] + vec2[0], vec1[1] + vec2[1]];
}

export function sub(vec1: Vec, vec2: Vec): Vec {
  return [vec1[0] - vec2[0], vec1[1] - vec2[1]];
}

export function dot(vec1: Vec, vec2: Vec): number {
  return vec1[0] * vec2[0] + vec1[1] * vec2[1];
}

export function scale(vec: Vec, scale: number): Vec {
  return [vec[0] * scale, vec[1] * scale];
}

export function length(vec: Vec): number {
  return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
}

export function unit(vec: Vec) {
  let len = length(vec);
  return [
    vec[0] / len,
    vec[1] / len
  ];
}

export function transform(vec: Vec, position: Vec, rotation: number = 0, scale: number = 1) {
  let relX = vec[0] * scale - position[0];
  let relY = vec[1] * scale - position[1];
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
