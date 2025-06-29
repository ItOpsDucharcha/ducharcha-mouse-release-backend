// ==================================
// 📁 /src/routes/auth.routes.js
// ==================================
const express = require('express');
const { requestOtp, verifyOtp, checkUserExists } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.get('/check-user-exists', checkUserExists);

module.exports = router;