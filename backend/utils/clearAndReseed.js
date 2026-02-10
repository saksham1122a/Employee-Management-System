const User = require("../models/User.model");
const { hashPassword } = require("./hashPassword");

const clearAndReseed = async () => {
  try {
    console.log("🗑️ Clearing existing users...");

    // Delete all existing users
    await User.deleteMany({});
    console.log("✅ All users cleared");

    console.log("🌱 Reseeding admin and manager...");

    // Create admin
    const adminPassword = await hashPassword("sakshamadmin@#");
    await User.create({
      name: "Admin",
      email: "sakshamnnda01@gmail.com",
      password: adminPassword,
      role: "admin",
    });
    console.log("✅ Admin user created");

    // Create manager
    const managerPassword = await hashPassword("sakshammanager@#");
    await User.create({
      name: "Manager",
      email: "sakshamnnda01+manager@gmail.com",
      password: managerPassword,
      role: "manager",
    });
    console.log("✅ Manager user created");

    console.log("🎉 Reseeding completed successfully");

  } catch (error) {
    console.error("❌ Clear and reseed failed:", error.message);
  }
};

module.exports = clearAndReseed;