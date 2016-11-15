var Container = PIXI.Container, autoDetectRenderer = PIXI.autoDetectRenderer, loader = PIXI.loader, resources = PIXI.loader.resources, Sprite = PIXI.Sprite;
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { antialias: false, transparent: false, resolution: 1 });
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
renderer.render(stage);
loader
    .add("images/keith.png")
    .load(setup);
var cat;
function setup() {
    cat = new Sprite(resources["images/keith.png"].texture);
    cat.y = 96;
    cat.vx = 0;
    cat.vy = 0;
    stage.addChild(cat);
    var left = keyboard(37), up = keyboard(38), right = keyboard(39), down = keyboard(40);
    left.press = function () {
        cat.vx = -5;
        cat.vy = 0;
    };
    left.release = function () {
        if (!right.isDown && cat.vy === 0) {
            cat.vx = 0;
        }
    };
    up.press = function () {
        cat.vy = -5;
        cat.vx = 0;
    };
    up.release = function () {
        if (!down.isDown && cat.vx === 0) {
            cat.vy = 0;
        }
    };
    right.press = function () {
        cat.vx = 5;
        cat.vy = 0;
    };
    right.release = function () {
        if (!left.isDown && cat.vy === 0) {
            cat.vx = 0;
        }
    };
    down.press = function () {
        cat.vy = 5;
        cat.vx = 0;
    };
    down.release = function () {
        if (!up.isDown && cat.vx === 0) {
            cat.vy = 0;
        }
    };
    gameLoop();
}
function gameLoop() {
    requestAnimationFrame(gameLoop);
    play();
    renderer.render(stage);
}
function play() {
    cat.x += cat.vx;
    cat.y += cat.vy;
    cat.rotation += 0.1;
}
function keyboard(keyCode) {
    var key = {
        code: keyCode,
        isDown: false,
        isUp: true
    };
    key.isDownHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press)
                key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };
    key.isUpHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release)
                key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };
    window.addEventListener("keydown", key.isDownHandler.bind(key), false);
    window.addEventListener("keyup", key.isUpHandler.bind(key), false);
    return key;
}
//# sourceMappingURL=index.js.map