const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', socket => {
  socket.on('offer', data => socket.broadcast.emit('offer', data));
  socket.on('answer', data => socket.broadcast.emit('answer', data));
  socket.on('candidate', data => socket.broadcast.emit('candidate', data));
});

server.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});