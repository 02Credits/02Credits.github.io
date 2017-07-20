import * as ces from "./ces";
import {isCamera} from "./cameraManager";

export function Setup() {
  function addWall(left: number, right: number, top: number, bottom: number) {
    ces.addEntity({
      "position": {
        "x": (left + right) / 2,
        "y": (top + bottom) / 2,
        "z": 0
      },
      "dimensions": {
        "x": right - left,
        "y": top - bottom,
        "z": 0
      },
      "wall": true,
      "collidable": true,
      "texture": "Wall.png"
    });
  }

  function addCameraTrigger(left: number, right: number, top: number, bottom: number,
                            targetX: number, targetY: number) {
    ces.addEntity({
      "position": {
        "x": (left + right) / 2,
        "y": (top + bottom) / 2,
        "z": 0
      },
      "dimensions": {
        "x": right - left,
        "y": top - bottom,
        "z": 0
      },
      "collidable": true,
      "trigger": {
        "action": () => {
          ces.getEntities(isCamera)[0].camera = {
            "targetX": targetX,
            "targetY": targetY
          }
        }
      }
    })
  }

  addWall(-15.625, 6.25, 3.125, -3.125);
  addWall(-31.25, -25, 25, -25);
  addWall(-25, 25, -18.75, -25);
  addWall(-25, 25, 25, 18.75);
  addWall(25, 31.25, 25, 6.25);
  addWall(25, 31.25, -6.25, -25);
  addCameraTrigger(31.25, 37.5, 6.25, -6.25, 75, 0);
  addCameraTrigger(25, 31.25, 6.25, -6.25, 0, 0);
}
