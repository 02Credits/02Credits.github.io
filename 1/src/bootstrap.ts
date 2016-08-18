/// <reference path="../typings/index.d.ts"/>

import ces from "./ces.js";
import pixiManager from "./pixiManager.js";
import editorManager from "./editorManager.js";

pixiManager();
ces.AddEntity({rendered: {texture: "player.png"}, position: {x: 0, y: 0, cx: 0.5, cy: 0.5}});

editorManager();
