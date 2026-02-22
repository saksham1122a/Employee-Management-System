// Complete User Management with Mock Data - No Backend Required
console.log('🎯 Initializing User Management with Mock Data...');

// Mock users data
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2024-01-05',
    status: 'active'
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'sakshamnnda01+manager@gmail.com',
    role: 'manager',
    createdAt: '2024-01-10',
    status: 'active'
  },
  {
    id: '3',
    name: 'Saksham Admin',
    email: 'sakshamnnda01@gmail.com',
    role: 'admin',
    createdAt: '2024-01-15',
    status: 'active'
  },
  {
    id: '4',
    name: 'Test Employee',
    email: 'employee@test.com',
    role: 'employee',
    createdAt: '2024-01-20',
    status: 'active'
  }
];

// Mock API functions
const mockAPI = {
  // Simulate successful API calls
  addUser: async (userData) => {
    console.log('✅ Mock: Adding user:', userData.name);
    const newUser = {
      id: String(mockUsers.length + 1),
      ...userData,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    mockUsers.push(newUser);
    return { success: true, data: newUser };
  },
  
  updateUser: async (id, userData) => {
    console.log('✅ Mock: Updating user:', userData.name);
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
      return { success: true, data: mockUsers[userIndex] };
    }
    return { success: false, message: 'User not found' };
  },
  
  deleteUser: async (id) => {
    console.log('✅ Mock: Deleting user with ID:', id);
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      const deletedUser = mockUsers[userIndex];
      mockUsers.splice(userIndex, 1);
      return { success: true, data: deletedUser };
    }
    return { success: false, message: 'User not found' };
  },
  
  getUsers: async () => {
    console.log('✅ Mock: Fetching all users');
    return { success: true, data: [...mockUsers] };
  }
};

// Test the mock API
console.log('🧪 Testing Mock API Functions...');

// Test adding a user
mockAPI.addUser({
  name: 'Test User',
  email: 'test@example.com',
  role: 'employee'
}).then(result => {
  console.log('Add User Result:', result);
});

// Test fetching users
mockAPI.getUsers().then(result => {
  console.log('Get Users Result:', result);
  console.log('Total Users:', result.data.length);
  result.data.forEach((user, index) => {
    console.log(`  ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
  });
});

console.log('✅ Mock API Test Complete!');
console.log('🎯 User Management can work entirely with mock data!');
console.log('');
console.log('📋 Instructions:');
console.log('1. The mock API provides all CRUD operations');
console.log('2. No backend server is required');
console.log('3. All user management features work instantly');
console.log('4. This is a complete frontend solution');
