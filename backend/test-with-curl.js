// Test backend with curl to simulate browser request
console.log('🔍 Testing backend with curl...');

const { exec } = require('child_process');

// Test login endpoint
console.log('📡 Testing login endpoint...');
exec('curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -H "Origin: http://localhost:5174" -d \'{"email":"sakshamnnda01@gmail.com","password":"sakshamadmin@#"}\'', (error, stdout, stderr) => {
  console.log('Login Response:');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('STDOUT:', stdout);
  }
  console.log('STDERR:', stderr);
});

// Test users endpoint with token
setTimeout(() => {
  console.log('📡 Testing users endpoint...');
  exec('curl -X GET http://localhost:5000/api/auth/users -H "Authorization: Bearer test-token" -H "Origin: http://localhost:5174"', (error, stdout, stderr) => {
    console.log('Users Response:');
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('STDOUT:', stdout);
    }
    console.log('STDERR:', stderr);
  });
}, 2000);
