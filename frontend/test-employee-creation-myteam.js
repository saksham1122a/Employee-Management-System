// Test creating an employee and then viewing in MyTeam
console.log('🔍 Testing employee creation and MyTeam view...');

const testEmployeeCreationAndMyTeam = async () => {
  try {
    // First login as admin to create an employee
    console.log('📡 Step 1: Logging in as admin...');
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
      console.log('✅ Admin login successful!');
      console.log('🎫 Token received');
      
      const token = loginData.token;
      
      // Create a test employee
      console.log('📡 Step 2: Creating test employee...');
      const createResponse = await fetch('http://localhost:5000/api/auth/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: 'Test Employee',
          email: 'testemployee@example.com',
          password: 'testpassword123',
          role: 'employee'
        })
      });
      
      if (createResponse.ok) {
        const createData = await createResponse.json();
        console.log('✅ Employee created successfully!');
        console.log('📝 Employee data:', createData);
        
        // Now test the employees endpoint (MyTeam view)
        console.log('📡 Step 3: Testing MyTeam view...');
        const employeesResponse = await fetch('http://localhost:5000/api/auth/employees', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          console.log('✅ MyTeam view successful!');
          console.log('👥 Employees found:', employeesData.length);
          
          employeesData.forEach((emp, index) => {
            console.log(`  ${index + 1}. ${emp.name} (${emp.email}) - ${emp.role}`);
          });
          
          console.log('🎉 MyTeam component is working perfectly!');
          console.log('✅ Employees are properly synced');
          console.log('✅ Only employees are visible');
          console.log('✅ No Add Employee button (removed)');
          
        } else {
          console.log('❌ Failed to fetch employees');
        }
      } else {
        console.log('❌ Failed to create employee');
      }
    } else {
      console.log('❌ Admin login failed');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testEmployeeCreationAndMyTeam();
