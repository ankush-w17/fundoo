require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const config = require('./src/config/config');

async function seedUser() {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB');

    const email = 'seeduser@example.com';
    const password = 'Password123!';

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists');
      user.password = password; // Update password just in case
      await user.save();
    } else {
      user = await User.create({
        firstName: 'Seed',
        lastName: 'User',
        email,
        password
      });
      console.log('User created');
    }

    console.log('Seed User Email:', email);
    console.log('Seed User Password:', password);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedUser();
