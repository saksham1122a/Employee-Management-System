const http = require('http');

// Test login with your credentials
const loginData = JSON.stringify({
  email: 'sakshamnnda01@gmail.com',
  password: 'sakshamadmin@#'
});

console.log('Testing login with sakshamnnda01@gmail.com...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
};

const req = http.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Body:', data);
    
    if (res.statusCode === 401) {
      console.log('❌ Login failed - Invalid credentials');
      
      // Let's also test with the default admin credentials
      console.log('\nTesting with default admin credentials...');
      testDefaultAdmin();
    } else if (res.statusCode === 200) {
      console.log('✅ Login successful!');
    }
  });
});

req.on('error', (e) => {
  console.error('Request Error:', e.message);
});

req.write(loginData);
req.end();

function testDefaultAdmin() {
  const defaultData = JSON.stringify({
    email: 'admin@example.com',
    password: 'password'
  });
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(defaultData)
    }
  };
  
  const req = http.request(options, (res) => {
    console.log('Default Admin Status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Default Admin Response:', data);
    });
  });
  
  req.write(defaultData);
  req.end();
}
