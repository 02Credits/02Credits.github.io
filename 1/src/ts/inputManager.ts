export module InputManager {
    let keys: { [key: string]: boolean } = {};
    var enabled = false;
    var mouseDown = false;
    var mouseX = 0;
    var mouseY = 0;

    var gameDiv = document.getElementById("game");
    gameDiv.onkeydown = (e) => {
        keys[e.key] = true;
    };

    gameDiv.onkeyup = (e) => {
        keys[e.key] = false;
    };

    gameDiv.onmousedown = () => {
        mouseDown = true;
    }

    gameDiv.onmouseup = () => {
        mouseDown = false;
    }

    gameDiv.onmousemove = (e) => {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }

    gameDiv.onmouseenter = () => {
        gameDiv.focus();
        enabled = true;
    }

    gameDiv.onmouseleave = () => {
        enabled = false;
    }

    export function KeyDown(key: string) {
        if (keys[key]) {
            return true;
        } else {
            return false;
        }
    }

    export function MouseState() {
        return {
            mouseDown: mouseDown,
            x: mouseX,
            y: mouseY,
            enabled: enabled
        };
    }
}

export default InputManager;
