require('dotenv').config();
const sequelize = require('../src/config/db');
const User = require('../src/models/user.model');

(async () => {
  try {
    await sequelize.authenticate();
    await User.sync(); // Ensures table exists
    const user = await User.create({
      phone_number: '9810452035'
    });
    console.log('✅ User created:', user.toJSON());
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating user:', err);
    process.exit(1);
  }
})();
