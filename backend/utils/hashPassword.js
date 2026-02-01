const bcrypt = require("bcrypt");

const hashPassword = async (password) => {   // Hash password
  const salt = await bcrypt.genSalt(10);    // Generate salt
  return await bcrypt.hash(password, salt); // Hash password
};

const comparePassword = async (password, hashedPassword) => { // Compare password
  return await bcrypt.compare(password, hashedPassword); // Compare password
};

module.exports = { hashPassword, comparePassword };