import * as ces from "./ces";
import * as pixiManager from "./pixiManager";
import * as playerManager from "./playerManager";
import * as collisionManager from "./collisionManager";
import * as parentManager from "./parentManager";
import * as cameraManager from "./cameraManager";
import * as triggerManager from "./triggerManager";
import * as wallManager from "./wallManager";
import * as holeManager from "./holeManager";
import * as statueManager from "./statueManager";
import * as animationManager from "./animationManager";

pixiManager.Setup(["Wall.png", "Player.png"]).then(() => {
    collisionManager.Setup();
    playerManager.Setup();
    parentManager.Setup();
    cameraManager.Setup();
    triggerManager.Setup();
    wallManager.Setup();
    holeManager.Setup();
    statueManager.Setup();

    ces.AddEntity({
        "position": {
            "x": 0,
            "y": 0
        },
        "camera": {
            "targetX": 0,
            "targetY": 0
        }
    });

    ces.AddEntity({
        "rendered": {
            "texture": "Player.png",
        },
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
        "rendered": {
            "texture": "Wall.png",
        },
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
        "trigger": {
            "action": () => cameraManager.Shake(10)
        }
    });

    ces.AddEntity({
        "rendered": {
            "texture": "Wall.png"
        },
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
        "rendered": {
            "texture": "Player.png",
        },
        "position": {
            "x": 0,
            "y": 0,
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

    ces.AddEntity({
        "rendered": {
            "texture": "Wall.png"
        },
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
        "rendered": {
            "texture": "Wall.png"
        },
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
