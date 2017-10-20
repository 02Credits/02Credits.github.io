export function withKey(key: string | string[], callback: (key: string) => void) {
  return function(e: KeyboardEvent) {
    var ch = String.fromCharCode(e.keyCode);
    if (!Array.isArray(key)) {
      key = [key];
    }

    if (key.indexOf(ch) != -1) {
      callback(ch);
    }
  };
}
