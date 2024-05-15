let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let speed = 0.5;
let scale = 2;
let border = 50;
let colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];

let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 5,
    color: colors[Math.floor(Math.random() * colors.length)] // Choisir une couleur aléatoire pour le joueur
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
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

function drawFood() {
    for(let i = 0; i < food.length; i++) {
        ctx.beginPath();
        ctx.arc(food[i].x, food[i].y, food[i].size, 0, Math.PI * 2);
        ctx.fillStyle = food[i].color; // Utiliser la couleur de la nourriture
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
            let newSize = 1;
            let newColor = colors[Math.floor(Math.random() * colors.length)];
            food.push({x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: newSize, color: newColor});
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    offsetX = player.x - canvas.width / 2;
    offsetY = player.y - canvas.height / 2;

    // ctx.setTransform(scale, 0, 0, scale, -offsetX * scale, -offsetY * scale);
    
    let dx = mouse.x - player.x;
    let dy = mouse.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Déplacer le joueur dans la direction de la souris à une vitesse constante
    if (distance > speed) {
        player.x += dx / distance * speed;
        player.y += dy / distance * speed;
    } else {
        player.x = mouse.x;
        player.y = mouse.y;
    }

    drawPlayer();
    drawFood();
    checkFoodCollision();
    requestAnimationFrame(gameLoop);
}

for(let i = 0; i < 1000; i++) {
    let color = colors[Math.floor(Math.random() * colors.length)];
    food.push({x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: 1, color: color});
}
    
canvas.addEventListener('mousemove', function(e) {
    let rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

gameLoop();