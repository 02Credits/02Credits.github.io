import * as ces from "./ces";
import * as webglManager from "./webglManager";
import * as playerManager from "./playerManager";
import * as collisionManager from "./collisionManager";
import * as cameraManager from "./cameraManager";
import * as triggerManager from "./triggerManager";
import * as wallManager from "./wallManager";
import * as holeManager from "./holeManager";
import * as statueManager from "./statueManager";
import * as animationManager from "./animationManager";
import * as interpolationManager from "./interpolationManager";
import * as particleManager from "./particleManager";
import * as inputManager from "./inputManager";
import * as parentManager from "./parentManager";
import * as motionManager from "./motionManager";

webglManager.Setup(["Wall.png", "Player.png"]).then(async () => {
  await collisionManager.setup();
  await playerManager.setup();
  await cameraManager.setup();
  await triggerManager.setup();
  await wallManager.setup();
  await holeManager.setup();
  await statueManager.setup();
  await interpolationManager.setup();
  await particleManager.setup();
  await inputManager.setup();
  await motionManager.setup();
  await parentManager.setup();

  ces.addEntity({
    "position": {
      "x": 50,
      "y": 0,
      "z": 0
    },
    "dimensions": {
      "x": 10,
      "y": 100,
      "z": 0
    },
    "wall": true,
    "collidable": true,
    "texture": "Wall.png"
  });

  ces.addEntity({
    "position": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "dimensions": {
      "x": 100,
      "y": 100,
      "z": 0
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
      "z": 5
    },
    "dimensions": {
      "x": 5,
      "y": 5,
      "z": 0
    },
    "friction": 0.85,
    "collidable": true,
    "collisionShape": {
      "kind": "circle",
    },
    "player": {
      "stepSpeed": 0.3,
      "stepSize": 5
    },
    "particleGenerator": {
      relativeStart: {
      },
      relativeEnd: {
      },
      constant: {
        texture: "Player.png",
        dimensions: {
          x: 1,
          y: 1,
          z: 0
        },
        position: {x: 0, y: 0, z: 0},
        restitution: 1,
        collidable: true,
        // friction: 0.95,
        playerParticle: true
      },
      length: 10,
      frequency: 2
    }
  });

  ces.addEntity({
    "texture": "Player.png",
    "position": {
      "x": 20,
      "y": 20,
      "z": 20
    },
    "dimensions": {
      "x": 1,
      "y": 1,
      "z": 0
    },
    "restitution": 1,
    "collidable": true,
    "friction": 0.95,
    "playerParticle": true
  });

  ces.addEntity({
    "texture": "Wall.png",
    "position": {
      "x": 0,
      "y": 0,
      "z": 4
    },
    "dimensions": {
      "x": 1,
      "y": 1,
      "z": 0
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
      "z": 4
    },
    "dimensions": {
      "x": 1,
      "y": 1,
      "z": 0
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
