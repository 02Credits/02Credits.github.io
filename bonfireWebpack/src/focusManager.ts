export var focused: boolean;

window.onblur = () => {
  focused = false;
}

window.onfocus = () => {
  focused = true;
}
