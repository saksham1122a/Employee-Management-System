// Test authentication from frontend
console.log('Testing authentication from frontend...');

fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'sakshamnnda01@gmail.com',
    password: 'sakshamadmin@#'
  })
})
.then(response => {
  console.log('Login Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Login response:', data);
  if (data.token) {
    console.log('✅ Token received:', data.token.substring(0, 30) + '...');
    
    // Test the token with users endpoint
    return fetch('http://localhost:5000/api/auth/users', {
      headers: {
        'Authorization': `Bearer ${data.token}`
      }
    });
  }
})
.then(response => {
  console.log('Users API Status:', response.status);
  return response.json();
})
.then(users => {
  console.log('✅ Users fetched:', users.length);
  users.forEach((user, index) => {
    console.log(`  ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
  });
})
.catch(error => {
  console.error('❌ Error:', error);
});
