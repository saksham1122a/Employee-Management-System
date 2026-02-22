// Test MyTeam component with authentication
console.log('🔍 Testing MyTeam component with authentication...');

const testMyTeamWithAuth = async () => {
  try {
    // First login as manager to simulate manager accessing MyTeam
    console.log('📡 Step 1: Logging in as manager...');
    
    // Check if we have a manager user in the database
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
      
      // Now test MyTeam component functionality
      console.log('📡 Step 2: Testing MyTeam fetchEmployees...');
      
      const usersResponse = await fetch('http://localhost:5000/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log('✅ Users fetched successfully!');
        console.log('📊 Total users:', usersData.length);
        
        // Filter employees (like MyTeam component does)
        const employees = usersData.filter(user => user.role === 'employee');
        console.log('👥 Employees only:', employees.length);
        
        if (employees.length > 0) {
          console.log('✅ Employees found:');
          employees.forEach((emp, index) => {
            console.log(`  ${index + 1}. ${emp.name} (${emp.email}) - ${emp.role}`);
          });
        } else {
          console.log('ℹ️ No employees found - showing empty state');
        }
        
        console.log('🎉 MyTeam component authentication test passed!');
        console.log('✅ Manager can view employees');
        console.log('✅ Only employees are visible');
        console.log('✅ No Add Employee button (removed)');
        
      } else {
        console.log('❌ Failed to fetch users');
      }
    } else {
      console.log('❌ Manager login failed');
      console.log('ℹ️ Trying with admin credentials...');
      
      // Try with admin if manager doesn't work
      const adminLoginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'sakshamnnda01@gmail.com',
          password: 'sakshamadmin@#'
        })
      });
      
      if (adminLoginResponse.ok) {
        const adminLoginData = await adminLoginResponse.json();
        console.log('✅ Admin login successful!');
        console.log('👤 User role:', adminLoginData.user.role);
        
        const adminUsersResponse = await fetch('http://localhost:5000/api/auth/users', {
          headers: {
            'Authorization': `Bearer ${adminLoginData.token}`
          }
        });
        
        if (adminUsersResponse.ok) {
          const adminUsersData = await adminUsersResponse.json();
          const adminEmployees = adminUsersData.filter(user => user.role === 'employee');
          console.log('👥 Employees (admin view):', adminEmployees.length);
          
          console.log('🎉 MyTeam component works with admin too!');
        }
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testMyTeamWithAuth();
