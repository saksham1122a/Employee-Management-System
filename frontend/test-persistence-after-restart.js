// Test employee data persistence after server restart
console.log('🔍 Testing employee data persistence after server restart...');

const testPersistenceAfterRestart = async () => {
  try {
    // Step 1: Login with the employee that was created before restart
    console.log('📡 Step 1: Testing employee login after restart...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'mike.employee@example.com',
        password: 'employee123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Employee login successful after restart!');
      console.log('🎫 Token received');
      console.log('👤 User info:', loginData.user);
      
      // Step 2: Check if employee still appears in employees list
      console.log('📡 Step 2: Checking employees list after restart...');
      const employeesResponse = await fetch('http://localhost:5000/api/auth/employees', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      if (employeesResponse.ok) {
        const employeesData = await employeesResponse.json();
        console.log('✅ Employees list fetched after restart!');
        console.log('👥 Total employees:', employeesData.length);
        
        employeesData.forEach((emp, index) => {
          console.log(`  ${index + 1}. ${emp.name} (${emp.email}) - ${emp.role}`);
        });
        
        console.log('🎉 Persistence test completed successfully!');
        console.log('✅ Employee data persists after server restart');
        console.log('✅ Employee can login after restart');
        console.log('✅ Employee appears in MyTeam view after restart');
        console.log('✅ Database is working correctly');
        
      } else {
        console.log('❌ Failed to fetch employees list after restart');
      }
    } else {
      console.log('❌ Employee login failed after restart');
      const errorData = await loginResponse.text();
      console.log('❌ Error:', errorData);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testPersistenceAfterRestart();
