const { getUserModel } = require('./config/memory-db.js');
const { comparePassword } = require('./utils/hashPassword.js');

async function testLogin() {
  console.log('Testing login credentials...');
  
  const User = getUserModel();
  
  // Test admin login
  const adminUser = await User.findOne({ email: 'admin@example.com' });
  if (adminUser) {
    const adminMatch = await comparePassword('password', adminUser.password);
    console.log('Admin login test:', adminMatch ? 'SUCCESS' : 'FAILED');
  }
  
  // Test manager login
  const managerUser = await User.findOne({ email: 'sakshamnnda01+manager@gmail.com' });
  if (managerUser) {
    const managerMatch = await comparePassword('sakshammanager@#', managerUser.password);
    console.log('Manager login test:', managerMatch ? 'SUCCESS' : 'FAILED');
  }
  
  console.log('Login tests completed!');
}

testLogin().catch(console.error);
