// Test simple connection
console.log('🔍 Testing simple connection...');

const testSimpleConnection = async () => {
  try {
    console.log('📡 Testing login endpoint...');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'sakshamnnda01@gmail.com',
        password: 'sakshamadmin@#'
      })
    });
    
    console.log('✅ Response status:', response.status);
    console.log('✅ Response headers:', response.headers);
    
    const data = await response.text();
    console.log('✅ Response body:', data);
    
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
};

testSimpleConnection();
