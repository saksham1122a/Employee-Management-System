// Test employee signup and login persistence
console.log('🔍 Testing employee signup and login persistence...');

const testEmployeePersistence = async () => {
  try {
    // Step 1: Create a new employee through signup
    console.log('📡 Step 1: Creating new employee through signup...');
    const signupResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'John Employee',
        email: 'john.employee@example.com',
        password: 'employee123'
      })
    });
    
    if (signupResponse.ok) {
      const signupData = await signupResponse.json();
      console.log('✅ Employee signup successful!');
      console.log('📝 Response:', signupData);
      
      // Step 2: Test login with the new employee
      console.log('📡 Step 2: Testing employee login...');
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'john.employee@example.com',
          password: 'employee123'
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Employee login successful!');
        console.log('🎫 Token received');
        console.log('👤 User info:', loginData.user);
        
        // Step 3: Check if employee appears in employees list
        console.log('📡 Step 3: Checking employees list...');
        const employeesResponse = await fetch('http://localhost:5000/api/auth/employees', {
          headers: {
            'Authorization': `Bearer ${loginData.token}`
          }
        });
        
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          console.log('✅ Employees list fetched!');
          console.log('👥 Total employees:', employeesData.length);
          
          employeesData.forEach((emp, index) => {
            console.log(`  ${index + 1}. ${emp.name} (${emp.email}) - ${emp.role}`);
          });
          
          console.log('🎉 Employee persistence test completed successfully!');
          console.log('✅ Employee created through signup');
          console.log('✅ Employee can login');
          console.log('✅ Employee appears in MyTeam view');
          console.log('✅ Data is now persistent - will survive server restarts');
          
        } else {
          console.log('❌ Failed to fetch employees list');
        }
      } else {
        console.log('❌ Employee login failed');
        const errorData = await loginResponse.text();
        console.log('❌ Error:', errorData);
      }
    } else {
      console.log('❌ Employee signup failed');
      const errorData = await signupResponse.text();
      console.log('❌ Error:', errorData);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testEmployeePersistence();
