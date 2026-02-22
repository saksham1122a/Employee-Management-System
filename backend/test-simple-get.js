const http = require('http');

console.log('Testing simple GET request...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  
  res.on('data', (chunk) => {
    console.log('Data:', chunk.toString());
  });
  
  res.on('end', () => {
    console.log('Request completed');
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.end();
