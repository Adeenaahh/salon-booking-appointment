import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB, isDbConnected } from '../config/db.js';

dotenv.config();

const runTest = async () => {
  console.log('--------------------------------------------------');
  console.log('🌸 Testing Salon Booking System MongoDB Connection...');
  console.log(`📡 Target URI: ${process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED'}`);
  console.log('--------------------------------------------------');

  const success = await connectDB();

  if (success && isDbConnected()) {
    console.log('✅ TEST PASSED: Successfully connected to MongoDB!');
    console.log(`   Database Name : ${mongoose.connection.name}`);
    console.log(`   Host          : ${mongoose.connection.host}`);
    console.log(`   Port          : ${mongoose.connection.port || 'N/A'}`);
    await mongoose.disconnect();
    console.log('🔌 Disconnected cleanly.');
    process.exit(0);
  } else {
    console.log('❌ TEST FAILED: Could not establish a connection to MongoDB.');
    console.log('\n💡 Beginner-Friendly Guide to Connect MongoDB:');
    console.log('1. If using MongoDB Atlas (Cloud):');
    console.log('   - Create a free cluster at https://www.mongodb.com/cloud/atlas');
    console.log('   - Create a database user with username and password');
    console.log('   - In Network Access, add IP Address 0.0.0.0/0 (allow access from anywhere)');
    console.log('   - Copy your connection string and paste it into backend/.env as MONGODB_URI');
    console.log('2. If using Local MongoDB:');
    console.log('   - Make sure your MongoDB service is running (mongod)');
    console.log('   - Default URI: mongodb://localhost:27017/salon_booking');
    console.log('--------------------------------------------------');
    process.exit(1);
  }
};

runTest();
