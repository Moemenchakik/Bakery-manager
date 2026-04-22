const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("❌ MONGO_URI is not defined in environment variables!");
      process.exit(1);
    }
    
    uri = uri.trim();
    
    // Log URI structure for debugging (hide password)
    const sanitizedUri = uri.replace(/:([^@]+)@/, ":****@");
    console.log(`📡 Attempting to connect to MongoDB with URI: ${sanitizedUri}`);

    const conn = await mongoose.connect(uri);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
