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

webglManager.Setup(["Wall.png", "Player.png"]).then(() => {
  collisionManager.Setup();
  playerManager.Setup();
  parentManager.Setup();
  cameraManager.Setup();
  triggerManager.Setup();
  wallManager.Setup();
  holeManager.Setup();
  statueManager.Setup();
  animationManager.Setup();
  interpolationManager.Setup();
  particleManager.Setup();

  ces.AddEntity({
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

  ces.AddEntity({
    "texture": "Player.png",
    "position": {
      "x": 40,
      "y": 0,
      "z": 5,
      "cx": 0.5,
      "cy": 0.5
    },
    "dimensions": {
      "width": 5,
      "height": 5
    },
    "scale": 2,
    "fallable": true,
    "collidable": true,
    "statue": {
      "activationRadius": 30,
      "timeBetweenJumps": 5,
      "maxJumpDistance": 5,
      "jumpTimeLength": 1,
      "jumpScaling": 1.25,
      "knockBack": 5,
      "rotationSpeed": Math.PI / 100,
      "rotationSlowdown": 0.9
    }
  });

  ces.AddEntity({
    "texture": "Wall.png",
    "position": {
      "x": 20,
      "y": 20,
      "cx": 0.5,
      "cy": 0.5
    },
    "dimensions": {
      "width": 5,
      "height": 5
    },
    "collidable": true,
    "interpolated": {
      start: {
        "dimensions": {
          "width": [ 2, 5 ],
          "height": [ 2, 5 ]
        }
      },
      end: {
        "dimensions": {
          "width": [ 5, 10 ],
          "height": [ 5, 10 ]
        }
      },
      length: 5,
      kill: true
    },
    "trigger": {
      "action": () => cameraManager.Shake(10)
    }
  });

  ces.AddEntity({
    "texture": "Wall.png",
    "position": {
      "x": 40,
      "y": 20,
      "z": 0,
      "cx": 0.5,
      "cy": 0.5
    },
    "dimensions": {
      "width": 20,
      "height": 20
    },
    "collidable": true,
    "hole": {
      "steepness": 0.1
    }
  });

  ces.AddEntity({
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
    },
    "particleGenerator": {
      "relativeStart": {
        "dimensions": {
          "width": 0,
          "height": 0
        },
        "position": {
          "x": 0,
          "y": 0
        }
      },
      "relativeEnd": {
        "dimensions": {
          "width": -5,
          "height": -5
        },
        "position": {
          "x": [-5, 5],
          "y": [-5, 5]
        }
      },
      "constant": {
        "texture": "Player.png",
        "position": {
          "cx": 0.5,
          "cy": 0.5
        }
      },
      "length": 1,
      "frequency": 10
    }
  });

  ces.AddEntity({
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

  ces.AddEntity({
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
