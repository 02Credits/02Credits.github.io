System.register(["twgl", "./animationManager"], function (exports_1, context_1) {
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __moduleName = context_1 && context_1.id;
    function positionCanvas(canvas, gl) {
        let size = Math.min(window.innerWidth, window.innerHeight) - 100;
        canvas.style.width = size + "px";
        canvas.style.height = size + "px";
        canvas.style.marginLeft = -size / 2 + "px";
        canvas.style.marginTop = -size / 2 + "px";
        gl.viewport(0, 0, size, size);
        return size;
    }
    function fetchShader(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield fetch(path);
            return yield result.text();
        });
    }
    function packTextures(images) {
        return __awaiter(this, void 0, void 0, function* () {
            let imageArray = [];
            for (let id in images) {
                imageArray.push({ image: images[id], id: id });
            }
            imageArray = imageArray.sort((a, b) => a.image.height - b.image.height);
            let size = 16;
            let correctSize = true;
            do {
                correctSize = true;
                size *= 2;
                let x = 0;
                let y = 0;
                let rowHeight = imageArray[0].image.height;
                for (let imageData of imageArray) {
                    let image = imageData.image;
                    x += image.width;
                    if (x > size) {
                        x = 0;
                        y += rowHeight;
                        if (y + image.height > size) {
                            correctSize = false;
                            break;
                        }
                        rowHeight = image.height;
                    }
                }
            } while (!correctSize);
            let canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            let ctx = canvas.getContext('2d');
            let x = 0;
            let y = 0;
            let rowHeight = imageArray[0].image.height;
            let imageLayoutInfo = {};
            for (let imageData of imageArray) {
                let image = imageData.image;
                if (x + image.width > size) {
                    x = 0;
                    y += rowHeight;
                    rowHeight = image.height;
                }
                ctx.drawImage(image, x, y);
                imageLayoutInfo[imageData.id] = [
                    x, y,
                    x + image.width, y,
                    x, y + image.height,
                    x + image.width, y,
                    x, y + image.height,
                    x + image.width, y + image.height
                ];
                x += image.width;
            }
            return { size: size, canvas: canvas, texCoords: imageLayoutInfo };
        });
    }
    function loadTextures(basePath, texturePaths) {
        return __awaiter(this, void 0, void 0, function* () {
            let images = {};
            for (let path of texturePaths) {
                let imagePath = basePath + "assets/" + path;
                let image = new Image();
                let loadedPromise = new Promise((resolve) => {
                    let handler = () => {
                        resolve();
                        image.removeEventListener('load', handler);
                    };
                    image.addEventListener('load', handler, false);
                    image.src = imagePath;
                });
                yield loadedPromise;
                images[path] = image;
            }
            return packTextures(images);
        });
    }
    function Setup(texturePaths) {
        return __awaiter(this, void 0, void 0, function* () {
            let canvas = document.createElement('canvas');
            document.getElementById("game").appendChild(canvas);
            let gl = canvas.getContext('webgl');
            let basePath = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
            let result = yield loadTextures(basePath, texturePaths);
            document.body.appendChild(result.canvas);
            canvas.focus();
            let programInfo = twgl.createProgramInfo(gl, [
                yield fetchShader(basePath + "assets/vert.glsl"),
                yield fetchShader(basePath + "assets/frag.glsl")
            ]);
            let texture = twgl.createTexture(gl, {
                src: result.canvas,
                wrap: gl.CLAMP_TO_EDGE,
                mag: gl.NEAREST
            });
            gl.useProgram(programInfo.program);
            let mapUniforms = {
                u_map_dimensions: result.size
            };
            twgl.setUniforms(programInfo, mapUniforms);
            animationManager_1.Update.Subscribe(() => {
                let displaySize = positionCanvas(canvas, gl);
                gl.clearColor(1, 1, 1, 1);
                gl.clear(gl.COLOR_BUFFER_BIT);
                let displayUniforms = {
                    u_display_dimensions: displaySize
                };
                twgl.setUniforms(programInfo, displayUniforms);
                let texCoords = result.texCoords["Player.png"];
                let arrays = {
                    a_position: { numComponents: 2, data: [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1] },
                    a_texcoord: { numComponents: 2, data: texCoords }
                };
                let bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
                twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
                twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo);
            });
        });
    }
    exports_1("Setup", Setup);
    var twgl, animationManager_1;
    return {
        setters: [
            function (twgl_1) {
                twgl = twgl_1;
            },
            function (animationManager_1_1) {
                animationManager_1 = animationManager_1_1;
            }
        ],
        execute: function () {
        }
    };
});

//# sourceMappingURL=webglManager.js.map
