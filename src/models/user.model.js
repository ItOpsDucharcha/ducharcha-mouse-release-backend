const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // ✅ now it's a Sequelize instance

const User = sequelize.define('User', {
  phone_number: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = User;
