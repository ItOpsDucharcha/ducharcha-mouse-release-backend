// ==================================
// 📄 index.js
// 📌 Entry point of DuCharcha backend server
// ==================================

// Load environment variables from .env
require('dotenv').config();

// Core dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Sequelize DB initialization and models
const sequelize = require('./src/config/db');
const User = require('./src/models/user.model');
const OTP = require('./src/models/otp.model');

// Route handlers
const authRoutes = require('./src/routes/auth.routes');

// Initialize express app
const app = express();

// ============================
// ✅ Middleware setup
// ============================
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// ============================
// ✅ Health Check Route
// ============================
app.get('/api/health', async (req, res) => {
  try {
    const result = await sequelize.query('SELECT NOW()');
    res.status(200).json({
      status: 'ok',
      time: result[0][0].now,
    });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// ============================
// ✅ Root & Auth Routes
// ============================
app.get('/', (req, res) => {
  res.send('🚀 DuCharcha Backend API is up and running!');
});

app.use('/', authRoutes);

// ============================
// ✅ Database Sync (Sequelize)
// ============================
sequelize.sync() // use { force: true } if you want to drop & recreate
  .then(() => console.log('🧬 DB synced'))
  .catch(err => console.error('❌ DB sync error:', err));

// ============================
// ✅ Start Server
// ============================
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
