import ces from "./ces";
import pixiManager from "./pixiManager";
import playerManager from "./playerManager";
import collisionManager from "./collisionManager";
import parentManager from "./parentManager";
import cameraManager from "./cameraManager";
import triggerManager from "./triggerManager";
import wallManager from "./wallManager";
import holeManager from "./holeManager";
import statueManager from "./statueManager";
import animationManager from "./animationManager";
import timeManager from "./timeManager";
import events from "./events";

pixiManager(["Wall.png", "Player.png"]).then(() => {
    collisionManager();
    playerManager();
    parentManager();
    cameraManager();
    triggerManager();
    wallManager();
    holeManager();
    statueManager();

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
        "collider": true,
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
            "action":`events.Publish("camera.shake", 10);`
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
        "collider": true,
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

    events.Subscribe("ces.update.collidable", (collidable: any) => {
        if (!("rotation" in collidable.position)) {
            collidable.position.rotation = 0;
        }
        collidable.position.rotation += 0.01
    });
});
