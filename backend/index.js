const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const authRoutes = require("./auth/auth.routes.js");
const forceReset = require("./utils/forceReset"); // Use forceReset
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// Connect to database and force reset
connectDB()
  .then(async () => {
    console.log("📊 Database connected successfully");
    await forceReset(); // Use forceReset
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});