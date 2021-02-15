var canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var ballX = canvas.width/2;
var ballY = canvas.height/2;
var directionX = 2;
var directionY = 2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;
var brickRowCount = 3;
var brickColumnCount = 25;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 50;
var score = 0;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r] = { x: brickX, y: brickY, visible: true};
    }
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].visible) {
                ctx.beginPath();
                ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


document.addEventListener("keydown", keyDownHandler, false);


function keyDownHandler(e) {
    if ((e.key === 'Right' || e.key === "ArrowRight") && (paddleX < canvas.width - paddleWidth)) 
    {
        paddleX += 15;
    }
    else if(e.key === "Left" && paddleX > 0 || e.key === "ArrowLeft" && paddleX > 0) {
        paddleX -= 15;
    }
}


function detectBrickCollision() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var brick = bricks[c][r];
            if(ballX + ballRadius >= brick.x && ballX + ballRadius <= brick.x + brickWidth && ballY + ballRadius >= brick.y && ballY + ballRadius <= brick.y + brickHeight) {
                directionY = -directionY;
                brick.visible = false;
            }
        }
    }
}


function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}


function detectWindowCollision() {
    if(ballX + directionX > canvas.width-ballRadius || ballX + directionX < ballRadius) {
        directionX = -directionX;
    }
    if(ballY + directionY < ballRadius) {
        directionY = -directionY;
    }
    else if(ballY + directionY > canvas.height-ballRadius) {
        if(ballX > paddleX && ballX < paddleX + paddleWidth) {
           if(ballY= ballY-paddleHeight){
            directionY = -directionY  ;
             }
        }
        else {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
        }
    }
}

function ballMovement() {
    ballX += directionX;
    ballY += directionY;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ballMovement();
    detectWindowCollision();
    detectBrickCollision();
    drawBricks();
    drawBall();
    drawPaddle();
 
}

var interval = setInterval(draw, 10);

