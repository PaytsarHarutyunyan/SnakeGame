const container = document.getElementById('container');
const txt = document.getElementById('txt');

container.addEventListener('click', function() {
    txt.focus();
});

let snakeBody, food, direction, allowedToMove, isPlaying;
let map;
let speed = 2;
let play;

function initializeVariables() {
    snakeBody = [[0, 0]];
    food = 0;
    direction = "Right";
    allowedToMove = false;
    isPlaying = false;
}

function initializeGameState(mapElementId) {
    map = document.getElementById(mapElementId);
    initializeVariables();

    for (let i = 0; i < 100; i++) {
        let pixel = document.createElement("div");
        pixel.setAttribute("class", "pixel");
        map.appendChild(pixel);
    }

    map.children[0].classList.add("snake-body");
    generateFood();
}

function generateFood() {
    
    while (map.children[food].classList.contains("snake-body")) {
        food = Math.floor(Math.random() * 100);
    }
    
    map.children[food].classList.add("food");
}

function startGame() {
    if (!isPlaying) {
        allowedToMove = true;
        play = setInterval(updatePosition, 1000 / speed);
        document.getElementById("menu").style.display = "none";
        document.getElementById("map").style.display = "";
        isPlaying = true;
    }
}

function pauseGame() {
    if (isPlaying) {
        allowedToMove = false;
        clearInterval(play);
        document.getElementById("menu-text").innerText = "PAUSED\nPress ENTER to resume";
        document.getElementById("menu").style.display = "";
        document.getElementById("map").style.display = "none";
        isPlaying = false;
    }
}

function gameOver() {
    clearInterval(play);
    document.getElementById("menu-text").innerText = "Game Over\nYour Score: " 
        + (snakeBody.length - 1) + "\nPress ENTER to restart";
    document.getElementById("menu").style.display = "";
    document.getElementById("map").style.display = "none";
    map.innerText = ""; 
    initializeGameState(map.id);
}

function updatePosition() {
    let newPosR, newPosC;
    let head = snakeBody[snakeBody.length - 1];

    switch (direction) {
        case "Up":
            newPosR = head[0] - 1;
            newPosC = head[1];
            break;
        case "Down":
            newPosR = head[0] + 1;
            newPosC = head[1];
            break;
        case "Left":
            newPosR = head[0];
            newPosC = head[1] - 1;
            break;
        case "Right":
            newPosR = head[0];
            newPosC = head[1] + 1;
            break;
        default:
            break;
    }
    
    if (newPosR < 0 || newPosR > 9 || newPosC < 0 || newPosC > 9) {
        gameOver();
    } else {
        snakeBody.push([newPosR, newPosC]);
        updateScreen();
        allowedToMove = true;
    }
}

function updateScreen() {
    let tailArray = snakeBody.shift();

    let tail = parseInt(tailArray[0] + "" + tailArray[1]);

    let headArray = snakeBody[snakeBody.length - 1];

    let head = parseInt(headArray[0] + "" + headArray[1]);

    
    if (map.children[head].classList.contains("snake-body")) {
        gameOver();
    } else {
        
        map.children[head].classList.add("snake-body");

        map.children[tail].classList.remove("snake-body");

        if (head == food) {
            map.children[food].classList.remove("food");
            snakeBody.unshift(tailArray);

            snakeBody.length === 100 && gameOver();
            generateFood();
        }
    }
}

document.onkeydown = keyPress;

function keyPress(e) {
    e.preventDefault();
    e = e || window.event;

    
    e.keyCode == 27 && pauseGame();

    e.keyCode == 13 && startGame();
    let up = 38;
    let down = 40;
    let left = 37;
    let right = 39;

    if (allowedToMove) {
        allowedToMove = false;
        switch (e.keyCode) {
            case left:
                direction != "Right" && (direction = "Left");
                break;
            case up:
                direction != "Down" && (direction = "Up");
                break;
            case right:
                direction != "Left" && (direction = "Right");
                break;
            case down:
                direction != "Up" && (direction = "Down");
                break;
            default:
                allowedToMove = true;
                break;
        }
    }
}

initializeGameState("map");
