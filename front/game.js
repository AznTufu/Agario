const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const baseSpeed = 5; 
const scale = 2;
const border = 10;
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];

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
            player.size += food[i].size / 2;
            food.splice(i, 1);
            let newSize = 1;
            let newColor = colors[Math.floor(Math.random() * colors.length)];
            food.push({x: Math.random() * (2000 - border * 2) + border, y: Math.random() * (2000- border * 2) + border, size: newSize, color: newColor});
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let dx = mouse.x - player.x;
    let dy = mouse.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    let speed = baseSpeed / (player.size / 1.5) ;
    let scale = 10 / Math.sqrt(player.size);;

    if (distance > speed) {
        player.x += dx / distance * speed;
        player.y += dy / distance * speed;
        if (player.x < 0) player.x = 0;
        if (player.y < 0) player.y = 0;
        if (player.x > 2000) player.x = 2000;
        if (player.y > 2000) player.y = 2000;
    } else {
        player.x = mouse.x;
        player.y = mouse.y;
    }

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);

    drawPlayer();
    drawFood();
    checkFoodCollision();

    ctx.restore();

    // if (player.size >= 305) {
    //     alert('Bien joué !');
    // }

    requestAnimationFrame(gameLoop);
}

for(let i = 0; i < 1500; i++) {
    let color = colors[Math.floor(Math.random() * colors.length)];
    let size = 1;
    let x = Math.random() * (2000 - border * 2) + border;
    let y = Math.random() * (2000 - border * 2) + border;
    food.push({x: x, y: y, size: size, color: color});
}

canvas.addEventListener('mousemove', function(e) {
    let rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / scale + player.x - canvas.width / (2 * scale);
    mouse.y = (e.clientY - rect.top) / scale + player.y - canvas.height / (2 * scale);
});

gameLoop();