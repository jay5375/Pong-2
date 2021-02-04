var canvas = document.querySelector('canvas');
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var ballX = canvas.width/2;
var ballY = canvas.height/2;
var directionX = 1;
var directionY = 1;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width)/2;
var brickRowCount = 3;
var brickColumnCount = 20;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 200;
var score = 0;
canvas.width = 1915;
canvas.height = 970;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: true};
    }
}

document.addEventListener("keydown", keyDownHandler, false);


function keyDownHandler(e) {
    if(e.key === "Right" && paddleX < canvas.width - paddleWidth || e.key === "ArrowRight" && paddleX < canvas.width - paddleWidth) {
        paddleX += 15;
    }
    else if(e.key === "Left" && paddleX > 0 || e.key === "ArrowLeft" && paddleX > 0) {
        paddleX -= 15;
    }
}


function detectCollision() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var brick = bricks[c][r];
            if(ballX + ballRadius >= brick.x && ballX + ballRadius <= brick.x + brickWidth && ballY + ballRadius >= brick.y && ballY + ballRadius <= brick.y + brickHeight) {
                directionY = -directionY;
                brick.status = false;
                score++ 
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

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
        	if(bricks [c][r].status == 1) {
            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        	}
        }
    }
}

function edgeCollision() {
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
    drawBricks();
    drawBall();
    drawPaddle();
    ballMovement();
    edgeCollision();
    detectCollision();
}

var interval = setInterval(draw, 10);

