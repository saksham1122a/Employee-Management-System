// Used for storing the database connection

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);  // Connect to MongoDB
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);  // Log error if connection fails
    process.exit(1);  // Exit process if connection fails and 1 means error
  }
};

module.exports = connectDB;
