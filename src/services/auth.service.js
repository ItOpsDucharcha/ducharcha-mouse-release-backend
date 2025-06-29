// ==================================
// 📁 /src/services/auth.service.js
// ==================================
const { Op } = require('sequelize');
const User = require('../models/user.model');
const OTP = require('../models/otp.model');
const jwt = require('jsonwebtoken');
const moment = require('moment');

exports.generateOtp = async (phone) => {
  // Rate limit: 3 requests per 10 minutes
  const recent = await OTP.count({
    where: {
      phone_number: phone,
      created_at: { [Op.gte]: moment().subtract(10, 'minutes').toDate() }
    }
  });
  if (recent >= 3) throw new Error('Too many OTP requests. Please wait.');

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires_at = moment().add(30, 'seconds').toDate();

  await OTP.create({ phone_number: phone, otp_code: otp, expires_at });
  console.log(`[OTP]: ${otp} sent to ${phone}`); // Replace with SMS Gateway

  return { success: true, expires_at };
};

exports.verifyOtp = async (phone, otp) => {
  const record = await OTP.findOne({
    where: { phone_number: phone, otp_code: otp },
    order: [['created_at', 'DESC']]
  });
  if (!record || moment().isAfter(record.expires_at)) {
    throw new Error('Invalid or expired OTP');
  }

  let user = await User.findOne({ where: { phone_number: phone } });

  if (user) {
    const token = jwt.sign({ id: user.id, phone }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return { status: 'success', token };
  } else {
    return { status: 'signup_required' };
  }
};

exports.checkUserExists = async (phone) => {
  const user = await User.findOne({ where: { phone_number: phone } });
  return !!user;
};