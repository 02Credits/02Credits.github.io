import * as ces from "./ces";
import {isCamera} from "./cameraManager";
import {canvasSize} from "./webglManager";

export module InputManager {
  let keys: { [key: string]: boolean } = {};
  let mouseButtons: { [key: string]: boolean } = {};
  let enabled = false;
  let mouseDown = false;
  let mouseX = 0;
  let mouseY = 0;

  let gameDiv = document.getElementById("game");
  gameDiv.onkeydown = (e) => {
    keys[e.key] = true;
  };

  gameDiv.onkeyup = (e) => {
    keys[e.key] = false;
  };

  gameDiv.onmousedown = gameDiv.onmouseup = gameDiv.onmousemove = (e) => {
    mouseButtons.left = (e.buttons & 1) === 1
    mouseButtons.right = ((e.buttons >> 1) & 1) === 1
    mouseButtons.middle = ((e.buttons >> 2) & 1) === 1
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  }

  gameDiv.onmouseenter = () => {
    gameDiv.focus();
    enabled = true;
  }

  gameDiv.onmouseleave = () => {
    enabled = false;
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
    let camera = ces.GetEntities(isCamera)[0];
    return {
      mouseButtons: mouseButtons,
      x: (mouseX - canvasSize / 2) * camera.dimensions.width / canvasSize,
      y: -(mouseY - canvasSize / 2) * camera.dimensions.height / canvasSize,
      enabled: enabled
    };
  }
}

export default InputManager;
