import _ from "underscore";
import events from "./events.js"
import ces from "./ces.js"

export default () => {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/json");
    editor.$blockScrolling = Infinity;


    events.Subscribe("ces.update", () => {
        var annotations = editor.getSession().getAnnotations();
        if (!_(annotations).any()) {
            try {
                ces.entities = JSON.parse(editor.getValue());
            } catch (e) {

            }
        }
        if (!editor.isFocused()) {
            editor.setValue(JSON.stringify(ces.entities, null, 4), 0);
        }
        return true;
    });
}
