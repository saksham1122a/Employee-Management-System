const User = require("../models/User.model");
const { hashPassword } = require("./hashPassword");

const seedAdminManager = async () => {
  try {
    console.log("🌱 Starting to seed admin and manager users...");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "sakshamnnda01@gmail.com" });
    if (!existingAdmin) {
      const adminPassword = await hashPassword("sakshamadmin@#");
      
      await User.create({
        name: "Admin",
        email: "sakshamnnda01@gmail.com",
        password: adminPassword,
        role: "admin",
      });
      
      console.log("✅ Admin user created successfully");
    } else {
      console.log("ℹ️ Admin user already exists");
    }

    // Check if manager already exists
    const existingManager = await User.findOne({ email: "sakshamnnda01+manager@gmail.com" });
    if (!existingManager) {
      const managerPassword = await hashPassword("sakshammanager@#");
      
      await User.create({
        name: "Manager",
        email: "sakshamnnda01+manager@gmail.com",
        password: managerPassword,
        role: "manager",
      });
      
      console.log("✅ Manager user created successfully");
    } else {
      console.log("ℹ️ Manager user already exists");
    }

    console.log("🎉 Seeding completed successfully");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    console.error("Full error:", error);
  }
};

module.exports = seedAdminManager;