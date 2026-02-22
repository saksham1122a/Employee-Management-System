// Test the actual browser authentication flow
console.log('🔍 Testing browser authentication flow...');

// Simulate what happens when frontend loads User Management
const testFrontendAuth = async () => {
  try {
    // Step 1: Try to login (this should trigger the backend debugging)
    console.log('📡 Step 1: Attempting login...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5174'
      },
      body: JSON.stringify({
        email: 'sakshamnnda01@gmail.com',
        password: 'sakshamadmin@#'
      })
    });
    
    console.log('📡 Login Status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log('🎫 Token received:', loginData.token.substring(0, 30) + '...');
      
      // Step 2: Use token to fetch users (this should trigger the find() method debugging)
      console.log('📡 Step 2: Attempting to fetch users...');
      const usersResponse = await fetch('http://localhost:5000/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Origin': 'http://localhost:5174'
        }
      });
      
      console.log('📡 Users Status:', usersResponse.status);
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log('✅ Users fetched successfully!');
        console.log('👥 Users count:', usersData.length);
        usersData.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
        });
      } else {
        const errorData = await usersResponse.json();
        console.log('❌ Failed to fetch users:', errorData);
      }
    } else {
      console.log('❌ Login failed:', loginResponse.status);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testFrontendAuth();
