import mongoose from 'mongoose';

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    if (!connectionPromise) {
      connectionPromise = mongoose.connect(mongoUri);
    }

    await connectionPromise;
    console.log('MongoDB connected successfully');
  } catch (error) {
    connectionPromise = null;
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
