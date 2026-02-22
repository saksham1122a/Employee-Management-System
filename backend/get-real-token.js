const http = require('http');

console.log('🔍 Getting Real Token from Backend...');

const getRealToken = () => {
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
      console.log('📡 Login Response:');
      console.log('Status:', res.statusCode);
      
      if (res.statusCode === 200) {
        try {
          const response = JSON.parse(data);
          console.log('✅ Real token received!');
          console.log('Token:', response.token.substring(0, 50) + '...');
          
          // Now test if this real token works for user management
          testRealToken(response.token);
          
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

const testRealToken = (token) => {
  console.log('\n🔍 Testing Real Token for /api/auth/users...');
  
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
          console.log('✅ Real token works! Users fetched:', users.length);
          users.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
          });
        } catch (e) {
          console.log('❌ Failed to parse users response:', e.message);
        }
      } else {
        console.log('❌ Real token failed! Status:', res.statusCode);
        console.log('Response:', data);
      }
    });
  });
  
  req.on('error', (e) => {
    console.error('❌ Users request error:', e.message);
  });
  
  req.end();
};

console.log('🚀 Getting real token...');
getRealToken();
