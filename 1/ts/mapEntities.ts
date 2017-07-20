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
        },
        "coolDown": 1
      }
    })
  }

  //Room 1
  addWall(-15.625, 6.25, 3.125, -3.125); // Coffin
  addWall(-31.25, -25, 25, -25);  // Left Wall
  addWall(-25, 25, -18.75, -25);  // Bottom Wall
  addWall(-25, 25, 25, 18.75);  // Top Wall
  addWall(21.875, 28.125, 25, 6.25); // Top Right Wall
  addWall(21.875, 28.125, -6.25, -25); // Bottom Right Wall
  addCameraTrigger(31.25, 37.5, 6.25, -6.25, 75, 0); // Right Trigger
  addCameraTrigger(25, 31.25, 6.25, -6.25, 0, 0); // Left Trigger
}
