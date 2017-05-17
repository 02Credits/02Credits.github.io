import * as ces from "./ces";
import * as webglManager from "./webglManager";
import * as playerManager from "./playerManager";
import * as collisionManager from "./collisionManager";
import * as parentManager from "./parentManager";
import * as cameraManager from "./cameraManager";
import * as triggerManager from "./triggerManager";
import * as wallManager from "./wallManager";
import * as holeManager from "./holeManager";
import * as statueManager from "./statueManager";
import * as animationManager from "./animationManager";
import * as interpolationManager from "./interpolationManager";
import * as particleManager from "./particleManager";
import * as inputManager from "./inputManager";

webglManager.Setup(["Wall.png", "Player.png"]).then(async () => {
  await collisionManager.Setup();
  await playerManager.Setup();
  await parentManager.Setup();
  await cameraManager.Setup();
  await triggerManager.Setup();
  await wallManager.Setup();
  await holeManager.Setup();
  await statueManager.Setup();
  await interpolationManager.Setup();
  await particleManager.Setup();
  await inputManager.Setup();

  ces.addEntity({
    "position": {
      "x": 0,
      "y": 0
    },
    "dimensions": {
      "width": 100,
      "height": 100
    },
    "camera": {
      "targetX": 0,
      "targetY": 0
    }
  });

  ces.addEntity({
    "id": "player",
    "texture": "Player.png",
    "position": {
      "x": 0,
      "y": 0,
      "z": 5,
      "cx": 0.5,
      "cy": 0.5
    },
    "dimensions": {
      "width": 5,
      "height": 5
    },
    "collidable": true,
    "collisionShape": {
      "kind": "circle",
    },
    "fallable": true,
    "player": {
      "stepSpeed": 0.3,
      "stepSize": 5
    }
  });

  ces.addEntity({
    "texture": "Wall.png",
    "position": {
      "x": 0,
      "y": 0,
      "z": 4,
      "cx": 0.5,
      "cy": 0.5
    },
    "dimensions": {
      "width": 1,
      "height": 1
    },
    "parent": "player",
    "child": {
      "relativePosition": {
        "x": -1
      }
    },
    "foot": true
  });

  ces.addEntity({
    "texture": "Wall.png",
    "position": {
      "x": 0,
      "y": 0,
      "z": 4,
      "cx": 0.5,
      "cy": 0.5
    },
    "dimensions": {
      "width": 1,
      "height": 1
    },
    "parent": "player",
    "child": {
      "relativePosition": {
        "x": 1
      }
    },
    "foot": true
  });

  animationManager.Setup();
});
