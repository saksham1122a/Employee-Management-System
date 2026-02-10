const User = require("../models/User.model");
const { hashPassword } = require("./hashPassword");

const forceReset = async () => {
  try {
    console.log("🔨 Force resetting admin and manager users...");

    // Delete existing admin and manager users
    await User.deleteMany({ 
      email: { $in: ["sakshamnnda01@gmail.com", "sakshamnnda01+manager@gmail.com"] }
    });
    console.log("✅ Deleted existing admin/manager users");

    // Create fresh admin
    const adminPassword = await hashPassword("sakshamadmin@#");
    await User.create({
      name: "Admin",
      email: "sakshamnnda01@gmail.com",
      password: adminPassword,
      role: "admin",
    });
    console.log("✅ Fresh Admin user created");

    // Create fresh manager
    const managerPassword = await hashPassword("sakshammanager@#");
    await User.create({
      name: "Manager",
      email: "sakshamnnda01+manager@gmail.com",
      password: managerPassword,
      role: "manager",
    });
    console.log("✅ Fresh Manager user created");

    console.log("🎉 Force reset completed successfully");
    
    // Display credentials for verification
    console.log("\n📋 LOGIN CREDENTIALS:");
    console.log("🔹 ADMIN:");
    console.log("   Email: sakshamnnda01@gmail.com");
    console.log("   Password: sakshamadmin@#");
    console.log("🔹 MANAGER:");
    console.log("   Email: sakshamnnda01+manager@gmail.com");
    console.log("   Password: sakshammanager@#");
    console.log("\n⚠️  Use these exact credentials for login testing");

  } catch (error) {
    console.error("❌ Force reset failed:", error.message);
  }
};

module.exports = forceReset;