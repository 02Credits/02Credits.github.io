System.register(["underscore", "./events.js", "./ces.js"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var underscore_1, events_js_1, ces_js_1;
    return {
        setters:[
            function (underscore_1_1) {
                underscore_1 = underscore_1_1;
            },
            function (events_js_1_1) {
                events_js_1 = events_js_1_1;
            },
            function (ces_js_1_1) {
                ces_js_1 = ces_js_1_1;
            }],
        execute: function() {
            exports_1("default",function () {
                var editor = ace.edit("editor");
                editor.setTheme("ace/theme/monokai");
                editor.getSession().setMode("ace/mode/json");
                editor.$blockScrolling = Infinity;
                events_js_1.default.Subscribe("ces.update", function () {
                    var annotations = editor.getSession().getAnnotations();
                    if (!underscore_1.default(annotations).any()) {
                        try {
                            ces_js_1.default.entities = JSON.parse(editor.getValue());
                        }
                        catch (e) {
                        }
                    }
                    if (!editor.isFocused()) {
                        editor.setValue(JSON.stringify(ces_js_1.default.entities, null, 4), 0);
                    }
                    return true;
                });
            });
        }
    }
});
//# sourceMappingURL=editorManager.js.map