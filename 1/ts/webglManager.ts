import * as twgl from "twgl.js";

import {Init, Draw} from "./animationManager";
import * as ces from "./ces";
import {isCamera} from "./cameraManager";
import {isCollidable, getCorners} from "./collisionManager";
import {spliceArray, spliceData, Point} from "./utils";
import {CombinedEntity} from "./entity";
import * as ImageMapUtils from "./imageMapUtils";

let spriteVert: string = require<string>('../assets/Shaders/Sprite/vert.glsl');
let spriteFrag: string = require<string>('../assets/Shaders/Sprite/frag.glsl');

const obj: any = {};

export let canvasDimensions: Point = {x: 1000, y: 750, z: 1};
export let visibleDimensions: Point = {x: 0, y: 0, z: 1};

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
  if (window.innerWidth > window.innerHeight) {
    let visibleHeight = window.innerHeight - 100;
    let visibleWidth = visibleHeight * 4 / 3;
    visibleDimensions = {x: visibleWidth, y: visibleHeight, z: 0};
  } else {
    let visibleWidth = window.innerWidth - 100;
    let visibleHeight = visibleWidth * 3 / 4;
    visibleDimensions = {x: visibleWidth, y: visibleHeight, z: 0};
  }

  canvas.style.width = visibleDimensions.x + "px";
  canvas.style.height = visibleDimensions.y + "px";
  canvas.style.marginLeft = -visibleDimensions.x / 2 + "px";
  canvas.style.marginTop = -visibleDimensions.y / 2 + "px";
  canvas.width = canvasDimensions.x;
  canvas.height = canvasDimensions.y;
  gl.viewport(0, 0, canvasDimensions.x, canvasDimensions.y);
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

function drawSprites(gl: WebGLRenderingContext, spriteProgram: twgl.ProgramInfo, textureInfo: ImageMapUtils.TextureInfo) {
  gl.useProgram(spriteProgram.program)
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

export async function Setup(texturePaths: string[]) {
  let canvas = document.createElement('canvas');
  document.getElementById("game").appendChild(canvas);
  let gl = canvas.getContext('webgl', {alpha: false});
  let basePath = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
  canvas.focus();

  let textures = await ImageMapUtils.setupTextures(gl, basePath, texturePaths);
  let spriteProgram = twgl.createProgramInfo(gl, [spriteVert, spriteFrag]);

  Init.Subscribe(() => {
    gl.useProgram(spriteProgram.program);

    setCameraUniforms(spriteProgram);
    twgl.setUniforms(spriteProgram, {
      u_texmap: textures.texture,
      u_map_dimensions: textures.size
    });
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

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
  });
}
