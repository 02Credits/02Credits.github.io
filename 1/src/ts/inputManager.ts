import * as ces from "./ces";
import {sub, mult, scale, shrink} from "./utils";
import {isCamera} from "./cameraManager";
import {canvasSize} from "./webglManager";

let keys: { [key: string]: boolean } = {};
let mouseButtons: { [key: string]: boolean } = {};
let enabled = false;
let mouseDown = false;
let mouseScreenPos = [0, 0];
let gameDiv: HTMLElement;

function mouseEventHandler(e: MouseEvent) {
  mouseButtons.left = (e.buttons & 1) === 1;
  mouseButtons.right = ((e.buttons >> 1) & 1) === 1;
  mouseButtons.middle = ((e.buttons >> 2) & 1) === 1;
  mouseScreenPos[0] = e.offsetX;
  mouseScreenPos[1] = e.offsetY;
}

function mouseEnterHandler() {
  gameDiv.focus();
  enabled = true;
}

function mouseLeaveHandler() {
  enabled = false;
}

function keyUpHandler(e: KeyboardEvent) {
  keys[e.key] = false;
}

function keyDownHandler(e: KeyboardEvent) {
  keys[e.key] = true;
}

export function KeyDown(key: string) {
  if (keys[key]) { // Yes this is dumb. This is to handle if the key hasn't been pressed before
    return true;
  } else {
    return false;
  }
}

export function MouseState() {
  // NOTE I should probably change this to not do the transform here and instead leave it to the pixi Manager...
  let camera = ces.getEntities(isCamera)[0];
  let canvasDimensions = [canvasSize, canvasSize];
  return {
    mouseButtons: mouseButtons,
    position: mult(mult(sub(mouseScreenPos, scale(canvasDimensions, 0.5)), shrink(camera.dimensions, canvasSize)), [1, -1]),
    enabled: enabled
  };
}

export function setup() {
  gameDiv = document.getElementById("game");

  gameDiv.addEventListener("mouseup", mouseEventHandler);
  gameDiv.addEventListener("mousedown", mouseEventHandler);
  gameDiv.addEventListener("mousemove", mouseEventHandler);

  gameDiv.addEventListener("keydown", keyDownHandler);
  gameDiv.addEventListener("keyup", keyUpHandler);

  gameDiv.addEventListener("mouseenter", mouseEnterHandler);
  gameDiv.addEventListener("mouseleave", mouseLeaveHandler);
}
