const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const baseSpeed = 5; 
const globalScale = 2;
const border = 10;
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];

let food = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function drawPlayers() {
    if (Array.isArray(window.players)) {
        window.players.forEach(player => {
            ctx.beginPath();
            console.log(player.x, player.y, player.size * globalScale);
            ctx.arc(0, 0, player.size * globalScale, 0, Math.PI * 2);
            ctx.fillStyle = 'player.color';
            ctx.fill();
            ctx.closePath();
        });
    }
}

function drawFood() {
    window.players.forEach(player => {
        for(let i = 0; i < food.length; i++) {
            let dx = (food[i].x - player.x) * globalScale;
            let dy = (food[i].y - player.y) * globalScale;
            ctx.beginPath();
            ctx.arc(dx, dy, food[i].size * globalScale, 0, Math.PI * 2);
            ctx.fillStyle = food[i].color;
            ctx.fill();
            ctx.closePath();
        }
    });
}

function checkFoodCollision() {
    window.players.forEach(player => {
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
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Array.isArray(window.players)) {
        window.players.forEach(player => {
            player.mouse = player.mouse || {x: 0, y: 0};

            let dx = player.mouse.x - player.x;
            let dy = player.mouse.y - player.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            let speed = baseSpeed / (player.size / 1.5) ;
            let playerScale = 10 / Math.sqrt(player.size);

            if (distance > speed) {
                player.x += dx / distance * speed;
                player.y += dy / distance * speed;
                if (player.x < 0) player.x = 0;
                if (player.y < 0) player.y = 0;
                if (player.x > 2000) player.x = 2000;
                if (player.y > 2000) player.y = 2000;
            } else {
                player.x = player.mouse.x;
                player.y = player.mouse.y;
            }

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(playerScale, playerScale);

            drawPlayers();
            drawFood();
            checkFoodCollision();

            ctx.restore();
        });
    }

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
    if (Array.isArray(window.players)) {
        window.players.forEach(player => {
            player.mouse.x = (e.clientX - rect.left) / globalScale + player.x - canvas.width / (2 * globalScale);
            player.mouse.y = (e.clientY - rect.top) / globalScale + player.y - canvas.height / (2 * globalScale);
        });
    }
});

window.players = window.players || [];

window.requestAnimationFrame(gameLoop);