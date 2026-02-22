const fetch = require('node-fetch');

async function testUserCreation() {
  console.log('Testing user creation endpoint...');
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake-token-for-testing'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpass123',
        role: 'employee'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response body:', await response.text());
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testUserCreation();
