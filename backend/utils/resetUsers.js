const User = require("../models/User.model");
const { hashPassword } = require("./hashPassword");

const resetUsers = async () => {
  try {
    console.log("🔄 Resetting admin and manager passwords...");

    // Reset admin password
    const admin = await User.findOne({ email: "sakshamnnda01@gmail.com" });
    if (admin) {
      const adminPassword = await hashPassword("sakshamadmin@#");
      await User.updateOne(
        { email: "sakshamnnda01@gmail.com" },
        { password: adminPassword }
      );
      console.log("✅ Admin password reset successfully");
    }

    // Reset manager password
    const manager = await User.findOne({ email: "sakshamnnda01+manager@gmail.com" });
    if (manager) {
      const managerPassword = await hashPassword("sakshammanager@#");
      await User.updateOne(
        { email: "sakshamnnda01+manager@gmail.com" },
        { password: managerPassword }
      );
      console.log("✅ Manager password reset successfully");
    }

    // Display current users
    const users = await User.find({});
    console.log("📋 Current users in database:");
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });

  } catch (error) {
    console.error("❌ Reset failed:", error.message);
  }
};

module.exports = resetUsers;