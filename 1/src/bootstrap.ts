/// <reference path="../typings/index.d.ts"/>

import ces from "./ces.js";
import pixiManager from "./pixiManager.js";
import editorManager from "./editorManager.js";

pixiManager();

var startEntities = JSON.parse(`[
    {
        "rendered": {
            "texture": "Player.png"
        },
        "position": {
            "x": 0,
            "y": 0,
            "cx": 0,
            "cy": 0
        },
        "id": 0
    }
]`)

_(startEntities).each((entity) => {
    ces.AddEntity(entity);
})

editorManager();
