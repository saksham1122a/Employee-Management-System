// Simple test to check if backend is responding
const http = require('http');

console.log('🔍 Testing backend connectivity...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log('✅ Response received!');
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
  console.error('❌ Error:', e.message);
  console.error('❌ Error details:', e);
  console.error('❌ Error code:', e.code);
  console.error('❌ Error syscall:', e.syscall);
});

req.setTimeout(5000, () => {
  console.log('❌ Request timeout');
  req.destroy();
});

req.end();
