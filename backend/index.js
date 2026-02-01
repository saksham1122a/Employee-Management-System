const express = require('express');
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const authRoutes = require("./auth/auth.routes.js");
const cors = require('cors');  // Add this

dotenv.config();
connectDB();

const app = express();

// Add CORS middleware
app.use(cors({    // Allow requests from frontend and cors is used to prevent CORS errors and needed for cross-origin requests
  origin: 'http://localhost:5173',    // this origin came from frontend (vite.config.js)
  credentials: true
}));

app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});