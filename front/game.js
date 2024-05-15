let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let baseSpeed = 5; 
let scale = 2;
let border = 50;
let colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];

let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 4,
    color: colors[Math.floor(Math.random() * colors.length)]
};

let food = [];

let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

player.x = Math.random() * (canvas.width - 2 * border) + border;
player.y = Math.random() * (canvas.height - 2 * border) + border;

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(0, 0, player.size * scale, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

function drawFood() {
    for(let i = 0; i < food.length; i++) {
        let dx = (food[i].x - player.x) * scale;
        let dy = (food[i].y - player.y) * scale;
        ctx.beginPath();
        ctx.arc(dx, dy, food[i].size * scale, 0, Math.PI * 2);
        ctx.fillStyle = food[i].color;
        ctx.fill();
        ctx.closePath();
    }
}

function checkFoodCollision() {
    for(let i = 0; i < food.length; i++) {
        let distance = Math.hypot(player.x - food[i].x, player.y - food[i].y);
        if(distance < player.size + food[i].size) {
            player.size += food[i].size / 3;
            food.splice(i, 1);
            for(let j = 0; j < 5; j++) {
                let newSize = 1;
                let newColor = colors[Math.floor(Math.random() * colors.length)];
                food.push({x: Math.random() * (canvas.width - border * 2) + border, y: Math.random() * (canvas.height - border * 2) + border, size: newSize, color: newColor});
            }
        }
    }
}
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let dx = mouse.x - player.x;
    let dy = mouse.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    let speed = baseSpeed / player.size;
    let scale = 10 / Math.sqrt(player.size);;

    if (player.x + dx / distance * speed >= border && player.x + dx / distance * speed <= canvas.width - border) {
        player.x += dx / distance * speed;
    }
    if (player.y + dy / distance * speed >= border && player.y + dy / distance * speed <= canvas.height - border) {
        player.y += dy / distance * speed;
    }

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);

    drawPlayer();
    drawFood();
    checkFoodCollision();

    ctx.restore();

    requestAnimationFrame(gameLoop);
}

for(let i = 0; i < 5000; i++) {
    let color = colors[Math.floor(Math.random() * colors.length)];
    let size = 1;
    let x = Math.random() * (canvas.width - border * 2) + border;
    let y = Math.random() * (canvas.height - border * 2) + border;
    food.push({x: x, y: y, size: size, color: color});
}
    
canvas.addEventListener('mousemove', function(e) {
    let rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / scale + player.x - canvas.width / (2 * scale);
    mouse.y = (e.clientY - rect.top) / scale + player.y - canvas.height / (2 * scale);
});

gameLoop();