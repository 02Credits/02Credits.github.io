System.register(["twgl", "./animationManager", "./ces", "./cameraManager", "./collisionManager", "./utils"], function (exports_1, context_1) {
    "use strict";
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
    async function fetchShader(path) {
        let result = await fetch(path);
        return await result.text();
    }
    async function packTextures(images) {
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
    }
    async function loadTextures(basePath, texturePaths) {
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
            await loadedPromise;
            images[path] = image;
        }
        return packTextures(images);
    }
    async function setupTextures(gl, basePath, texturePaths) {
        let result = await loadTextures(basePath, texturePaths);
        document.body.appendChild(result.canvas);
        let texture = twgl.createTexture(gl, {
            src: result.canvas,
        });
        return Object.assign({ texture: texture }, result);
    }
    async function compileProgram(gl, basePath, folder) {
        return twgl.createProgramInfo(gl, [
            await fetchShader(basePath + "assets/Shaders/" + folder + "/vert.glsl"),
            await fetchShader(basePath + "assets/Shaders/" + folder + "/frag.glsl")
        ]);
    }
    async function setCameraUniforms(program) {
        let camera = ces.GetEntities(cameraManager_1.isCamera)[0];
        let cameraCX = camera.position.cx || 0.5;
        let cameraCY = camera.position.cy || 0.5;
        let cameraWidth = (camera.dimensions || obj).width || 100;
        let cameraHeight = (camera.dimensions || obj).height || 100;
        let cameraUniforms = {
            u_camera_dimensions: [camera.position.x, camera.position.y, cameraWidth, cameraHeight]
        };
        twgl.setUniforms(program, cameraUniforms);
    }
    async function clearCanvas(gl, canvas) {
        positionCanvas(canvas, gl);
        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
    function spliceData(array, entityIndex, data) {
        let expectedCount = array.numComponents * 4;
        for (let i = 0; i < expectedCount; i += data.length) {
            utils_1.spliceArray(array.data, entityIndex * expectedCount + i, data);
        }
    }
    async function drawSprites(gl, spriteProgram, textureInfo) {
        gl.useProgram(spriteProgram.program);
        let renderables = ces.GetEntities(isRenderable).sort((a, b) => (a.position.z || 0) - (b.position.z || 0));
        for (let id in spriteArrays) {
            let expectedLength = renderables.length * spriteArrays[id].numComponents;
            if (spriteArrays[id].data.length < expectedLength) {
                spriteArrays[id].data = new Array(expectedLength);
            }
        }
        let index = 0;
        for (let entity of renderables) {
            spliceData(spriteArrays.a_coord, index, [0, 0, 1, 0, 0, 1, 1, 1]);
            spliceData(spriteArrays.a_position, index, [
                entity.position.x,
                entity.position.y,
                entity.position.z || 0
            ]);
            spliceData(spriteArrays.a_texcoord, index, textureInfo.texCoords[entity.texture]);
            spliceData(spriteArrays.a_rotation, index, [entity.rotation || 0]);
            spliceData(spriteArrays.a_dimensions, index, [
                entity.dimensions.width,
                entity.dimensions.height
            ]);
            spliceData(spriteArrays.a_center, index, [
                entity.position.cx || 0.5,
                entity.position.cy || 0.5
            ]);
            spliceData(spriteArrays.a_scale, index, [entity.scale || 1]);
            let offset = index * 4;
            utils_1.spliceArray(spriteArrays.indices.data, index * 6, [offset + 0, offset + 1, offset + 2, offset + 2, offset + 1, offset + 3]);
            index++;
        }
        let bufferInfo = twgl.createBufferInfoFromArrays(gl, spriteArrays);
        twgl.setBuffersAndAttributes(gl, spriteProgram, bufferInfo);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferInfo, renderables.length * 6);
    }
    async function drawDebug(gl, debugProgram) {
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
    }
    async function Setup(texturePaths) {
        let canvas = document.createElement('canvas');
        document.getElementById("game").appendChild(canvas);
        let gl = canvas.getContext('webgl');
        let basePath = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
        canvas.focus();
        let textures = await setupTextures(gl, basePath, texturePaths);
        let spriteProgram = await compileProgram(gl, basePath, "Sprite");
        let debugProgram = await compileProgram(gl, basePath, "Debug");
        animationManager_1.Init.Subscribe(() => {
            gl.useProgram(spriteProgram.program);
            setCameraUniforms(spriteProgram);
            twgl.setUniforms(spriteProgram, {
                u_texmap: textures.texture,
                u_map_dimensions: textures.size
            });
            if (debug) {
                gl.useProgram(debugProgram.program);
                setCameraUniforms(debugProgram);
                twgl.setUniforms(debugProgram, {
                    u_color: [1, 0, 0, 0.5]
                });
            }
        });
        ces.CheckEntity.Subscribe((entity) => {
            if (isRenderable(entity)) {
                entity.color = entity.color || { h: 1, s: 1, v: 1, a: 1 };
            }
            return true;
        });
        animationManager_1.Update.Subscribe(async () => {
            clearCanvas(gl, canvas);
            await drawSprites(gl, spriteProgram, textures);
            if (debug) {
                await drawDebug(gl, debugProgram);
            }
        });
    }
    exports_1("Setup", Setup);
    var twgl, animationManager_1, ces, cameraManager_1, collisionManager_1, utils_1, debug, obj, canvasSize, spriteArrays;
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
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            debug = false;
            obj = {};
            spriteArrays = {
                a_coord: { numComponents: 2, data: new Array(400) },
                a_position: { numComponents: 3, data: new Array(400) },
                a_texcoord: { numComponents: 2, data: new Array(400) },
                a_rotation: { numComponents: 1, data: new Array(400) },
                a_dimensions: { numComponents: 2, data: new Array(400) },
                a_center: { numComponents: 2, data: new Array(400) },
                a_scale: { numComponents: 1, data: new Array(400) },
                indices: { numComponents: 3, data: new Array(400) }
            };
        }
    };
});

//# sourceMappingURL=webglManager.js.map
