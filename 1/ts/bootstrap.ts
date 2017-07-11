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

webglManager.Setup(["Wall.png", "Player.png", "LightOverlay.png", "CharacterBody.png", "CharacterHead.png", "Foot.png", "DustGrey.png", "FlashFuzz.png", "OpaqueSmoke.png"]).then(async () => {
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
      "y": 75,
      "z": 0
    },
    "camera": {
      "targetX": 0,
      "targetY": 0
    }
  });

  ces.addEntity({
    "id": "playerParticleBase",
    "position": {x: 0, y: 0, z: 0},
    "dimensions": {
      x: 1, y: 1, z: 0
    },
    "texture": "DustGrey.png",
    "collidable": true,
    "collisionShape": {
      kind: "circle"
    },
    "friction": 0.90,
    "restitution": 1.5,
    "enabled": false
  });

  ces.addEntity({
    "id": "playerFootBase",
    "texture": "Foot.png",
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
    "foot": true,
    "enabled": false
  });

  ces.addEntity({
    "id": "player",
    "texture": "CharacterHead.png",
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
      "kind": "circle"
    },
    "player": {
      "stepSpeed": 0.3,
      "stepSize": 5,
      "dashLength": 0.5,
      "particleCount": 5,
      "particleBase": "playerParticleBase",
      "footBase": "playerFootBase"
    }
  });

  ces.addEntity({
    "id": "lightOverlay",
    "texture": "LightOverlay.png",
    "parent": "player",
    "position": {
      "x": 0,
      "y": 0,
      "z": 0
    },
    "dimensions": {
      "x": 400,
      "y": 400,
      "z": 0
    },
    "child": {
      "relativePosition": {
        "x": 0,
        "y": 0
      }
    }
  });

  animationManager.Setup();
});
