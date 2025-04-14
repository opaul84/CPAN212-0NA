import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // Try MongoDB Atlas first
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    console.log("Attempting to connect to MongoDB...");
    console.log("Using URI:", uri.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@')); // Hide password in logs

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("MongoDB connected successfully ✅");
    
    // Log database name and collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Connected to database:", db.databaseName);
    console.log("Available collections:", collections.map(c => c.name));
    
    // Set up database connection error handler
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    // Set up database connection success handler
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    // Set up database disconnection handler
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error("MongoDB connection error ❌:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
};

export default connectDB;
