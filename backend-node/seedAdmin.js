require('dotenv').config();

const mongoose = require('mongoose');
const User     = require('./models/User');

const ADMIN_EMAIL    = '23eg112d03@anurag.edu.in';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME     = 'CraftStory Admin';

async function seed() {
  try {
    await mongoose.connect(
      `${process.env.MONGO_URL}/${process.env.DB_NAME}`
    );
    console.log('✅ Connected to MongoDB');

    // Remove existing admin (clean slate)
    await User.deleteOne({ email: ADMIN_EMAIL });

    await User.create({
      name:            ADMIN_NAME,
      email:           ADMIN_EMAIL,
      password:        ADMIN_PASSWORD,
      role:            'admin',
      isEmailVerified: false,
      phone:           '',
    });

    console.log(`✅ Admin created:  ${ADMIN_EMAIL}`);
    console.log(`   Password:       ${ADMIN_PASSWORD}`);

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();