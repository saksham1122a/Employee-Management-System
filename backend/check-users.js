const { getUserModel } = require('./config/memory-db.js');

async function checkUsers() {
  console.log('Checking users in database...');
  
  const User = getUserModel();
  
  // Get all users
  const allUsers = await User.find();
  console.log('Total users in database:', allUsers.length);
  
  // Check specific users
  const sakshamUser = await User.findOne({ email: 'sakshamnnda01@gmail.com' });
  console.log('Saksham user found:', sakshamUser ? 'YES' : 'NO');
  if (sakshamUser) {
    console.log('Saksham user details:', {
      id: sakshamUser._id,
      email: sakshamUser.email,
      name: sakshamUser.name,
      role: sakshamUser.role,
      password: sakshamUser.password.substring(0, 10) + '...'
    });
  }
  
  const adminUser = await User.findOne({ email: 'admin@example.com' });
  console.log('Admin user found:', adminUser ? 'YES' : 'NO');
  if (adminUser) {
    console.log('Admin user details:', {
      id: adminUser._id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      password: adminUser.password.substring(0, 10) + '...'
    });
  }
  
  // Test password comparison
  if (sakshamUser) {
    const { comparePassword } = require('./utils/hashPassword.js');
    const isMatch = await comparePassword('sakshamadmin@#', sakshamUser.password);
    console.log('Saksham password match:', isMatch);
  }
  
  if (adminUser) {
    const { comparePassword } = require('./utils/hashPassword.js');
    const isMatch = await comparePassword('password', adminUser.password);
    console.log('Admin password match:', isMatch);
  }
}

checkUsers().catch(console.error);
