console.log('🔍 Testing Login Flow and Token Storage...');
console.log('');

// Test 1: Check if backend is responding
const http = require('http');

const testLogin = () => {
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
      'Content-Length': Buffer.byteLength(loginData)
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('🔑 Login Test Results:');
      console.log('Status:', res.statusCode);
      
      if (res.statusCode === 200) {
        try {
          const response = JSON.parse(data);
          console.log('✅ Login successful!');
          console.log('Token:', response.token.substring(0, 30) + '...');
          console.log('User:', response.user.name, '(', response.user.email, ')');
          console.log('Role:', response.user.role);
          
          // Test 2: Verify token format
          console.log('\n🔍 Token Analysis:');
          console.log('Token length:', response.token.length);
          console.log('Token format valid:', response.token.includes('.'));
          
          // Test 3: Simulate frontend token storage
          console.log('\n💾 Simulating localStorage storage:');
          console.log('localStorage.setItem("token", "' + response.token + '")');
          
          // Test 4: Test if token can be used for API calls
          testTokenUsage(response.token);
          
        } catch (e) {
          console.log('❌ Failed to parse login response:', e.message);
        }
      } else {
        console.log('❌ Login failed with status:', res.statusCode);
        console.log('Response:', data);
      }
    });
  });
  
  req.on('error', (e) => {
    console.error('❌ Login request error:', e.message);
  });
  
  req.write(loginData);
  req.end();
};

const testTokenUsage = (token) => {
  console.log('\n🔍 Testing Token Usage for /api/auth/users...');
  
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
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      
      if (res.statusCode === 200) {
        try {
          const users = JSON.parse(data);
          console.log('✅ Token works! Users fetched:', users.length);
          users.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
          });
        } catch (e) {
          console.log('❌ Failed to parse users response:', e.message);
        }
      } else {
        console.log('❌ Token failed! Status:', res.statusCode);
        console.log('Response:', data);
      }
    });
  });
  
  req.on('error', (e) => {
    console.error('❌ Users request error:', e.message);
  });
  
  req.end();
};

console.log('🚀 Starting authentication test...');
testLogin();
