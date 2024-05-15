let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 20,
    color: 'white'
};

let food = [];

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

function drawFood() {
    for(let i = 0; i < food.length; i++) {
        ctx.beginPath();
        ctx.arc(food[i].x, food[i].y, food[i].size, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
}

function checkFoodCollision() {
    for(let i = 0; i < food.length; i++) {
        let distance = Math.hypot(player.x - food[i].x, player.y - food[i].y);
        if(distance - player.size - food[i].size < 1) {
            player.size += food[i].size;
            food.splice(i, 1);
            food.push({x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: 10});
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawFood();
    checkFoodCollision();
    requestAnimationFrame(gameLoop);
}

for(let i = 0; i < 20; i++) {
    food.push({x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: 3});
}

gameLoop();