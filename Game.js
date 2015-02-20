var camera, scene, renderer, listener, raycaster, flashlight;
var geometry, wallMaterial, floorMaterial, ceilingMaterial, bucketMaterial;
var controls;

var floorMesh, ceilingMesh, mrBucket;

var wallMap;
var intersectObjects = [];

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();

var announced = false;
var warned = false;
var music = false;
var rewardMusicPlayed = false;
var musicTime = -1000000;

var step = false;
var stepTime = -100000;
var stepSpacing = 500;
var stepSound;

var mapWidth = 16;
var mapHeight = 16;

init();
animate();

function init() {
    wallMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 9, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 2, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1]
    ];

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 1000);

    flashlight = new THREE.SpotLight(0xffffff, 2, 10, Math.PI / 2, 30);
    camera.add(flashlight);
    flashlight.position.set(0.01, 0, 1);
    flashlight.target = camera;

    raycaster = new THREE.Raycaster();
    raycaster.near = 0;
    raycaster.far = 5;

    scene = new THREE.Scene();

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    var onKeyDown = function (event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
        }
    };

    var onKeyUp = function (event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }
    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    geometry = new THREE.BoxGeometry(1, 1, 1);
    var wallTexture = THREE.ImageUtils.loadTexture("Textures/WallTexture.png");
    wallTexture.minFilter = wallTexture.magFilter = THREE.NearestFilter;
    wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture, shininess: 5 });

    var bucketTexture = THREE.ImageUtils.loadTexture("Textures/MisterBucket.png");
    bucketTexture.minFilter = bucketTexture.magFilter = THREE.NearestFilter;
    bucketMaterial = new THREE.MeshPhongMaterial({ map: bucketTexture, shininess: 5, transparent: true });

    for (var x = 0; x < mapWidth; x++) {
        for (var z = 0; z < mapHeight; z++) {
            var middleX = x + 0.5;
            var middleZ = z + 0.5;
            var wallType = wallMap[x][z];
            if (wallType === 1) {
                var cube = new THREE.Mesh(geometry, wallMaterial);
                cube.position.set(middleX, 0.5, middleZ);
                intersectObjects.push(cube);
                scene.add(cube);
            } else if (wallType === 2) {
                var bucketGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
                mrBucket = new THREE.Mesh(bucketGeometry, bucketMaterial);
                mrBucket.position.set(middleX, 0.5, middleZ);
                intersectObjects.push(mrBucket);
                scene.add(mrBucket);
            } else if (wallType === 9) {
                controls.getObject().position.set(middleX, 0.5, middleZ);
            }
        }
    }

    geometry = new THREE.PlaneGeometry(32, 32, 1, 1);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    var floorTexture = THREE.ImageUtils.loadTexture("Textures/FloorTexture.png");
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.x = floorTexture.repeat.y = 32;
    floorTexture.minFilter = floorTexture.magFilter = THREE.NearestFilter;
    floorMaterial = new THREE.MeshPhongMaterial({ map: floorTexture, shininess: 5 });
    floorMesh = new THREE.Mesh(geometry, floorMaterial);
    scene.add(floorMesh);

    geometry = new THREE.PlaneGeometry(32, 32, 1, 1);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    var ceilingTexture = THREE.ImageUtils.loadTexture("Textures/CeilingTexture.png");
    ceilingTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping;
    ceilingTexture.repeat.x = ceilingTexture.repeat.y = 32;
    ceilingTexture.minFilter = ceilingTexture.magFilter = THREE.NearestFilter;
    ceilingMaterial = new THREE.MeshPhongMaterial({ map: ceilingTexture, shininess: 5 });
    ceilingMesh = new THREE.Mesh(geometry, ceilingMaterial);
    ceilingMesh.translateY(1);
    scene.add(ceilingMesh);

    listener = new THREE.AudioListener();
    camera.add(listener);

    var bucketStrolling = new THREE.Audio(listener);
    bucketStrolling.load("Sounds/Mr Bucket strolling.ogg");
    bucketStrolling.setRefDistance(20);
    bucketStrolling.setLoop(true);
    bucketStrolling.gain.gain.value = 0.5;
    mrBucket.add(bucketStrolling);

    var spoopyMusic = new THREE.Audio(listener);
    spoopyMusic.load("Sounds/Mr bucket slow.ogg");
    spoopyMusic.setRefDistance(20);
    spoopyMusic.setLoop(true);
    spoopyMusic.gain.gain.value = 0.05;
    flashlight.add(spoopyMusic);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function animate() {
    requestAnimationFrame(animate);

    if (controlsEnabled) {
        var time = performance.now();
        var delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        if (moveForward) velocity.z -= 20.0 * delta;
        if (moveBackward) velocity.z += 20.0 * delta;
        if (moveLeft) velocity.x -= 20.0 * delta;
        if (moveRight) velocity.x += 20.0 * delta;

        if (moveForward || moveBackward || moveLeft || moveRight) {
            if (time - stepTime > stepSpacing) {
                stepTime = time;
                step = !step;
                var fileName = "Sounds/Steps/";
                if (step) {
                    fileName = fileName + "L";
                } else {
                    fileName = fileName + "R";
                }
                if (stepSound != null) {
                    flashlight.remove(stepSound);
                }
                fileName = fileName + (Math.floor(Math.random() * 7) + 1) + ".wav";
                stepSound = new THREE.Audio(listener);
                stepSound.load(fileName);
                stepSound.setRefDistance(20);
                flashlight.add(stepSound);
            }
        }

        var positionDifference = new THREE.Vector3();
        positionDifference.subVectors(controls.getObject().position, mrBucket.position);
        var previousPosition = new THREE.Vector3();
        var newPosition = new THREE.Vector3();
        var posDelta = new THREE.Vector3();

        if (positionDifference.length() > 0.4) {
            previousPosition.copy(controls.getObject().position);
            controls.getObject().translateX(velocity.x * delta);
            controls.getObject().translateZ(velocity.z * delta);
            newPosition.copy(controls.getObject().position);

            posDelta.copy(newPosition);
            posDelta.sub(previousPosition);
            var playerRadius = 0.1;

            if (newPosition.x > 0 && newPosition.x < mapWidth && newPosition.z > 0 && newPosition.z < mapHeight) {
                if (posDelta.x > 0) {
                    if (wallMap[Math.floor(newPosition.x + playerRadius)][Math.floor(previousPosition.z)] === 1) {
                        controls.getObject().position.x = previousPosition.x;
                    }
                } else {
                    if (wallMap[Math.floor(newPosition.x - playerRadius)][Math.floor(previousPosition.z)] === 1) {
                        controls.getObject().position.x = previousPosition.x;
                    }
                }

                if (posDelta.z > 0) {
                    if (wallMap[Math.floor(previousPosition.x)][Math.floor(newPosition.z + playerRadius)] === 1) {
                        controls.getObject().position.z = previousPosition.z;
                    }
                } else {
                    if (wallMap[Math.floor(previousPosition.x)][Math.floor(newPosition.z - playerRadius)] === 1) {
                        controls.getObject().position.z = previousPosition.z;
                    }
                }
            } else {
                if (!rewardMusicPlayed) {
                    rewardMusicPlayed = true;
                    var rewardMusic = new THREE.Audio(listener);
                    rewardMusic.load("Sounds/Mr Bucket Normal.ogg");
                    rewardMusic.setRefDistance(20);
                    rewardMusic.setLoop(true);
                    flashlight.exponent = 5;
                    flashlight.add(rewardMusic);
                }
            }
        }

        previousPosition.copy(mrBucket.position);
        positionDifference.normalize();
        positionDifference.multiplyScalar(0.7 * delta);
        mrBucket.position.add(positionDifference);
        newPosition.copy(mrBucket.position);

        posDelta.copy(newPosition);
        posDelta.sub(previousPosition);
        var bucketRadius = 0.4;

        if (newPosition.x > 0 && newPosition.x < mapWidth && newPosition.z > 0 && newPosition.z < mapHeight) {
            if (posDelta.x > 0) {
                if (wallMap[Math.floor(newPosition.x + bucketRadius)][Math.floor(previousPosition.z)] === 1) {
                    mrBucket.position.x = previousPosition.x;
                }
            } else {
                if (wallMap[Math.floor(newPosition.x - bucketRadius)][Math.floor(previousPosition.z)] === 1) {
                    mrBucket.position.x = previousPosition.x;
                }
            }

            if (posDelta.z > 0) {
                if (wallMap[Math.floor(previousPosition.x)][Math.floor(newPosition.z + bucketRadius)] === 1) {
                    mrBucket.position.z = previousPosition.z;
                }
            } else {
                if (wallMap[Math.floor(previousPosition.x)][Math.floor(newPosition.z - bucketRadius)] === 1) {
                    mrBucket.position.z = previousPosition.z;
                }
            }
        }

        prevTime = time;
    } else {
        prevTime = performance.now();
    }

    floorMesh.position.x = ceilingMesh.position.x = Math.floor(controls.getObject().position.x);
    floorMesh.position.z = ceilingMesh.position.z = Math.floor(controls.getObject().position.z);

    mrBucket.quaternion.copy(controls.getObject().quaternion);

    rayCast(10, false,
        function() {
            if (!announced) {
                var announcement = new THREE.Audio(listener);
                announcement.load("Sounds/Hey! I'm Mr Bucket.ogg");
                announcement.setRefDistance(20);
                mrBucket.add(announcement);
                announced = true;
            }
        },
        function() {
            announced = false;
        });

    rayCast(1, false,
        function() {
            if (!warned) {
                var warning = new THREE.Audio(listener);
                warning.load("Sounds/I'm gonna.wav");
                warning.setRefDistance(20);
                mrBucket.add(warning);
                warned = true;
            }
        },
        function() {
            warned = false;
        });

    rayCast(5, true,
        function() {
            if (!music && time - musicTime > 15000) {
                var screwed = new THREE.Audio(listener);
                screwed.load("Sounds/Mr Bucket screwed.ogg");
                screwed.setRefDistance(20);
                mrBucket.add(screwed);
                music = true;
                musicTime = time;
            }
        },
        function () {
            music = false;
        });

    renderer.render(scene, camera);
}

function rayCast(distance, any, inViewCallback, notInViewCallback) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.far = distance;
    var directionVector = new THREE.Vector3();
    directionVector.copy(mrBucket.position);
    directionVector.sub(controls.getObject().position);
    directionVector.normalize();
    raycaster.ray.direction.copy(directionVector);
    var intersectedObjects = raycaster.intersectObjects(intersectObjects);

    var success = false;
    if (!any) {
        success = intersectedObjects.length !== 0 && intersectedObjects[0].object === mrBucket;
    } else {
        for (var i = 0; i < intersectedObjects.length; i++) {
            if (intersectedObjects[i].object === mrBucket) {
                success = true;
            }
        }
    }

    if (success) {
        inViewCallback();
    } else {
        notInViewCallback();
    }
}