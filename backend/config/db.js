import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Uses MONGODB_URI from environment variables (MongoDB Atlas or local MongoDB)
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.warn('⚠️  MONGODB_URI is not set in backend/.env.');
      console.warn('    Please configure your MongoDB Atlas connection string in backend/.env');
      return false;
    }

    // Set connection options
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });

    console.log(`🌸 MongoDB Connected Successfully: ${conn.connection.host} / ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.warn('    Troubleshooting tip: Check your MONGODB_URI, IP whitelist in MongoDB Atlas, or start local MongoDB.');
    return false;
  }
};

/**
 * Helper to check current database connection status
 * 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
 */
export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};
