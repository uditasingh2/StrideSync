const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌  MONGO_URI is not defined in .env — DB features will be unavailable");
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌  MongoDB connection error: ${err.message}`);
    console.warn("⚠️   Server will run without DB — update MONGO_URI in .env to fix this");
  }

  // Connection event listeners
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️   MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔄  MongoDB reconnected");
  });
};

module.exports = connectDB;
