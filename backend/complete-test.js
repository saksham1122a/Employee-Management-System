const http = require('http');

// First, login to get a real token
const loginData = JSON.stringify({
  email: 'sakshamnnda01@gmail.com',
  password: 'sakshamadmin@#'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
};

let authToken = '';

const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (res.statusCode === 200) {
        authToken = response.token;
        console.log('Login successful, got token:', authToken);
        
        // Now test user creation with real token
        testUserCreation(authToken);
      } else {
        console.log('Login failed:', data);
      }
    } catch (e) {
      console.log('Failed to parse login response:', data);
    }
  });
});

loginReq.on('error', (e) => {
  console.error('Login error:', e.message);
});

loginReq.write(loginData);
loginReq.end();

function testUserCreation(token) {
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
      'Authorization': 'Bearer ' + token
    }
  };

  const req = http.request(options, (res) => {
    console.log('User creation Status:', res.statusCode);
    console.log('User creation Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('User creation Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error('User creation error:', e.message);
  });

  req.write(postData);
  req.end();
}
