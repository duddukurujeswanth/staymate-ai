import mongoose from 'mongoose';
import localDb from './localDb.js';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('⚠️  No MONGODB_URI found in env. Falling back to LOCAL JSON FILE DATABASE.');
    return { isLocal: true, db: localDb };
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    return { isLocal: false, db: mongoose };
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log('⚠️  Falling back to LOCAL JSON FILE DATABASE due to connection error.');
    return { isLocal: true, db: localDb };
  }
};
