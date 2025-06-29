const authRoutes = require('./src/routes/auth.routes');


// index.js
require('dotenv').config(); // Load environment variables

const sequelize = require('./src/config/db');
const User = require('./src/models/user.model');
const OTP = require('./src/models/otp.model');

sequelize.sync({ alter: true }) // or force: true if you're testing
  .then(() => console.log('🧬 DB synced'))
  .catch(err => console.error('❌ DB sync error:', err));

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Database connection
const db = require('./src/config/db'); // PostgreSQL pool setup
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('DuCharcha Backend API is up and running!');
});

app.use('/', authRoutes);


// Sample Route
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.status(200).json({
      status: 'ok',
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// TODO: Add your feature routes here
// app.use('/api/charchas', require('./src/routes/charcha.routes'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
