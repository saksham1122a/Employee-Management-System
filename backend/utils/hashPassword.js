const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("🔐 Password hashed successfully");
    return hashedPassword;
  } catch (error) {
    console.error("❌ Error hashing password:", error);
    throw error;
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    console.log("🔍 Comparing passwords...");
    console.log("🔍 Input password:", password);
    console.log("🔍 Hashed password length:", hashedPassword.length);
    
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log("🔐 Password comparison result:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("❌ Error comparing passwords:", error);
    throw error;
  }
};

module.exports = { hashPassword, comparePassword };