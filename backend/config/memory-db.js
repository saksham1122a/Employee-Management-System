// Simple in-memory database for demo purposes
// In production, replace with actual MongoDB connection

let users = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password', 
    role: 'admin',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    _id: '2',
    name: 'Manager User',
    email: 'sakshamnnda01+manager@gmail.com',
    password: 'sakshammanager@#', 
    role: 'manager',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    _id: '3',
    name: 'Saksham Admin',
    email: 'sakshamnnda01@gmail.com',
    password: 'sakshamadmin@#', 
    role: 'admin',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

const connectDB = async () => {
  console.log("📊 In-memory database connected successfully");
  return Promise.resolve();
};

const getUserModel = () => {
  return {
    findOne: async (query) => {
      if (query.email) {
        return users.find(user => user.email === query.email) || null;
      }
      if (query._id) {
        return users.find(user => user._id === query._id) || null;
      }
      return null;
    },
    
    find: async () => {
      console.log('🔍 find() method called');
      console.log('Current users:', users.length);
      const usersArray = users.map(user => ({ ...user }));
      console.log('Users array created:', usersArray.length);
      
      // Return an object with a select method that works properly
      const result = {
        select: (fields) => {
          console.log('🔍 select() called with fields:', fields);
          if (fields === '-password') {
            console.log('🔍 Filtering password field');
            return usersArray.map(user => {
              const { password, ...rest } = user;
              return rest;
            });
          }
          return usersArray;
        }
      };
      
      console.log('🔍 Returning result object with select method');
      return result;
    },
    
    create: async (userData) => {
      const newUser = {
        _id: String(users.length + 1),
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      users.push(newUser);
      return newUser;
    },
    
    findByIdAndUpdate: async (id, updateData, options) => {
      const userIndex = users.findIndex(user => user._id === id);
      if (userIndex === -1) return null;
      
      users[userIndex] = {
        ...users[userIndex],
        ...updateData,
        updatedAt: new Date()
      };
      
      const model = { ...users[userIndex] };
      const selectModel = { select: (fields) => {
        if (fields === '-password') {
          const { password, ...rest } = model;
          return rest;
        }
        return model;
      }};
      
      return options?.new ? selectModel.select('-password') : selectModel.select('-password');
    },
    
    findByIdAndDelete: async (id) => {
      const userIndex = users.findIndex(user => user._id === id);
      if (userIndex === -1) return null;
      
      const deletedUser = users[userIndex];
      users.splice(userIndex, 1);
      return deletedUser;
    }
  };
};

module.exports = { connectDB, getUserModel };
