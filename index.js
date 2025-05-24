const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));



  const bloodRequestRoutes = require('./routes/bloodRequest');
  app.use('/api/request', bloodRequestRoutes);
  
// Use /api/auth for authentication-related routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);


// Default root route
app.get('/', (req, res) => {
    res.send('BloodWeb Backend Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
