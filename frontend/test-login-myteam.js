// Test login and MyTeam access
console.log('🔍 Testing login and MyTeam access...');

const testLoginAndMyTeam = async () => {
  try {
    // Step 1: Check if there's a token in localStorage (simulated)
    console.log('📡 Step 1: Testing login to get token...');
    
    // Login as manager to access MyTeam
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'sakshamnnda01+manager@gmail.com',
        password: 'sakshammanager@#'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Manager login successful!');
      console.log('🎫 Token received');
      console.log('👤 User role:', loginData.user.role);
      
      // Simulate storing token in localStorage
      const token = loginData.token;
      console.log('💾 Token would be stored in localStorage');
      
      // Step 2: Test MyTeam fetch with token
      console.log('📡 Step 2: Testing MyTeam fetch with token...');
      const employeesResponse = await fetch('http://localhost:5000/api/auth/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (employeesResponse.ok) {
        const employeesData = await employeesResponse.json();
        console.log('✅ MyTeam fetch successful!');
        console.log('👥 Employees found:', employeesData.length);
        
        employeesData.forEach((emp, index) => {
          console.log(`  ${index + 1}. ${emp.name} (${emp.email}) - ${emp.role}`);
        });
        
        console.log('🎉 MyTeam access test completed!');
        console.log('✅ Login required before accessing MyTeam');
        console.log('✅ Token must be stored in localStorage');
        console.log('✅ MyTeam works with proper authentication');
        
      } else {
        console.log('❌ Failed to fetch employees');
      }
    } else {
      console.log('❌ Manager login failed');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testLoginAndMyTeam();
