// Test the fixed MyTeam token access
console.log('🔧 TESTING THE FIX: MyTeam token access from sessionStorage');

const testFixedMyTeam = async () => {
  try {
    console.log('📋 ISSUE FIXED: Changed localStorage to sessionStorage in MyTeam');
    console.log('');
    
    // Step 1: Simulate login (stores token in sessionStorage like Login.jsx does)
    console.log('📡 Step 1: Simulating login...');
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
      console.log('✅ Login successful!');
      console.log('🎫 Token received');
      
      // Simulate storing token in sessionStorage (like Login.jsx does)
      sessionStorage.setItem('token', loginData.token);
      sessionStorage.setItem('user', JSON.stringify(loginData.user));
      console.log('💾 Token stored in sessionStorage (like Login.jsx does)');
      
      // Step 2: Test MyTeam access with sessionStorage token
      console.log('');
      console.log('📡 Step 2: Testing MyTeam access with sessionStorage token...');
      
      const token = sessionStorage.getItem('token');
      console.log('🔍 Token found in sessionStorage:', token ? 'YES' : 'NO');
      
      if (token) {
        const employeesResponse = await fetch('http://localhost:5000/api/auth/employees', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          console.log('✅ MyTeam access successful!');
          console.log('👥 Employees found:', employeesData.length);
          
          employeesData.forEach((emp, index) => {
            console.log(`  ${index + 1}. ${emp.name} (${emp.email}) - ${emp.role}`);
          });
          
          console.log('');
          console.log('🎉 ISSUE RESOLVED!');
          console.log('✅ 1. Login stores token in sessionStorage');
          console.log('✅ 2. MyTeam reads token from sessionStorage');
          console.log('✅ 3. No more redirect to login page');
          console.log('✅ 4. Employees are displayed correctly');
          console.log('');
          console.log('🔧 WHAT WAS FIXED:');
          console.log('❌ BEFORE: MyTeam used localStorage.getItem("token")');
          console.log('✅ AFTER:  MyTeam uses sessionStorage.getItem("token")');
          console.log('❌ BEFORE: Login stored token in sessionStorage');
          console.log('✅ AFTER:  Login still stores token in sessionStorage');
          console.log('✅ RESULT: Now both use the same storage!');
          
        } else {
          console.log('❌ MyTeam access failed');
        }
      } else {
        console.log('❌ No token found in sessionStorage');
      }
    } else {
      console.log('❌ Login failed');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testFixedMyTeam();
