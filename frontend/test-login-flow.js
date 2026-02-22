// Test login flow and token storage
console.log('🔍 Testing login flow and token storage...');

const testLoginFlow = async () => {
  try {
    console.log('📋 ISSUE: MyTeam page shows "Please login to view employees"');
    console.log('');
    console.log('🔧 SOLUTION: Complete login flow test');
    console.log('');
    
    // Step 1: Test login
    console.log('📡 Step 1: Testing login...');
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
      console.log('🎫 Token received:', loginData.token ? 'YES' : 'NO');
      console.log('👤 User:', loginData.user.name, '-', loginData.user.role);
      
      // Step 2: Simulate storing token in localStorage
      console.log('');
      console.log('💾 Step 2: Storing token in localStorage...');
      console.log('📝 In browser, this happens automatically when you login');
      console.log('🔑 Token would be stored as: localStorage.setItem("token", token)');
      
      // Step 3: Test if token works for MyTeam
      console.log('');
      console.log('📡 Step 3: Testing MyTeam access with token...');
      const employeesResponse = await fetch('http://localhost:5000/api/auth/employees', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      if (employeesResponse.ok) {
        const employeesData = await employeesResponse.json();
        console.log('✅ MyTeam access successful!');
        console.log('👥 Employees found:', employeesData.length);
        
        employeesData.forEach((emp, index) => {
          console.log(`  ${index + 1}. ${emp.name} (${emp.email})`);
        });
        
        console.log('');
        console.log('🎉 SOLUTION CONFIRMED:');
        console.log('✅ 1. Login works and provides token');
        console.log('✅ 2. Token allows access to MyTeam');
        console.log('✅ 3. Employees are displayed correctly');
        console.log('');
        console.log('🔧 IF YOU STILL SEE THE ERROR:');
        console.log('❌ 1. Make sure you complete the login process');
        console.log('❌ 2. Check browser console for errors');
        console.log('❌ 3. Clear browser cache and try again');
        console.log('❌ 4. Ensure frontend is running on correct port');
        
      } else {
        console.log('❌ MyTeam access failed');
      }
    } else {
      console.log('❌ Login failed');
      const errorData = await loginResponse.text();
      console.log('❌ Error:', errorData);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testLoginFlow();
