import * as twgl from "twgl";

import {Init, Draw} from "./animationManager";
import * as ces from "./ces";
import {isCamera} from "./cameraManager";
import {isCollidable, getCorners} from "./collisionManager";
import {spliceArray, Point} from "./utils";

import {CombinedEntity} from "./entity";

const debug = false;
const obj: any = {};

export let canvasSize: number = 0;

export interface Color {
  h?: number;
  s?: number;
  v?: number;
  r?: number;
  g?: number;
  b?: number;
  a?: number;
}

export interface Entity {
  texture: string;
  position: Point;
  dimensions: Point;
  center?: Point;
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

function packTextures(images: { [id: string]: HTMLImageElement }): TextureInfo {
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

function setCameraUniforms(program: twgl.ProgramInfo) {
  let camera = ces.getEntities(isCamera)[0];
  let cameraWidth = (camera.dimensions || obj).x || 100;
  let cameraHeight = (camera.dimensions || obj).y || 100;

  let cameraUniforms = {
    u_camera_dimensions: [camera.position.x, camera.position.y, cameraWidth, cameraHeight]
  };
  twgl.setUniforms(program, cameraUniforms);

}

function clearCanvas(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) {
  positionCanvas(canvas, gl);
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function spliceData(array: {numComponents: number, data: number[]}, entityIndex: number, data: number[]) {
  let expectedCount = array.numComponents * 4;
  for (let i = 0; i < expectedCount; i += data.length) {
    spliceArray(array.data, entityIndex * expectedCount + i, data);
  }
}

let spriteArrays: {[id: string]: {numComponents: number, data: number[]}} = {
  a_coord: {numComponents: 2, data: new Array(400)},
  a_position: {numComponents: 3, data: new Array(400)},
  a_texcoord: {numComponents: 2, data: new Array(400)},
  a_rotation: {numComponents: 1, data: new Array(400)},
  a_dimensions: {numComponents: 2, data: new Array(400)},
  a_center: {numComponents: 2, data: new Array(400)},
  a_scale: {numComponents: 1, data: new Array(400)},
  indices: {numComponents: 3, data: new Array(400)}
};

function drawSprites(gl: WebGLRenderingContext, spriteProgram: twgl.ProgramInfo, textureInfo: TextureInfo) {
  gl.useProgram(spriteProgram.program);
  let renderables = ces.getEntities(isRenderable).sort((a, b) => (a.position.z || 0) - (b.position.z || 0));

  for (let id in spriteArrays) {
    let expectedLength = renderables.length * spriteArrays[id].numComponents;
    if (spriteArrays[id].data.length < expectedLength) {
      spriteArrays[id].data = new Array(expectedLength);
    }
  }

  let index = 0;
  for (let entity of renderables) {
    spliceData(spriteArrays.a_coord, index, [ 0, 0, 1, 0, 0, 1, 1, 1 ]);
    spliceData(spriteArrays.a_position, index, [
      entity.position.x,
      entity.position.y,
      entity.position.z || 0
    ]);
    spliceData(spriteArrays.a_texcoord, index, textureInfo.texCoords[entity.texture]);
    spliceData(spriteArrays.a_rotation, index, [entity.rotation || 0]);
    spliceData(spriteArrays.a_dimensions, index, [
      entity.dimensions.x,
      entity.dimensions.y
    ]);
    spliceData(spriteArrays.a_center, index, [
      (entity.center || obj).x || 0.5,
      (entity.center || obj).y || 0.5
    ]);
    spliceData(spriteArrays.a_scale, index, [entity.scale || 1]);
    let offset = index * 4;
    spliceArray(spriteArrays.indices.data, index * 6,
                [offset + 0, offset + 1, offset + 2, offset + 2, offset + 1, offset + 3]);
    index++;
  }

  let bufferInfo = twgl.createBufferInfoFromArrays(gl, spriteArrays);
  twgl.setBuffersAndAttributes(gl, spriteProgram, bufferInfo);
  twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo, renderables.length * 6);
}

function drawDebug(gl: WebGLRenderingContext, debugProgram: twgl.ProgramInfo) {
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
    let bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    twgl.setBuffersAndAttributes(gl, debugProgram, bufferInfo);
    twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo);
  }

  for (let entity of ces.getEntities(isCollidable).sort((a, b) => (a.position.z || 0) - (b.position.z || 0))) {
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

    if (debug) {
      gl.useProgram(debugProgram.program);

      setCameraUniforms(debugProgram);
      twgl.setUniforms(debugProgram, {
        u_color: [1, 0, 0, 0.5]
      });
    }
  });

  ces.CheckEntity.Subscribe((entity) => {
    if (isRenderable(entity)) {
      entity.color = entity.color || { h: 1, s: 1, v: 1, a: 1, r: 1, g: 1, b: 1 };
    }
    return true;
  });

  Draw.Subscribe(() => {
    clearCanvas(gl, canvas);
    drawSprites(gl, spriteProgram, textures);
    if (debug) {
      drawDebug(gl, debugProgram);
    }
  });
}
