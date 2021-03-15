//simplify things, break them into pieces 
// initialize - update - render
class Ball {
    constructor(ctx, x, y, radius) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.xIncrement = 2;
        this.yIncrement = 2;
        this.xDirection = 1;
        this.yDirection = 1;
    }

    invertYDirection(){
        this.yDirection = -this.yDirection
    }

    invertXDirection(){
        this.xDirection = -this.xDirection
    }

    update() {
        this.x += (this.xIncrement * this.xDirection)
        this.y += (this.yIncrement * this.yDirection)
    }

    render() {
        //logic to draw it out 
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    this.ctx.fillStyle = "#000000";
    this.ctx.fill();
    this.ctx.closePath();
    }
}

class Paddle {
    constructor(ctx, x, y, width, height, canvasHeight) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 4;
        this.canvasHeight = canvasHeight;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveRight() {
        this.x += this.speed;
    }

    render() {
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.canvasHeight - this.height, this.width, this.height);
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();
    }
}

class Brick {
    constructor(ctx, width, height, c, r) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.padding = 15;
        this.offSetTop = 30;
        this.offSetLeft = 300;
        this.visible = true;
        this.x = (c * (this.width + this.padding)) + this.offSetLeft;
        this.y = (r * (this.height + this.padding)) + this.offSetTop;
    }
        
    render() {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    }
}

class BrickBreaker {
    constructor(canvasWidth, canvasHeight, fps) {
        this.fps = fps;
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.columns = 20;
        this.rows = 5;
        this.moveRight = false;
        this.moveLeft = false;
        this.initializeEntities();
        this.initializeListeners();
    }

    initializeListeners() {
        document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
        document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
    }

    initializeEntities() {
        this.ball = new Ball(this.ctx, this.canvasWidth / 2, this.canvasHeight / 2, Math.PI * 3);
        this.paddle = new Paddle(this.ctx, this.canvasWidth / 2, this.canvasHeight, 100, 15, 970);
        this.bricks = this.createBricks();
    }

    keyDownHandler(e) {
        if ((e.key === 'Right' || e.key === "ArrowRight") && (this.paddle.x < this.canvasWidth - this.paddle.width)) {
        this.moveRight = true;
        } else if(e.key === "Left" && this.paddle.x > 0 || e.key === "ArrowLeft" && this.paddle.x > 0) {
        this.moveLeft = true;
        }
    }

    keyUpHandler(e) {
        if(e.key === "Right" || e.key === "ArrowRight") {
            this.moveRight = false;
        } else if(e.key === "Left" || e.key === "ArrowLeft") {
            this.moveLeft = false;
        }
    }

    movePaddle() {
        if (this.moveRight) {
            if (this.paddle.x + this.paddle.width < this.canvasWidth) {
                this.paddle.moveRight();
            }
        } else if(this.moveLeft) {
            if (this.paddle.x > 0) {
                this.paddle.moveLeft();
            }
        }
    }

    createBricks() {
        var bricks = [];
        for(var c=0; c < this.columns; c++) {
            bricks[c] = [];
            for(var r=0; r < this.rows; r++) {
                bricks[c][r] = new Brick(this.ctx, 50, 15, c, r);
            }
        }
        return bricks;
    }

    drawBricks() {
        for(let c=0; c < this.columns; c++) {
            for(let r=0; r < this.rows; r++) {
                if (this.bricks[c][r].visible)
                this.bricks[c][r].render();
            }
        }
    }
    
    detectBallCollisionWithWindow() {
        if(this.ball.x > this.canvasWidth - this.ball.radius || this.ball.x + this.ball.xDirection < this.ball.radius) {
            this.ball.invertXDirection()
        }
        if(this.ball.y + this.ball.yDirection < this.ball.radius) {
            this.ball.invertYDirection();
        }
        else if(this.ball.y + this.ball.yDirection > this.canvasHeight - this.ball.radius) {
            if(this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
                if(this.ball.y === this.ball.y - this.paddle.height){
                    this.directionY = -this.directionY;
                }
            } else {
                alert("GAME OVER");
                document.location.reload();
                clearInterval(this.interval); // Needed for Chrome to end game
                    
            }
        }
    }

    detectBallCollisionWithBrick() {
        for (var c = 0; c < this.columns; c++) {
            for (var r = 0; r < this.rows; r++) {
                var brick = this.bricks[c][r];
                if (brick.visible) {
                    if (this.ball.x + this.ball.radius >= brick.x && this.ball.x + this.ball.radius <= brick.x + brick.width && this.ball.y + this.ball.radius >= brick.y && this.ball.y + this.ball.radius <= brick.y + brick.height ||
                        this.ball.x - this.ball.radius >= brick.x && this.ball.x - this.ball.radius <= brick.x + brick.width && this.ball.y + this.ball.radius >= brick.y && this.ball.y + this.ball.radius <= brick.y + brick.height ||
                        this.ball.x + this.ball.radius >= brick.x && this.ball.x + this.ball.radius <= brick.x + brick.width && this.ball.y - this.ball.radius >= brick.y && this.ball.y - this.ball.radius <= brick.y + brick.height) {
                        this.ball.invertYDirection();
                        brick.visible = false;
                    }
                }
            }
        }
    }

    detectBallCollisionWithPaddle() {
        if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width && this.ball.y + this.ball.radius >= this.paddle.y - this.paddle.height) {
            this.ball.invertYDirection();
        }
    }

    detectCollisions() {
        this.detectBallCollisionWithWindow();
        this.detectBallCollisionWithBrick();
        this.detectBallCollisionWithPaddle();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    update() {
        this.ball.update();
        this.detectCollisions();
        this.clearCanvas();
        this.movePaddle();
    }

    render() {
        this.ball.render();
        this.paddle.render();
        this.drawBricks();
    }

    run() {
        this.update();
        this.render();
    }

    startGame() {
        this.interval = setInterval(this.run.bind(this), this.fps);
    }
}


new BrickBreaker(1915, 970, 10).startGame();

