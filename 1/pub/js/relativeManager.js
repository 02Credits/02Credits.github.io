System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function wrap(source) {
        let obj = source;
        let wrapped = obj;
        for (let key in obj) {
            let propType = typeof obj[key];
            if (propType == "number") {
                wrapped[key] = (prop) => {
                    if (prop) {
                        obj[key] = prop;
                    }
                    let result = obj[key];
                    let sumKey = "+" + key;
                    if (sumKey in obj) {
                        result += obj[sumKey];
                    }
                    let subKey = "-" + key;
                    if (subKey in obj) {
                        result -= obj[subKey];
                    }
                    let prodKey = "*" + key;
                    if (prodKey in obj) {
                        result *= obj[prodKey];
                    }
                    let divKey = "/" + key;
                    if (divKey in obj) {
                        result /= obj[divKey];
                    }
                    return result;
                };
            }
            else if (propType == "string") {
                wrapped[key] = (prop) => {
                    if (prop) {
                        obj[key] = prop;
                    }
                    let result = obj[key];
                    let sumKey = "+" + key;
                    if (sumKey in obj) {
                        result += obj[sumKey];
                    }
                    return result;
                };
            }
            else {
                let wrappedProp = wrap(obj[key]);
                wrapped[key] = (prop) => {
                    if (prop) {
                        obj[key] = prop;
                    }
                    return wrappedProp;
                };
            }
        }
        wrapped.unwrap = obj;
        return wrapped;
    }
    exports_1("wrap", wrap);
    return {
        setters: [],
        execute: function () {
        }
    };
});

//# sourceMappingURL=relativeManager.js.map
