console.log('Testing backend endpoints...');

// Test 1: Direct login endpoint test
const loginTest = () => {
  const http = require('http');
  
  const data = JSON.stringify({
    email: 'sakshamnnda01@gmail.com',
    password: 'sakshamadmin@#'
  });
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  
  const req = http.request(options, (res) => {
    let result = '';
    res.on('data', (chunk) => {
      result += chunk;
    });
    
    res.on('end', () => {
      console.log('Login Status:', res.statusCode);
      console.log('Login Response:', result);
    });
  });
  
  req.on('error', (e) => {
    console.error('Login Error:', e.message);
  });
  
  req.write(data);
  req.end();
};

// Test 2: Test users endpoint without auth
const usersTest = () => {
  const http = require('http');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/users',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    let result = '';
    res.on('data', (chunk) => {
      result += chunk;
    });
    
    res.on('end', () => {
      console.log('Users Status (no auth):', res.statusCode);
      console.log('Users Response (no auth):', result);
    });
  });
  
  req.on('error', (e) => {
    console.error('Users Error:', e.message);
  });
  
  req.end();
};

// Run tests
setTimeout(() => {
  console.log('=== Test 1: Login ===');
  loginTest();
  
  setTimeout(() => {
    console.log('\n=== Test 2: Users (no auth) ===');
    usersTest();
  }, 2000);
}, 1000);
