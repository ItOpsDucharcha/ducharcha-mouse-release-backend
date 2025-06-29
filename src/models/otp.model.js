const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // ✅ Add this line

const OTP = sequelize.define('OTP', {
  phone_number: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  otp_code: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = OTP;
