import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const generateUsers = async () => {
  try {
    // Connect to local MongoDB
    const MONGODB_URI = 'mongodb://localhost:27017/khhara';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Generate users
    const users = [];
    const roles = ['admin', 'user', 'payment_viewer'];
    const roleCounts = {
      admin: 2,
      'payment_viewer': 3,
      user: 45
    };

    // Create admin users
    for (let i = 0; i < roleCounts.admin; i++) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      users.push({
        name: `Admin ${i + 1}`,
        email: `admin${i + 1}@khhara.com`,
        password: hashedPassword,
        type: 'admin',
        profilePic: ''
      });
    }

    // Create payment viewer users
    for (let i = 0; i < roleCounts['payment_viewer']; i++) {
      const hashedPassword = await bcrypt.hash('viewer123', 10);
      users.push({
        name: `Payment Viewer ${i + 1}`,
        email: `viewer${i + 1}@khhara.com`,
        password: hashedPassword,
        type: 'payment_viewer',
        profilePic: ''
      });
    }

    // Create regular users
    for (let i = 0; i < roleCounts.user; i++) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      users.push({
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: hashedPassword,
        type: 'user',
        profilePic: ''
      });
    }

    // Insert users
    await User.insertMany(users);
    console.log('Successfully seeded 50 users');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

// Run the seed function
generateUsers(); 