const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Game objects
const paddleWidth = 10;
const paddleHeight = 100;
let leftPaddle = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight };
let rightPaddle = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight };
let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, speedX: 5, speedY: 4 };

// Event listener for mouse movement
canvas.addEventListener("mousemove", function(evt) {
    let rect = canvas.getBoundingClientRect();
    leftPaddle.y = evt.clientY - rect.top - leftPaddle.height / 2;
});

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

// Update game state
function update() {
    // Move ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with top/bottom walls
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY = -ball.speedY;
    }

    // Ball collision with paddles
    if(ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
       ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height) {
        ball.speedX = -ball.speedX;
        ball.x = leftPaddle.x + leftPaddle.width + ball.radius; // prevent stuck
    }

    if(ball.x + ball.radius > rightPaddle.x &&
       ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.height) {
        ball.speedX = -ball.speedX;
        ball.x = rightPaddle.x - ball.radius;
    }

    // Right paddle AI
    let targetY = ball.y - rightPaddle.height / 2;
    rightPaddle.y += (targetY - rightPaddle.y) * 0.1;

    // Prevent paddles from going outside canvas
    leftPaddle.y = Math.max(Math.min(leftPaddle.y, canvas.height - leftPaddle.height), 0);
    rightPaddle.y = Math.max(Math.min(rightPaddle.y, canvas.height - rightPaddle.height), 0);

    // Reset ball if it goes out of bounds
    if(ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.speedX = 5 * (Math.random() > 0.5 ? 1 : -1);
        ball.speedY = 4 * (Math.random() > 0.5 ? 1 : -1);
    }
}

// Render game
function render() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    // Draw paddles
    drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, "#fff");
    drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, "#fff");

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, "#fff");
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();


   