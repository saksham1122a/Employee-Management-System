console.log('🔧 Simple Authentication Test');
console.log('');

// Test backend login endpoint directly
const testCredentials = {
  email: 'sakshamnnda01@gmail.com',
  password: 'sakshamadmin@#'
};

console.log('📝 Testing with credentials:');
console.log('Email:', testCredentials.email);
console.log('Password:', testCredentials.password);

console.log('');
console.log('🌐 Backend Test Instructions:');
console.log('1. Open browser and go to: http://localhost:5173');
console.log('2. Login with the above credentials');
console.log('3. Check browser console for login success');
console.log('4. Navigate to User Management');
console.log('5. If still fails, check localStorage for token');

console.log('');
console.log('🔍 Expected Token Format:');
console.log('Should start with: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
console.log('Should be stored in localStorage as "token"');

console.log('');
console.log('✅ If login works but User Management fails:');
console.log('- Check that you are accessing the correct admin panel');
console.log('- Verify token is not being cleared by other code');
console.log('- Check browser console for any JavaScript errors');
