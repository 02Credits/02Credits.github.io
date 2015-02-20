var camera, scene, renderer, listener;
var geometry, wallMaterial, floorMaterial, ceilingMaterial, bucketMaterial;
var controls;

var floorMesh, ceilingMesh, mrBucket;

var wallMap;


init();
animate();


var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();

function init() {
    var mapWidth = 16;
    var mapHeight = 16;
    wallMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000);

    var flashlight = new THREE.SpotLight(0xffffff, 2, 10, Math.PI / 2, 30);
    camera.add(flashlight);
    flashlight.position.set(0, 0, 1);
    flashlight.target = camera;

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
    bucketMaterial = new THREE.MeshPhongMaterial({ map: bucketTexture, shininess: 5 });

    for (var x = 0; x < mapWidth; x++) {
        for (var z = 0; z < mapHeight; z++) {
            var middleX = x + 0.5;
            var middleZ = z + 0.5;
            var wallType = wallMap[x][z];
            if (wallType === 1) {
                var cube = new THREE.Mesh(geometry, wallMaterial);
                cube.position.set(middleX, 0.5, middleZ);
                scene.add(cube);
            } else if (wallType === 2) {
                var bucketGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
                mrBucket = new THREE.Mesh(bucketGeometry, bucketMaterial);
                mrBucket.position.set(middleX, 0.5, middleZ);
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
    bucketStrolling.load("Sounds/Mr Bucket strolling.wav");
    bucketStrolling.setRefDistance(1);
    bucketStrolling.setLoop(true);
    mrBucket.add(bucketStrolling);

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

        var previousPosition = new THREE.Vector3();
        previousPosition.copy(controls.getObject().position);
        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateZ(velocity.z * delta);
        var newPosition = new THREE.Vector3();
        newPosition.copy(controls.getObject().position);

        if (wallMap[Math.floor(newPosition.x)][Math.floor(previousPosition.z)] === 1) {
            controls.getObject().position.x = previousPosition.x;
        }
        if (wallMap[Math.floor(previousPosition.x)][Math.floor(newPosition.z)] === 1) {
            controls.getObject().position.z = previousPosition.z;
        }

        var positionDifference = new THREE.Vector3();
        positionDifference.subVectors(controls.getObject().position, mrBucket.position);
        positionDifference.normalize();
        positionDifference.multiplyScalar(0.2 * delta);
        mrBucket.position.add(positionDifference);

        prevTime = time;
    } else {
        prevTime = performance.now();
    }

    floorMesh.position.x = ceilingMesh.position.x = Math.floor(controls.getObject().position.x);
    floorMesh.position.z = ceilingMesh.position.z = Math.floor(controls.getObject().position.z);

    mrBucket.quaternion.copy(camera.quaternion);

    renderer.render(scene, camera);
}