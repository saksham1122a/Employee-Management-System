// Test CORS with curl-like request
const http = require('http');

console.log('Testing CORS with Origin header...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'http://localhost:5173'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': res.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': res.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': res.headers['access-control-allow-headers']
    });
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
  console.error('Error details:', e);
});

const loginData = JSON.stringify({
  email: 'sakshamnnda01@gmail.com',
  password: 'sakshamadmin@#'
});

req.write(loginData);
req.end();
