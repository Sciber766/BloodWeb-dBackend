const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');               // <-- add this
const { initIO } = require('./socket');
initIO(server);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const bloodRequestRoutes = require('./routes/bloodRequest');
app.use('/api/request', bloodRequestRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('BloodWeb Backend Running');
});

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*',   // Or restrict to your frontend URL(s) for security
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Setup Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

module.exports = { io };

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
