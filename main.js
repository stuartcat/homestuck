//idk what to do tbh :/
var platpos = 1.5
var onplatform = false;
var falling = false;
let player = document.getElementById('player');
let position = 0;
let yPosition = 0;
let movingRight = false;
let movingLeft = false;
var jumpextend = false;
let jumping = false;
let movementSpeed = 0.2;
let jumpSpeed = 0.5;
let gravity = 0.1;
var lastdirection = "right";
var onplatform2 = false;
let floorHeight = 50;

let platform = document.getElementById('platform');
let wall = document.getElementById('wall');

let walkingAnimationInterval;
let isWalking = false;
let animationFrame = 0;

function onplatform() {
    let playerRect = player.getBoundingClientRect();
    let platformRect = platform.getBoundingClientRect();

    if (
        playerRect.bottom <= platformRect.top &&
        playerRect.bottom >= platformRect.top - platformRect.height &&
        playerRect.right > platformRect.left &&
        playerRect.left < platformRect.right
    ) {
        return true;
    } else {
        return false;
    }
}

document.addEventListener("keydown", function(event) {
    if (event.key === "r") {
        if (position < 2) {
            console.log(position)
        } else {}
    }
})

function updatePlayerImage() {
    if (jumping) {
        if (lastdirection === "right") {
            player.src = "sprites/rightidle.png"
        } else { player.src = "sprites/leftidle.png"}
    } else if (movingRight) {
        if (isWalking) {
            player.src = (animationFrame % 2 === 0) ? 'sprites/rightwalk.png' : 'sprites/rightidle.png';
        }
    } else if (movingLeft) {
        if (isWalking) {
            player.src = (animationFrame % 2 === 0) ? 'sprites/leftwalk.png' : 'sprites/leftidle.png';
        }
    } else {
        if (lastdirection === "right") {
            player.src = 'sprites/rightidle.png';
        } else {
            player.src = 'sprites/leftidle.png';
        }
    }
}

function updatePlayer() {
    player.style.transform = `translateX(${position * 30}px)`;
    player.style.bottom = `${yPosition * 30 + floorHeight}px`;
    updatePlayerImage();
}

function startMoving() {
    if (movingRight && !checkWallCollision('right')) {
        position += movementSpeed;
        if (position < platpos) {

        }
    } else if (movingLeft && !checkWallCollision('left')) {
        position -= movementSpeed;
        if (position < platpos) {
            if (yPosition === 2.9) {

                onplatform2 = false;
                jump()}
        }
    }
    updatePlayer();
}

function stopMoving() {
    updatePlayer();
    isWalking = false;
}

function checkWallCollision(direction) {
    let playerRect = player.getBoundingClientRect();
    let wallRect = wall.getBoundingClientRect();

    if (direction === 'right' && playerRect.right >= wallRect.left && playerRect.left < wallRect.left) {
        return true;
    }
    if (direction === 'left' && playerRect.left <= wallRect.right && playerRect.right > wallRect.right) {
        return true;
    }
    return false;
}

function jump() {
    if (!jumping) {
        jumping = true;
        let peakReached = false;

        let jumpInterval = setInterval(() => {
            if (!peakReached) {
                if (position < platpos) {
                    if (yPosition === 2.9) { 
                        peakReached = true;}
                }
                if (position > platpos) {
                    if (yPosition === 0) {
                        peakReached = true;
                    }
                }
                yPosition += jumpSpeed;
                if (jumpextend) {
                    if (yPosition >= 6) {
                        peakReached = true;
                    }
                } else {
                    if (yPosition >= 5) {
                        peakReached = true;
                    }
                }
            } else {
                yPosition -= gravity;
            }

            let playerRect = player.getBoundingClientRect();
            let platformRect = platform.getBoundingClientRect();

            if (
                playerRect.bottom <= platformRect.top &&
                playerRect.bottom >= platformRect.top - platformRect.height &&
                playerRect.right > platformRect.left &&
                playerRect.left < platformRect.right
            ) {
                if (onplatform2) {
                    onplatform2 = false;
                    jumpextend = true;
                } else {

                    onplatform2 = true;
                    falling = false;
                    yPosition = 2.9;
                    clearInterval(jumpInterval);
                    jumping = false;}
            }

            if (yPosition <= 0) {
                falling = false;
                jumpextend = false;
                yPosition = 0;
                clearInterval(jumpInterval);
                jumping = false;
            }

            updatePlayer();
        }, 30);
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === "ArrowRight" && !movingRight) {
        movingRight = true;
        lastdirection = "right";
        isWalking = true;
        if (!walkingAnimationInterval) {
            walkingAnimationInterval = setInterval(() => {
                animationFrame++;
                updatePlayerImage();
            }, 200);
        }
    } else if (event.key === "ArrowLeft" && !movingLeft) {
        movingLeft = true;
        isWalking = true;
        lastdirection = "left";
        if (!walkingAnimationInterval) {
            walkingAnimationInterval = setInterval(() => {
                animationFrame++;
                updatePlayerImage();
            }, 200);
        }
    } else if (event.key === " " && !jumping) {
        jump();
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === "ArrowRight") {
        movingRight = false;
    } else if (event.key === "ArrowLeft") {
        movingLeft = false;
    }

    if (!movingRight && !movingLeft) {
        clearInterval(walkingAnimationInterval);
        walkingAnimationInterval = null;
        stopMoving();
    }
});

function gameLoop() {
    startMoving();
    requestAnimationFrame(gameLoop);
}

gameLoop();
updatePlayer();
