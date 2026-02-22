const http = require('http');

console.log('Testing mock token...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/users',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.mock.token'
  }
};

const req = http.request(options, (res) => {
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', res.body);
  });
  });
  
  req.on('error', (e) => {
    console.error('Error:', e.message);
  });
  
  req.end();
};

req.end();
