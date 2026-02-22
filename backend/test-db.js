const { getUserModel } = require('./config/memory-db.js');

async function testDB() {
  console.log('Testing database...');
  
  const User = getUserModel();
  
  // Test finding user
  const user = await User.findOne({ email: 'admin@example.com' });
  console.log('Found user:', user ? 'YES' : 'NO');
  
  // Test getting all users
  const allUsers = await User.find();
  console.log('Total users:', allUsers.length);
  
  // Test creating user
  const newUser = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'employee'
  });
  console.log('Created user:', newUser ? 'YES' : 'NO');
  
  console.log('Database test completed!');
}

testDB().catch(console.error);
