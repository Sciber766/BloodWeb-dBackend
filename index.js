const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');               // <-- add this
const { initIO } = require('./socket');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
initIO(server);

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

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
