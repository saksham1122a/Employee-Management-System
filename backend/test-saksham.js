const { getUserModel } = require('./config/memory-db.js');
const { comparePassword } = require('./utils/hashPassword.js');

async function testLogin() {
  console.log('Testing login credentials...');
  
  const User = getUserModel();
  
  // Test sakshamnnda01@gmail.com login
  const sakshamUser = await User.findOne({ email: 'sakshamnnda01@gmail.com' });
  if (sakshamUser) {
    const sakshamMatch = await comparePassword('sakshamadmin@#', sakshamUser.password);
    console.log('Saksham login test:', sakshamMatch ? 'SUCCESS' : 'FAILED');
  }
  
  console.log('Login tests completed!');
}

testLogin().catch(console.error);
