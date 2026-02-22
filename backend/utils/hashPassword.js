const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



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
    
    // For testing: if stored password is plain text, compare directly
    if (!hashedPassword.startsWith('$2') && !hashedPassword.startsWith('$2b')) {
      const isMatch = password === hashedPassword;
      console.log("🔐 Password comparison result (plain text):", isMatch);
      return isMatch;
    }
    
    // For hashed passwords: use bcrypt comparison
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log("🔐 Password comparison result (hashed):", isMatch);
    return isMatch;
  } catch (error) {
    console.error("❌ Error comparing passwords:", error);
    throw error;
  }
};



const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key-here-change-in-production');
};



module.exports = { hashPassword, comparePassword, generateToken };