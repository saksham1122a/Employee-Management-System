require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'config', 'database.json');

// Define Schema for database state storage (must match persistent-db.js)
const DbStoreSchema = new mongoose.Schema({
  key: { type: String, default: 'ems_db_store', unique: true },
  data: { type: Object, required: true }
}, { timestamps: true });

const DbStore = mongoose.model('DbStore', DbStoreSchema);

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("❌ MONGO_URI is not defined in .env file");
      process.exit(1);
    }

    console.log("🔌 Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("📊 Connected successfully");

    if (!fs.existsSync(DB_FILE)) {
      console.error(`❌ Local database file not found at: ${DB_FILE}`);
      process.exit(1);
    }

    const fileData = fs.readFileSync(DB_FILE, 'utf8');
    const localData = JSON.parse(fileData);
    console.log(`📂 Read ${localData.users.length} users and ${localData.leaveRequests.length} leave requests from database.json`);

    console.log("💾 Uploading data to MongoDB Atlas...");
    await DbStore.updateOne(
      { key: 'ems_db_store' },
      { data: localData },
      { upsert: true }
    );

    console.log("✅ Seed completed successfully! All data successfully synced with MongoDB Atlas.");
    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
