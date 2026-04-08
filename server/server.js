const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

const app = express();

// ✅ CORS — allows your React app to talk to this server
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// ✅ Parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health check (just to confirm server is running)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running!' });
});

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/mockups', require('./routes/mockupRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// ✅ Connect to MongoDB, then start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });