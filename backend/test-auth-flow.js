const http = require('http');

// Test login first
const loginData = JSON.stringify({
  email: 'sakshamnnda01@gmail.com',
  password: 'sakshamadmin@#'
});

console.log('Testing login...');

const loginReq = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Login response status:', res.statusCode);
    console.log('Login response body:', data);
    
    if (res.statusCode === 200) {
      try {
        const response = JSON.parse(data);
        const token = response.token;
        console.log('Got token:', token);
        
        // Now test getting users with this token
        testGetUsers(token);
      } catch (e) {
        console.log('Failed to parse login response:', e.message);
      }
    }
  });
});

loginReq.on('error', (e) => {
  console.error('Login error:', e.message);
});

loginReq.write(loginData);
loginReq.end();

function testGetUsers(token) {
  console.log('Testing GET /api/auth/users with token...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/users',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  };

  const req = http.request(options, (res) => {
    console.log('GET users Status:', res.statusCode);
    console.log('GET users Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('GET users Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error('GET users error:', e.message);
  });

  req.end();
}
