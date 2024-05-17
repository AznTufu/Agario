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

function drawOthersPlayers() {
    if (currentPlayer) {
        for (let id in players) {
            if (id !== currentPlayer.id) {
                let player = players[id];
                ctx.beginPath();
                let x = (player.x - currentPlayer.x) * globalScale;
                let y = (player.y - currentPlayer.y) * globalScale;
                ctx.arc(x, y, player.size * globalScale, 0, Math.PI * 2);
                ctx.fillStyle = player.color;
                ctx.fill();
                ctx.closePath();
            }
        }
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


function checkCollisions() {
    for (let id1 in players) {
        for (let id2 in players) {
            if (id1 !== id2) {
                let player1 = players[id1];
                let player2 = players[id2];
                let dx = player1.x - player2.x;
                let dy = player1.y - player2.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < player1.size + player2.size) {
                    if (player1.size > player2.size) {
                        player1.size += player2.size / 2;
                        delete players[id2];
                    } else if (player2.size > player1.size) {
                        player2.size += player1.size / 2;
                        delete players[id1];
                    }
                }
            }
        }
    }
}

function checkFoodCollisions() {
    for (let id in players) {
        let player = players[id];
        for(let i = 0; i < food.length; i++) {
            let dx = player.x - food[i].x;
            let dy = player.y - food[i].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < player.size + food[i].size) {
                player.size += food[i].size / 2;
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

    if (currentPlayer && currentPlayer.id === socket.id) {
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
            if (currentPlayer.x > 500) currentPlayer.x = 500;
            if (currentPlayer.y > 500) currentPlayer.y = 500;
        } else {
            currentPlayer.x = currentPlayer.mouse.x;
            currentPlayer.y = currentPlayer.mouse.y;
        }

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(playerScale, playerScale);

        drawPlayers();
        drawOthersPlayers();
        drawFood();

        checkCollisions();
        checkFoodCollisions();

        ctx.restore();
        currentPlayer.id = currentPlayer.id || socket.id;
        socket.emit('playerMoved', { id: currentPlayer.id, x: currentPlayer.x, y: currentPlayer.y });
    }
    console.log(currentPlayer);
    
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
        currentPlayer.mouse = currentPlayer.mouse || {};
        currentPlayer.mouse.x = (e.clientX - rect.left) / globalScale + currentPlayer.x - canvas.width / (2 * globalScale);
        currentPlayer.mouse.y = (e.clientY - rect.top) / globalScale + currentPlayer.y - canvas.height / (2 * globalScale);
    }
    //socket.emit('playerMoved', { id: currentPlayer.id, x: currentPlayer.x, y: currentPlayer.y });
});

gameLoop();