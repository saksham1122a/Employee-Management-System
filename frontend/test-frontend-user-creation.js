// Test frontend user creation from browser context
console.log('🔍 Testing frontend user creation...');

// Test if frontend can call backend
const testFrontendUserCreation = async () => {
  try {
    // First login to get token
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
      
      // Store token in variable (simulating frontend)
      const token = loginData.token;
      
      // Now create user (simulating frontend User.jsx)
      console.log('📡 Step 2: Creating new user...');
      const newUser = {
        name: 'Frontend Test User',
        email: 'frontendtest@example.com',
        password: 'frontendtest123',
        role: 'employee'
      };
      
      const createResponse = await fetch('http://localhost:5000/api/auth/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });
      
      if (createResponse.ok) {
        const createData = await createResponse.json();
        console.log('✅ User created successfully!');
        console.log('📝 User data:', createData);
        
        // Test login with new user
        console.log('📡 Step 3: Testing login with new user...');
        const newLoginResponse = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: newUser.email,
            password: newUser.password
          })
        });
        
        if (newLoginResponse.ok) {
          const newLoginData = await newLoginResponse.json();
          console.log('✅ New user login successful!');
          console.log('🎉 Frontend user creation flow is working!');
          console.log('✅ User is properly stored in backend database');
        } else {
          console.log('❌ New user login failed');
          console.log('❌ User was not stored properly');
        }
      } else {
        const errorData = await createResponse.json();
        console.log('❌ User creation failed:', errorData);
      }
    } else {
      console.log('❌ Admin login failed');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testFrontendUserCreation();
