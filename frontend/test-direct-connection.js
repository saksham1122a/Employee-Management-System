// Test direct connection to backend
console.log('🔍 Testing direct backend connection...');

const testConnection = async () => {
  try {
    console.log('📡 Testing GET /api/auth/users...');
    
    const response = await fetch('http://localhost:5000/api/auth/users', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    
    console.log('✅ Response status:', response.status);
    console.log('✅ Response headers:', response.headers);
    
    const data = await response.text();
    console.log('✅ Response body:', data);
    
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
};

testConnection();
