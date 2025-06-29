// ==================================
// 📁 /src/controllers/auth.controller.js
// ==================================
const authService = require('../services/auth.service');

exports.requestOtp = async (req, res) => {
  try {
    const { phone_number } = req.body;
    const response = await authService.generateOtp(phone_number);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone_number, otp } = req.body;
    const response = await authService.verifyOtp(phone_number, otp);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.checkUserExists = async (req, res) => {
  try {
    const { phone_number } = req.query;
    const exists = await authService.checkUserExists(phone_number);
    res.status(200).json({ exists });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};