import ces from "./ces";
import pixiManager from "./pixiManager";
import playerManager from "./playerManager";
import collisionManager from "./collisionManager";

pixiManager(["Wall.png", "Player.png"]).then(() => {
    collisionManager();
    playerManager();

    var startEntities = [
        {
            "position": {
                "x": 0,
                "y": 0
            },
            "camera": true
        },
        {
            "rendered": {
                "texture": "Wall.png"
            },
            "position": {
                "x": 200,
                "y": 200,
                "cx": 0.5,
                "cy": 0.5
            },
            "dimensions": {
                "width": 50,
                "height": 50
            },
            "collidable": true,
            "wall": true
        },
        {
            "rendered": {
                "texture": "Wall.png"
            },
            "position": {
                "x": 400,
                "y": 200,
                "cx": 0.5,
                "cy": 0.5
            },
            "dimensions": {
                "width": 200,
                "height": 200
            },
            "collidable": true,
            "hole": {
                "steepness": 0.12
            }
        },
        {
            "rendered": {
                "texture": "Player.png"
            },
            "position": {
                "x": 0,
                "y": 0,
                "cx": 0.5,
                "cy": 0.5
            },
            "collider": true,
            "player": {
                "stepSpeed": 0.03,
                "stepSize": 0.8
            }
        },
        {
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
                "width": 10,
                "height": 10
            },
            "foot": {
                "x": -10
            }
        },
        {
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
                "width": 10,
                "height": 10
            },
            "foot": {
                "x": 10
            }
        }
    ];

    for (let entity of startEntities) {
        ces.AddEntity(entity);
    }
});
