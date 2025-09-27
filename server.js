
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

async function main() {
  try {
    // Connect (Mongoose handles recommended options internally)
    await mongoose.connect(uri);    // returns a promise
    console.log('✅ Connected to MongoDB Atlas');

  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

main();
