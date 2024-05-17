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
    if (currentPlayer) {
        ctx.beginPath();
        ctx.arc(0, 0, currentPlayer.size * globalScale, 0, Math.PI * 2);
        ctx.fillStyle = currentPlayer.color;
        ctx.fill();
        ctx.closePath();
    }
}

function drawFood() {
    if (currentPlayer) {
        for(let i = 0; i < food.length; i++) {
            let dx = (food[i].x - currentPlayer.x) * globalScale;
            let dy = (food[i].y - currentPlayer.y) * globalScale;
            ctx.beginPath();
            ctx.arc(dx, dy, food[i].size * globalScale, 0, Math.PI * 2);
            ctx.fillStyle = food[i].color;
            ctx.fill();
            ctx.closePath();
        }
    }
}


function checkFoodCollision() {
    if (currentPlayer) {
        for(let i = 0; i < food.length; i++) {
            let distance = Math.hypot(currentPlayer.x - food[i].x, currentPlayer.y - food[i].y);
            if(distance < currentPlayer.size + food[i].size) {
                currentPlayer.size += food[i].size / 2;
                food.splice(i, 1);
                let newSize = 1;
                let newColor = colors[Math.floor(Math.random() * colors.length)];
                food.push({x: Math.random() * (2000 - border * 2) + border, y: Math.random() * (2000- border * 2) + border, size: newSize, color: newColor});
            }
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentPlayer) {
        currentPlayer.mouse = currentPlayer.mouse || {x: 0, y: 0};

        let dx = currentPlayer.mouse.x - currentPlayer.x;
        let dy = currentPlayer.mouse.y - currentPlayer.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let speed = baseSpeed / (currentPlayer.size / 1.5) ;
        let playerScale = 10 / Math.sqrt(currentPlayer.size);

        if (distance > speed) {
            currentPlayer.x += dx / distance * speed;
            currentPlayer.y += dy / distance * speed;
            if (currentPlayer.x < 0) currentPlayer.x = 0;
            if (currentPlayer.y < 0) currentPlayer.y = 0;
            if (currentPlayer.x > 2000) currentPlayer.x = 2000;
            if (currentPlayer.y > 2000) currentPlayer.y = 2000;
        } else {
            currentPlayer.x = currentPlayer.mouse.x;
            currentPlayer.y = currentPlayer.mouse.y;
        }

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(playerScale, playerScale);

        drawPlayers();
        drawFood();
        checkFoodCollision();

        ctx.restore();
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
    if (currentPlayer) {
        currentPlayer.mouse.x = (e.clientX - rect.left) / globalScale + currentPlayer.x - canvas.width / (2 * globalScale);
        currentPlayer.mouse.y = (e.clientY - rect.top) / globalScale + currentPlayer.y - canvas.height / (2 * globalScale);
    }
});

window.players = window.players || [];

window.requestAnimationFrame(gameLoop);