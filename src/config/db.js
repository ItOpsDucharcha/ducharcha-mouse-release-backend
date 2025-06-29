// src/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('[DEBUG ENV]', {
  db: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ PostgreSQL connected successfully'))
  .catch((err) => {
    console.error('❌ PostgreSQL connection error:', err.stack);
    process.exit(1);
  });

module.exports = sequelize;