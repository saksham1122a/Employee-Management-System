// Test login with the actual credentials
const http = require('http');

console.log('🔍 Testing login with admin credentials...');

const loginData = JSON.stringify({
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
    'Content-Length': loginData.length
  }
};

const req = http.request(options, (res) => {
  console.log('✅ Response Status:', res.statusCode);
  console.log('✅ Response Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Response Body:', data);
    
    if (res.statusCode === 200) {
      const response = JSON.parse(data);
      console.log('🎉 Login successful!');
      console.log('🎫 Token:', response.token ? 'Received' : 'Not received');
      
      // Test the users endpoint with the token
      if (response.token) {
        testUsersEndpoint(response.token);
      }
    } else {
      console.log('❌ Login failed');
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request Error:', e.message);
});

req.write(loginData);
req.end();

function testUsersEndpoint(token) {
  console.log('\n🔍 Testing users endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/users',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  
  const req = http.request(options, (res) => {
    console.log('✅ Users Response Status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ Users Response Body:', data);
      
      if (res.statusCode === 200) {
        const users = JSON.parse(data);
        console.log('🎉 Users fetched successfully!');
        console.log('👥 Users count:', users.length);
        users.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
        });
      } else {
        console.log('❌ Failed to fetch users');
      }
    });
  });
  
  req.on('error', (e) => {
    console.error('❌ Users Request Error:', e.message);
  });
  
  req.end();
}
