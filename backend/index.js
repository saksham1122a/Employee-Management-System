const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/persistent-db.js");
const authRoutes = require("./auth/auth.routes.js");
const cors = require("cors");
const multer = require('multer');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

// Debug environment variables
console.log('🔍 Environment variables:');
console.log('PORT from env:', process.env.PORT);
console.log('JWT_SECRET from env:', process.env.JWT_SECRET);

// Set JWT_SECRET if not in .env
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here-change-in-production';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images and PDFs only
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG, GIF, and PDF files are allowed!'));
    }
  }
});

const app = express();

// CORS = Cross-Origin Resource Sharing
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve thumbnails separately
app.use('/thumbnails', express.static(path.join(__dirname, 'uploads')));

// Connect to database
connectDB()
  .then(() => {
    console.log("📊 Database connected successfully");
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);

// Export upload middleware for use in routes
module.exports.upload = upload;

const PORT = 5000;

const server = app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Server accessible at: http://localhost:${PORT}`);
  
  // Test if server is actually listening
  setTimeout(() => {
    console.log('🔍 Server should be listening now...');
    console.log('🔍 Server is still running...');
  }, 1000);
  
  // Keep the server running
  setTimeout(() => {
    console.log('🔍 Server is still running after 5 seconds...');
  }, 5000);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else if (e.code === 'EACCES') {
    console.error(`❌ Port ${PORT} requires elevated privileges`);
  } else {
    console.error('❌ Server error:', e);
  }
  process.exit(1);
});

// Handle process errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});