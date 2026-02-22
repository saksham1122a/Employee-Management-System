// Test employees endpoint
console.log('🔍 Testing employees endpoint...');

const testEmployeesEndpoint = async () => {
  try {
    // First login to get token
    console.log('📡 Step 1: Logging in...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'sakshamnnda01@gmail.com',
        password: 'sakshamadmin@#'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log('🎫 Token received');
      
      const token = loginData.token;
      
      // Test the employees endpoint
      console.log('📡 Step 2: Testing /employees endpoint...');
      const employeesResponse = await fetch('http://localhost:5000/api/auth/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Employees Response Status:', employeesResponse.status);
      
      const employeesData = await employeesResponse.text();
      console.log('✅ Employees Response Body:', employeesData);
      
      if (employeesResponse.ok) {
        console.log('🎉 Employees endpoint working!');
      } else {
        console.log('❌ Employees endpoint failed');
      }
    } else {
      console.log('❌ Login failed');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testEmployeesEndpoint();
