const http = require('http');

const postData = JSON.stringify({
  name: 'Test User',
  email: 'test@example.com',
  password: 'testpass123',
  role: 'employee'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/users',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'Authorization': 'Bearer fake-token-for-testing'
  }
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', data);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(postData);
req.end();
