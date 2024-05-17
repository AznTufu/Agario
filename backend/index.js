import express from 'express';
import http from 'http';
import ip from 'ip';
import { Server } from 'socket.io';
import cors from 'cors';
const app = express();
const server = http.createServer(app);
import path from 'path';
const PORT = 3000;
const __dirname = path.resolve();
//
const io = new Server(server, {
    cors: {
        origin: '*',
        }
})
app.use(cors())
app.get('/', (req, res) => {
    res.json('ip address: http://' + ip.address()+':'+PORT);    
});
//send index.html
app.get('/game', (req, res) => {
    //cut back to path
    let pathIndex = __dirname.split('backend');
    //concat path
    let realPath = pathIndex[0]
    console.log(realPath)
    res.sendFile(realPath + '/front/index.html');
});

let players = {};
let colors = ['red', 'blue', 'green', 'yellow', 'purple'];

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('user connected');

    players[socket.id] = {
        size: 4,
        color: colors[Math.floor(Math.random() * colors.length)]
    };
    socket.emit('playerData', players[socket.id]);
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('user disconnected');
        delete players[socket.id];
    });
    socket.on('message', (msg) => {
        console.log('message: ' + msg);
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


server.listen(PORT, () => {
    console.log('Server ip : http://' +ip.address() +":" + PORT);
})

