const bcrypt = require("bcrypt");

async function generateHash() {
  const password = 'sakshammanager@#';
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log('Hashed password for sakshammanager@#:');
  console.log(hashedPassword);
}

generateHash().catch(console.error);
