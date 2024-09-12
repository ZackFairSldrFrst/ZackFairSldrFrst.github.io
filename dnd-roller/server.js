// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Store rooms and their participants
const rooms = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('create-room', (roomName) => {
    if (!rooms[roomName]) {
      rooms[roomName] = [];
      socket.join(roomName);
      rooms[roomName].push(socket.id);
      io.to(socket.id).emit('room-created', roomName);
      console.log(`Room created: ${roomName}`);
    } else {
      io.to(socket.id).emit('room-exists', roomName);
    }
  });

  socket.on('join-room', (roomName) => {
    if (rooms[roomName]) {
      socket.join(roomName);
      rooms[roomName].push(socket.id);
      io.to(roomName).emit('user-joined', socket.id);
      io.to(socket.id).emit('room-joined', roomName);
      console.log(`User ${socket.id} joined room: ${roomName}`);
    } else {
      io.to(socket.id).emit('room-not-found', roomName);
    }
  });

  socket.on('leave-room', (roomName) => {
    if (rooms[roomName]) {
      socket.leave(roomName);
      rooms[roomName] = rooms[roomName].filter(id => id !== socket.id);
      io.to(roomName).emit('user-left', socket.id);
      console.log(`User ${socket.id} left room: ${roomName}`);
    }
  });

  socket.on('roll-dice', (data) => {
    const { roomName, sides } = data;
    const roll = Math.floor(Math.random() * sides) + 1;
    const rollData = { result: roll, sides, roomName };
    io.to(roomName).emit('dice-rolled', rollData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove user from all rooms
    for (let roomName in rooms) {
      rooms[roomName] = rooms[roomName].filter(id => id !== socket.id);
      io.to(roomName).emit('user-left', socket.id);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
