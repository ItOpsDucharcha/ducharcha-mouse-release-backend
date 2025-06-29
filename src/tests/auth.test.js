// ==================================
// 📁 /src/tests/auth.test.js
// ==================================
console.log('💡 Test file loaded');

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authRoutes = require('../routes/auth.routes');
const sequelize = require('../config/db');
const OTP = require('../models/otp.model');
const User = require('../models/user.model');

const app = express();
app.use(bodyParser.json());
app.use('/', authRoutes);

// Mock DB setup/teardown
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('🔐 OTP Auth Flow', () => {
  const testPhone = '9876543210';

  it('should request an OTP successfully', async () => {
    const res = await request(app)
      .post('/request-otp')
      .send({ phone_number: testPhone });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('expires_at');
  });

  it('should fail verification with wrong OTP', async () => {
    const res = await request(app)
      .post('/verify-otp')
      .send({ phone_number: testPhone, otp: '000000' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('status', 'error');
  });

  it('should return signup_required for new user with correct OTP', async () => {
    const otpRecord = await OTP.findOne({ where: { phone_number: testPhone }, order: [['created_at', 'DESC']] });
    const res = await request(app)
      .post('/verify-otp')
      .send({ phone_number: testPhone, otp: otpRecord.otp_code });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'signup_required');
  });

  it('should return user existence = false', async () => {
    const res = await request(app)
      .get(`/check-user-exists?phone_number=${testPhone}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ exists: false });
  });

  it('should create a user and return success + token on OTP verify', async () => {
    await User.create({ phone_number: testPhone });
    const otpRecord = await OTP.findOne({ where: { phone_number: testPhone }, order: [['created_at', 'DESC']] });
    const res = await request(app)
      .post('/verify-otp')
      .send({ phone_number: testPhone, otp: otpRecord.otp_code });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('token');

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded).toHaveProperty('phone', testPhone);
  });
});