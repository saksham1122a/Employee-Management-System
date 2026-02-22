// Test user creation endpoint
const http = require('http');

console.log('🔍 Testing user creation endpoint...');

const newUser = {
  name: 'Test Employee',
  email: 'testemployee@example.com',
  password: 'testpassword123',
  role: 'employee'
};

const loginData = JSON.stringify({
  email: 'sakshamnnda01@gmail.com',
  password: 'sakshamadmin@#'
});

// First login to get token
const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const loginReq = http.request(loginOptions, (loginRes) => {
  console.log('✅ Login Status:', loginRes.statusCode);
  
  let loginData = '';
  loginRes.on('data', (chunk) => {
    loginData += chunk;
  });
  
  loginRes.on('end', () => {
    if (loginRes.statusCode === 200) {
      const loginResponse = JSON.parse(loginData);
      console.log('🎉 Login successful!');
      console.log('🎫 Token received');
      
      // Now create user with token
      createUser(loginResponse.token);
    } else {
      console.log('❌ Login failed');
    }
  });
});

loginReq.on('error', (e) => {
  console.error('❌ Login Error:', e.message);
});

loginReq.write(loginData);
loginReq.end();

function createUser(token) {
  console.log('\n🔍 Creating new user...');
  
  const userData = JSON.stringify(newUser);
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Length': userData.length
    }
  };
  
  const req = http.request(options, (res) => {
    console.log('✅ Create User Status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ Create User Response:', data);
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('🎉 User created successfully!');
        
        // Test login with new user credentials
        testNewUserLogin();
      } else {
        console.log('❌ Failed to create user');
      }
    });
  });
  
  req.on('error', (e) => {
    console.error('❌ Create User Error:', e.message);
  });
  
  req.write(userData);
  req.end();
}

function testNewUserLogin() {
  console.log('\n🔍 Testing login with new user credentials...');
  
  const newLoginData = JSON.stringify({
    email: newUser.email,
    password: newUser.password
  });
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': newLoginData.length
    }
  };
  
  const req = http.request(options, (res) => {
    console.log('✅ New User Login Status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ New User Login Response:', data);
      
      if (res.statusCode === 200) {
        console.log('🎉 New user login successful!');
        console.log('✅ User is properly stored in database');
      } else {
        console.log('❌ New user login failed');
        console.log('❌ User was not stored in database');
      }
    });
  });
  
  req.on('error', (e) => {
    console.error('❌ New User Login Error:', e.message);
  });
  
  req.write(newLoginData);
  req.end();
}
