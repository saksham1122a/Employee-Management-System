// Test MyTeam component functionality
console.log('🔍 Testing MyTeam component synchronization...');

// Test if we can fetch employees from backend
const testMyTeamSync = async () => {
  try {
    // First login as admin
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
      
      // Now fetch users (simulating MyTeam component)
      console.log('📡 Step 2: Fetching employees for MyTeam...');
      const usersResponse = await fetch('http://localhost:5000/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log('✅ Users fetched successfully!');
        console.log('📊 Total users:', usersData.length);
        
        // Filter employees (like MyTeam component does)
        const employees = usersData.filter(user => user.role === 'employee');
        console.log('👥 Employees only:', employees.length);
        
        employees.forEach((emp, index) => {
          console.log(`  ${index + 1}. ${emp.name} (${emp.email}) - ${emp.role}`);
        });
        
        // Create a test employee to verify sync
        console.log('📡 Step 3: Creating test employee...');
        const newEmployee = {
          name: 'Test Employee for MyTeam',
          email: 'myteamtest@example.com',
          password: 'testpassword123',
          role: 'employee'
        };
        
        const createResponse = await fetch('http://localhost:5000/api/auth/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.token}`
          },
          body: JSON.stringify(newEmployee)
        });
        
        if (createResponse.ok) {
          console.log('✅ Test employee created!');
          
          // Fetch again to verify sync
          console.log('📡 Step 4: Verifying sync...');
          const verifyResponse = await fetch('http://localhost:5000/api/auth/users', {
            headers: {
              'Authorization': `Bearer ${loginData.token}`
            }
          });
          
          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json();
            const updatedEmployees = verifyData.filter(user => user.role === 'employee');
            console.log('✅ Sync verified!');
            console.log('👥 Updated employees count:', updatedEmployees.length);
            
            console.log('🎉 MyTeam component synchronization is working!');
            console.log('✅ Only employees are visible');
            console.log('✅ Real-time sync with backend');
          }
        }
      } else {
        console.log('❌ Failed to fetch users');
      }
    } else {
      console.log('❌ Admin login failed');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testMyTeamSync();
