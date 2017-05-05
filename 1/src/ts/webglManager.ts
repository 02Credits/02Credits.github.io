import * as twgl from "twgl";

import {Update} from "./animationManager";

function positionCanvas(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
  let size = Math.min(window.innerWidth, window.innerHeight) - 100;
  canvas.style.width = size + "px";
  canvas.style.height = size + "px";
  canvas.style.marginLeft = -size / 2 + "px";
  canvas.style.marginTop = -size / 2 + "px";
  gl.viewport(0, 0, size, size);
  return size;
}

async function fetchShader(path: string) {
  let result = await fetch(path);
  return await result.text();
}

async function packTextures(images: { [id: string]: HTMLImageElement }) {
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
      x += image.width;
      if (x > size) {
        x = 0;
        y += rowHeight;
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
      y += rowHeight;
      rowHeight = image.height;
    }
    ctx.drawImage(image, x, y);
    imageLayoutInfo[imageData.id] = [
      x, y,
      x + image.width, y,
      x, y + image.height,
      x + image.width, y,
      x, y + image.height,
      x + image.width, y + image.height
    ];
    x += image.width;
  }
  return {size: size, canvas: canvas, texCoords: imageLayoutInfo};
}

async function loadTextures(basePath: string, texturePaths: string[]) {
  let images: { [id: string]: HTMLImageElement } = {};
  for (let path of texturePaths) {
    let imagePath = basePath + "assets/" + path;
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



export async function Setup(texturePaths: string[]) {
  let canvas = document.createElement('canvas');
  document.getElementById("game").appendChild(canvas);
  let gl = canvas.getContext('webgl');
  let basePath = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
  let result = await loadTextures(basePath, texturePaths);
  document.body.appendChild(result.canvas);

  canvas.focus();

  let programInfo = twgl.createProgramInfo(gl, [
    await fetchShader(basePath + "assets/vert.glsl"),
    await fetchShader(basePath + "assets/frag.glsl")
  ]);

  let texture = twgl.createTexture(gl, {
    src: result.canvas,
    wrap: gl.CLAMP_TO_EDGE,
    mag: gl.NEAREST
  });

  gl.useProgram(programInfo.program);
  let mapUniforms = {
    u_map_dimensions: result.size
  };
  twgl.setUniforms(programInfo, mapUniforms);

  Update.Subscribe(() => {
    let displaySize = positionCanvas(canvas, gl);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let displayUniforms = {
      u_display_dimensions: displaySize
    };
    twgl.setUniforms(programInfo, displayUniforms);

    let texCoords = result.texCoords["Player.png"];
    let arrays = {
      a_position: { numComponents: 2, data: [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1] },
      a_texcoord: { numComponents: 2, data: texCoords }
    };

    let bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo);
  });

}
