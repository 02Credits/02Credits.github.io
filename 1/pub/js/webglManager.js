System.register(["twgl", "./animationManager", "./ces", "./cameraManager", "./collisionManager"], function (exports_1, context_1) {
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
    function isRenderable(entity) { return "texture" in entity; }
    exports_1("isRenderable", isRenderable);
    function positionCanvas(canvas, gl) {
        exports_1("canvasSize", canvasSize = Math.min(window.innerWidth, window.innerHeight) - 100);
        canvas.style.width = canvasSize + "px";
        canvas.style.height = canvasSize + "px";
        canvas.style.marginLeft = -canvasSize / 2 + "px";
        canvas.style.marginTop = -canvasSize / 2 + "px";
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        gl.viewport(0, 0, canvasSize, canvasSize);
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
                    x += image.width + 2;
                    if (x > size) {
                        x = 0;
                        y += rowHeight + 2;
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
                    y += rowHeight + 2;
                    rowHeight = image.height;
                }
                ctx.drawImage(image, x, y);
                imageLayoutInfo[imageData.id] = [
                    x, y,
                    x + image.width, y,
                    x, y + image.height,
                    x + image.width, y + image.height
                ];
                x += image.width + 2;
            }
            return { size: size, canvas: canvas, texCoords: imageLayoutInfo };
        });
    }
    function loadTextures(basePath, texturePaths) {
        return __awaiter(this, void 0, void 0, function* () {
            let images = {};
            for (let path of texturePaths) {
                let imagePath = basePath + "assets/Images/" + path;
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
    function setupTextures(gl, basePath, texturePaths) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield loadTextures(basePath, texturePaths);
            document.body.appendChild(result.canvas);
            let texture = twgl.createTexture(gl, {
                src: result.canvas,
            });
            return Object.assign({ texture: texture }, result);
        });
    }
    function compileProgram(gl, basePath, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            return twgl.createProgramInfo(gl, [
                yield fetchShader(basePath + "assets/Shaders/" + folder + "/vert.glsl"),
                yield fetchShader(basePath + "assets/Shaders/" + folder + "/frag.glsl")
            ]);
        });
    }
    function setCameraUniforms(program) {
        return __awaiter(this, void 0, void 0, function* () {
            let camera = ces.GetEntities(cameraManager_1.isCamera)[0];
            let cameraCX = camera.position.cx || 0.5;
            let cameraCY = camera.position.cy || 0.5;
            let cameraWidth = (camera.dimensions || obj).width || 100;
            let cameraHeight = (camera.dimensions || obj).height || 100;
            let cameraUniforms = {
                u_camera_dimensions: [camera.position.x, camera.position.y, cameraWidth, cameraHeight]
            };
            twgl.setUniforms(program, cameraUniforms);
        });
    }
    function clearCanvas(gl, canvas) {
        return __awaiter(this, void 0, void 0, function* () {
            positionCanvas(canvas, gl);
            gl.clearColor(1, 1, 1, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        });
    }
    function drawSprites(gl, spriteProgram, textureInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            gl.useProgram(spriteProgram.program);
            let batchCount = 0;
            let coords = [];
            let positions = [];
            let texCoords = [];
            let rotations = [];
            let dimensions = [];
            let centers = [];
            let scales = [];
            let indices = [];
            let drawBatch = () => {
                let arrays = {
                    a_coord: { numComponents: 2, data: [].concat.apply([], coords) },
                    a_position: { numComponents: 3, data: [].concat.apply([], positions) },
                    a_texcoord: { numComponents: 2, data: [].concat.apply([], texCoords) },
                    a_rotation: { numComponents: 1, data: [].concat.apply([], rotations) },
                    a_dimensions: { numComponents: 2, data: [].concat.apply([], dimensions) },
                    a_center: { numComponents: 2, data: [].concat.apply([], centers) },
                    a_scale: { numComponents: 1, data: [].concat.apply([], scales) },
                    indices: { numComponents: 3, data: [].concat.apply([], indices) }
                };
                coords = positions = texCoords = rotations = dimensions = centers = scales = indices = [];
                let bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
                twgl.setBuffersAndAttributes(gl, spriteProgram, bufferInfo);
                twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo);
                batchCount = 0;
            };
            for (let entity of ces.GetEntities(isRenderable).sort((a, b) => (a.position.z || 0) - (b.position.z || 0))) {
                coords.push([0, 0, 1, 0, 0, 1, 1, 1]);
                let x = entity.position.x;
                let y = entity.position.y;
                let z = entity.position.z || 0;
                positions.push([x, y, z, x, y, z, x, y, z, x, y, z]);
                texCoords.push(textureInfo.texCoords[entity.texture]);
                let rotation = entity.rotation || 0;
                rotations.push([rotation, rotation, rotation, rotation]);
                let w = entity.dimensions.width;
                let h = entity.dimensions.height;
                dimensions.push([w, h, w, h, w, h, w, h]);
                let scale = entity.scale || 1;
                let cx = entity.position.cx || 0.5;
                let cy = entity.position.cy || 0.5;
                centers.push([cx, cy, cx, cy, cx, cy, cx, cy]);
                scales.push([scale, scale, scale, scale]);
                let offset = batchCount * 4;
                indices.push([0 + offset, 1 + offset, 2 + offset, 2 + offset, 1 + offset, 3 + offset]);
                batchCount++;
            }
            drawBatch();
        });
    }
    function drawDebug(gl, debugProgram) {
        return __awaiter(this, void 0, void 0, function* () {
            gl.useProgram(debugProgram.program);
            let indexOffset = 0;
            let coords = [];
            let indices = [];
            let drawBatch = () => {
                let arrays = {
                    a_coord: { numComponents: 2, data: [].concat.apply([], coords) },
                    indices: { numComponents: 3, data: [].concat.apply([], indices) }
                };
                coords = indices = [];
                indexOffset = 0;
                let bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
                twgl.setBuffersAndAttributes(gl, debugProgram, bufferInfo);
                twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo);
            };
            for (let entity of ces.GetEntities(collisionManager_1.isCollidable).sort((a, b) => (a.position.z || 0) - (b.position.z || 0))) {
                let corners = collisionManager_1.getCorners(entity);
                for (let poly of corners) {
                    coords.push([].concat.apply([], poly));
                    let polyIndices = [];
                    for (let i = 2; i < poly.length; i++) {
                        polyIndices = polyIndices.concat([indexOffset + i, indexOffset, indexOffset + i - 1]);
                    }
                    indices.push(polyIndices);
                    indexOffset += poly.length;
                }
            }
            drawBatch();
        });
    }
    function Setup(texturePaths) {
        return __awaiter(this, void 0, void 0, function* () {
            let canvas = document.createElement('canvas');
            document.getElementById("game").appendChild(canvas);
            let gl = canvas.getContext('webgl');
            let basePath = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
            canvas.focus();
            let textures = yield setupTextures(gl, basePath, texturePaths);
            let spriteProgram = yield compileProgram(gl, basePath, "Sprite");
            let debugProgram = yield compileProgram(gl, basePath, "Debug");
            animationManager_1.Init.Subscribe(() => {
                gl.useProgram(spriteProgram.program);
                setCameraUniforms(spriteProgram);
                twgl.setUniforms(spriteProgram, {
                    u_texmap: textures.texture,
                    u_map_dimensions: textures.size
                });
                gl.useProgram(debugProgram.program);
                setCameraUniforms(debugProgram);
                twgl.setUniforms(debugProgram, {
                    u_color: [1, 0, 0, 0.5]
                });
            });
            ces.CheckEntity.Subscribe((entity) => {
                if (isRenderable(entity)) {
                    entity.color = entity.color || { h: 1, s: 1, v: 1, a: 1 };
                }
                return true;
            });
            animationManager_1.Update.Subscribe(() => __awaiter(this, void 0, void 0, function* () {
                clearCanvas(gl, canvas);
                yield drawSprites(gl, spriteProgram, textures);
                yield drawDebug(gl, debugProgram);
            }));
        });
    }
    exports_1("Setup", Setup);
    var twgl, animationManager_1, ces, cameraManager_1, collisionManager_1, obj, canvasSize;
    return {
        setters: [
            function (twgl_1) {
                twgl = twgl_1;
            },
            function (animationManager_1_1) {
                animationManager_1 = animationManager_1_1;
            },
            function (ces_1) {
                ces = ces_1;
            },
            function (cameraManager_1_1) {
                cameraManager_1 = cameraManager_1_1;
            },
            function (collisionManager_1_1) {
                collisionManager_1 = collisionManager_1_1;
            }
        ],
        execute: function () {
            obj = {};
        }
    };
});

//# sourceMappingURL=webglManager.js.map
