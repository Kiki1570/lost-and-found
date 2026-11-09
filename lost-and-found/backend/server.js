const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Lost and Found API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Page not found' });
});

app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(500).json({ success: false, message: error.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error('Please add MONGO_URI and JWT_SECRET to your environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log('Server running on port ' + PORT);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
