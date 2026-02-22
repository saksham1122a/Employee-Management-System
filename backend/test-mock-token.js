const http = require('http');

console.log('🔍 Testing Mock Token Authentication...');

const testMockToken = () => {
  const testData = JSON.stringify({
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
      'Content-Length': Buffer.byteLength(testData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📡 Mock Token Test Results:');
      console.log('Status:', res.statusCode);
      
      if (res.statusCode === 200) {
        try {
          const response = JSON.parse(data);
          console.log('✅ Mock token login successful!');
          console.log('Token received:', response.token.substring(0, 30) + '...');
          
          // Now test if this token works for user management
          testTokenUsage(response.token);
          
        } catch (e) {
          console.log('❌ Failed to parse login response:', e.message);
        }
      } else {
        console.log('❌ Mock token login failed with status:', res.statusCode);
        console.log('Response:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Login request error:', e.message);
  });
  
  req.write(testData);
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
      'Authorization': `Bearer ${token}`
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
          console.log('✅ Mock token works! Users fetched:', users.length);
          users.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
          });
        } else {
          console.log('❌ Mock token failed! Status:', res.statusCode);
          console.log('Response:', data);
        }
      } catch (e) {
        console.log('❌ Failed to parse users response:', e.message);
      }
    });
  });
  
  req.on('error', (e) => {
    console.error('❌ Users request error:', e.message);
  });
  
  req.end();
};

console.log('🚀 Starting mock token test...');
testMockToken();
