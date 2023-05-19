
/*
Shoot
 *
 * Kids shouldn't have to write this code, unless they are being
 * taught more about the math / physics behind getting the direction
 * to shoot a ball based on a 3D transformed object.
 *
 */

var myScene = document.getElementById('myScene');
var myCamera = document.getElementById('myCamera');

function getDirection(camera, speed) {
    // you can find this code snippet at
    // https://pastebin.com/B4fJ4yBg
    var y = camera.getAttribute('rotation').y + 90;
    var x = camera.getAttribute('rotation').x;

    var moveX = Math.cos(y / 360 * (Math.PI * 2));
    var moveY = Math.sin(x / 360 * (Math.PI * 2));
    var moveZ = Math.sin(y / 360 * (Math.PI * 2));
    var moveXRatio = (Math.pow(moveX, 2)) / (Math.pow(moveX, 2) + Math.pow(moveZ, 2));
    var moveZRatio = (Math.pow(moveZ, 2)) / (Math.pow(moveX, 2) + Math.pow(moveZ, 2));

    if (moveX <= 0) {
        moveX = -Math.sqrt((1 - Math.pow(moveY, 2)) * moveXRatio);
    } else {
        moveX = Math.sqrt((1 - Math.pow(moveY, 2)) * moveXRatio);
    }

    if (moveZ <= 0) {
        moveZ = -Math.sqrt((1 - Math.pow(moveY, 2)) * moveZRatio);
    } else {
        moveZ = Math.sqrt((1 - Math.pow(moveY, 2)) * moveZRatio);
    }

    return { x: moveX * speed, y: moveY * speed, z: -moveZ * speed };
}


