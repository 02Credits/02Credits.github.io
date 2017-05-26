import * as ces from "./ces";
import {sub, mult, scale, shrink, Point} from "./utils";
import {isCamera} from "./cameraManager";
import {canvasSize} from "./webglManager";

let keys: { [key: string]: boolean } = {};
let mouseButtons: { [key: string]: boolean } = {};
let enabled = false;
let mouseDown = false;
let mouseScreenPos = {x: 0, y: 0, z: 0};
let gameDiv: HTMLElement;

function mouseEventHandler(e: MouseEvent) {
  mouseButtons.left = (e.buttons & 1) === 1;
  mouseButtons.right = ((e.buttons >> 1) & 1) === 1;
  mouseButtons.middle = ((e.buttons >> 2) & 1) === 1;
  mouseScreenPos.x = e.offsetX;
  mouseScreenPos.y = e.offsetY;
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
  let canvasDimensions = {x: canvasSize, y: canvasSize, z: 0};
  let mousePos: Point;
  if (canvasSize != 0) {
    mousePos = mult(mult(sub(mouseScreenPos, scale(canvasDimensions, 0.5)), shrink(camera.dimensions, canvasSize)), {x: 1, y: -1, z: 0});
  } else {
    mousePos = {x: 0, y: 0, z: 0};
  }
  return {
    mouseButtons: mouseButtons,
    position: mousePos,
    enabled: enabled
  };
}

export function setup() {
  gameDiv = document.getElementById("game");

  document.addEventListener("mouseup", mouseEventHandler);
  document.addEventListener("mousedown", mouseEventHandler);
  document.addEventListener("mousemove", mouseEventHandler);

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  document.addEventListener("mouseenter", mouseEnterHandler);
  document.addEventListener("mouseleave", mouseLeaveHandler);
}
