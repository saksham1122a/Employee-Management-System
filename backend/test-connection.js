const http = require('http');

console.log('Testing backend connection...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

const loginData = JSON.stringify({
  email: 'sakshamnnda01@gmail.com',
  password: 'sakshamadmin@#'
});

req.write(loginData);
req.end();
