import express from 'express';
import http from 'http';
import ip from 'ip';
import { Server } from 'socket.io';
import cors from 'cors';
const app = express();
const server = http.createServer(app);
const PORT = 3000;
const io = new Server(server, {
    cors: {
        origin: '*',
        }
})

app.use(cors())
app.get('/', (req, res) => {
    res.json('ip address: http://' + ip.address()+':'+PORT);    
});

let gameParameters = {
    x: Math.random() * 1800, 
    y: Math.random() * 1800,
    size: 4,
    colors: ['red', 'blue', 'green', 'yellow', 'purple'],
};

let players = {};

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('user connected');
    socket.join('Welcome');
    console.log('join room: Welcome')
    players[socket.id] = {
        x: gameParameters.x,
        y: gameParameters.y,
        size: gameParameters.size,
        color: gameParameters.colors[Math.floor(Math.random() * gameParameters.colors.length)],
        room: 'Welcome'
    };
    io.to('Welcome').emit('playersData', getPlayersInRoom('Welcome'));

    socket.on('joinRoom', (room) => {
        console.log('join room: ' + room);
        socket.join(room);
        players[socket.id] = {
            x: gameParameters.x,
            y: gameParameters.y,
            size: gameParameters.size,
            color: gameParameters.colors[Math.floor(Math.random() * gameParameters.colors.length)],
            room: room
        };
        io.to(room).emit('playersData', getPlayersInRoom(room));
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('user disconnected');
        let room = players[socket.id] ? players[socket.id].room : null;
        if (room) {
            delete players[socket.id];
            io.to(room).emit('playersData', getPlayersInRoom(room));
        }
    });

    socket.on('message', (msg) => {
        console.log('Room name: ' + msg);
        io.emit('message', msg);
    });
    
    socket.on('room', (room, msg) => {
        console.log('room: ' + room + ' message: ' + msg);
        io.to(room).emit('message', msg);
    });

    socket.on('join', (room) => {
        console.log('join room: ' + room);
        socket.join(room);
        io.to(room).emit('join', room);
    });
    socket.on('leave', (room) => {
        console.log('leave room: ' + room);
        socket.leave(room);
        io.to(room).emit('leave', room);
    });
})

function getPlayersInRoom(room) {
    return Object.values(players).filter(player => player.room === room);
}


server.listen(PORT, () => {
    console.log('Server ip : http://' +ip.address() +":" + PORT);
})

