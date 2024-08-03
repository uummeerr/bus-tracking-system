
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('locationUpdate', (data) => {
        io.emit('locationUpdate', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.post('/location', (req, res) => {
    const { lat, lon } = req.body;
    io.emit('locationUpdate', { lat, lon });
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

