import * as twgl from "twgl";

import {Init, Update} from "./animationManager";
import * as ces from "./ces";
import {isCamera} from "./cameraManager";
import {isCollidable, getCorners} from "./collisionManager";

import {CombinedEntity} from "./entity";

const obj: any = {};

export let canvasSize: number;

export interface Position {
  x: number;
  y: number;
  z?: number;
  cx?: number;
  cy?: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Color {
  h: number;
  s: number;
  v: number;
  a?: number;
}

export interface Entity {
  texture: string;
  position: Position;
  dimensions: Dimensions;
  scale?: number;
  rotation?: number;
  color?: Color;
}
export function isRenderable(entity: CombinedEntity): entity is Entity { return "texture" in entity; }

function positionCanvas(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
  canvasSize = Math.min(window.innerWidth, window.innerHeight) - 100;
  canvas.style.width = canvasSize + "px";
  canvas.style.height = canvasSize + "px";
  canvas.style.marginLeft = -canvasSize / 2 + "px";
  canvas.style.marginTop = -canvasSize / 2 + "px";
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  gl.viewport(0, 0, canvasSize, canvasSize);
}

async function fetchShader(path: string) {
  let result = await fetch(path);
  return await result.text();
}

interface TextureInfo {
  size: number,
  canvas: HTMLCanvasElement,
  texCoords: { [id: string]: number[] },
  texture?: WebGLTexture
}

async function packTextures(images: { [id: string]: HTMLImageElement }): Promise<TextureInfo> {
  let imageArray: {image: HTMLImageElement, id: string}[] = [];
  for (let id in images) {
    imageArray.push({image: images[id], id: id});
  }
  imageArray = imageArray.sort((a, b) => a.image.height - b.image.height);
  let size = 16;
  let correctSize = true;
  do {
    correctSize = true;
    size *= 2;
    let x = 0;
    let y = 0;
    let rowHeight = imageArray[0].image.height;
    for (let imageData of imageArray) {
      let image = imageData.image;
      x += image.width + 2;
      if (x > size) {
        x = 0;
        y += rowHeight + 2;
        if (y + image.height > size) {
          correctSize = false;
          break;
        }
        rowHeight = image.height;
      }
    }
  } while (!correctSize)

  let canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  let ctx = canvas.getContext('2d');
  let x = 0;
  let y = 0;
  let rowHeight = imageArray[0].image.height;
  let imageLayoutInfo: { [id: string]: number[] } = {};
  for (let imageData of imageArray) {
    let image = imageData.image;
    if (x + image.width > size) {
      x = 0;
      y += rowHeight + 2;
      rowHeight = image.height;
    }
    ctx.drawImage(image, x, y);
    imageLayoutInfo[imageData.id] = [
      x, y,
      x + image.width, y,
      x, y + image.height,
      x + image.width, y + image.height
    ];
    x += image.width + 2;
  }
  return {size: size, canvas: canvas, texCoords: imageLayoutInfo};
}

async function loadTextures(basePath: string, texturePaths: string[]) {
  let images: { [id: string]: HTMLImageElement } = {};
  for (let path of texturePaths) {
    let imagePath = basePath + "assets/Images/" + path;
    let image = new Image();
    let loadedPromise = new Promise((resolve) => {
      let handler = () => {
        resolve();
        image.removeEventListener('load', handler);
      }
      image.addEventListener('load', handler, false);
      image.src = imagePath;
    });
    await loadedPromise;
    images[path] = image;
  }

  return packTextures(images);
}

async function setupTextures(gl: WebGLRenderingContext, basePath: string, texturePaths: string[]) {
  let result = await loadTextures(basePath, texturePaths);
  document.body.appendChild(result.canvas);
  let texture = twgl.createTexture(gl, {
    src: result.canvas,
    // wrap: gl.CLAMP_TO_EDGE,
    // mag: gl.NEAREST,
    // min: gl.NEAREST
  });

  return {texture: texture, ...result};
}

async function compileProgram(gl: WebGLRenderingContext, basePath: string, folder: string) {
  return twgl.createProgramInfo(gl, [
    await fetchShader(basePath + "assets/Shaders/" + folder + "/vert.glsl"),
    await fetchShader(basePath + "assets/Shaders/" + folder + "/frag.glsl")
  ]);
}

async function setCameraUniforms(program: twgl.ProgramInfo) {
  let camera = ces.GetEntities(isCamera)[0];
  let cameraCX = camera.position.cx || 0.5;
  let cameraCY = camera.position.cy || 0.5;
  let cameraWidth = (camera.dimensions || obj).width || 100;
  let cameraHeight = (camera.dimensions || obj).height || 100;

  let cameraUniforms = {
    u_camera_dimensions: [camera.position.x, camera.position.y, cameraWidth, cameraHeight]
  };
  twgl.setUniforms(program, cameraUniforms);

}

async function clearCanvas(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) {
  positionCanvas(canvas, gl);
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

async function drawSprites(gl: WebGLRenderingContext, spriteProgram: twgl.ProgramInfo, textureInfo: TextureInfo) {
  gl.useProgram(spriteProgram.program);

  let batchCount = 0;
  let coords: number[][] = [];
  let positions: number[][] = [];
  let texCoords: number[][] = [];
  let rotations: number[][] = [];
  let dimensions: number[][] = [];
  let centers: number[][] = [];
  let scales: number[][] = [];
  let indices: number[][] = [];

  let drawBatch = () => {
    let arrays = {
      a_coord: {numComponents: 2, data: [].concat.apply([], coords)},
      a_position: {numComponents: 3, data: [].concat.apply([], positions)},
      a_texcoord: {numComponents: 2, data: [].concat.apply([], texCoords)},
      a_rotation: {numComponents: 1, data: [].concat.apply([], rotations)},
      a_dimensions: {numComponents: 2, data: [].concat.apply([], dimensions)},
      a_center: {numComponents: 2, data: [].concat.apply([], centers)},
      a_scale: {numComponents: 1, data: [].concat.apply([], scales)},
      indices: {numComponents: 3, data: [].concat.apply([], indices)}
    };
    coords = positions = texCoords = rotations = dimensions = centers = scales = indices = [];
    let bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    twgl.setBuffersAndAttributes(gl, spriteProgram, bufferInfo);
    twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo);
    batchCount = 0;
  }

  for (let entity of ces.GetEntities(isRenderable).sort((a, b) => (a.position.z || 0) - (b.position.z || 0))) {
    coords.push([0, 0, 1, 0, 0, 1, 1, 1]);
    let x = entity.position.x;
    let y = entity.position.y;
    let z = entity.position.z || 0;
    positions.push([x, y, z, x, y, z, x, y, z, x, y, z]);
    texCoords.push(textureInfo.texCoords[entity.texture]);
    let rotation = entity.rotation || 0;
    rotations.push([rotation, rotation, rotation, rotation]);
    let w = entity.dimensions.width;
    let h = entity.dimensions.height;
    dimensions.push([w, h, w, h, w, h, w, h]);
    let scale = entity.scale || 1;
    let cx = entity.position.cx || 0.5;
    let cy = entity.position.cy || 0.5;
    centers.push([cx, cy, cx, cy, cx, cy, cx, cy]);
    scales.push([scale, scale, scale, scale]);
    let offset = batchCount * 4;
    indices.push([0 + offset, 1 + offset, 2 + offset, 2 + offset, 1 + offset, 3 + offset]);
    batchCount++;
  }
  drawBatch();
}

async function drawDebug(gl: WebGLRenderingContext, debugProgram: twgl.ProgramInfo) {
  gl.useProgram(debugProgram.program);

  let indexOffset = 0;
  let coords: number[][] = [];
  let indices: number[][] = [];

  let drawBatch = () => {
    let arrays = {
      a_coord: {numComponents: 2, data: [].concat.apply([], coords)},
      indices: {numComponents: 3, data: [].concat.apply([], indices)}
    };
    coords = indices = [];
    indexOffset = 0;
    let bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    twgl.setBuffersAndAttributes(gl, debugProgram, bufferInfo);
    twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo);
  }

  for (let entity of ces.GetEntities(isCollidable).sort((a, b) => (a.position.z || 0) - (b.position.z || 0))) {
    let corners = getCorners(entity);
    for (let poly of corners) {
      coords.push([].concat.apply([], poly));
      let polyIndices: number[] = [];
      for (let i = 2; i < poly.length; i++) {
        polyIndices = polyIndices.concat([indexOffset + i, indexOffset, indexOffset + i - 1])
      }
      indices.push(polyIndices);
      indexOffset += poly.length;
    }
  }
  drawBatch();
}

export async function Setup(texturePaths: string[]) {
  let canvas = document.createElement('canvas');
  document.getElementById("game").appendChild(canvas);
  let gl = canvas.getContext('webgl');
  let basePath = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
  canvas.focus();

  let textures = await setupTextures(gl, basePath, texturePaths);

  let spriteProgram = await compileProgram(gl, basePath, "Sprite");
  let debugProgram = await compileProgram(gl, basePath, "Debug");

  Init.Subscribe(() => {
    gl.useProgram(spriteProgram.program);

    setCameraUniforms(spriteProgram);
    twgl.setUniforms(spriteProgram, {
      u_texmap: textures.texture,
      u_map_dimensions: textures.size
    });

    gl.useProgram(debugProgram.program)

    setCameraUniforms(debugProgram);
    twgl.setUniforms(debugProgram, {
      u_color: [1, 0, 0, 0.5]
    });
  })

  ces.CheckEntity.Subscribe((entity) => {
    if (isRenderable(entity)) {
      entity.color = entity.color || { h: 1, s: 1, v: 1, a: 1 };
    }
    return true;
  });

  Update.Subscribe(async () => {
    clearCanvas(gl, canvas);
    await drawSprites(gl, spriteProgram, textures);
    await drawDebug(gl, debugProgram);
  });

}
