// File-based persistent database
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database file if it doesn't exist
const initializeDatabase = () => {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [
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
      ]
    };
    
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    console.log('📊 Database file initialized');
  }
};

// Load data from file
const loadData = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('❌ Error loading database:', error);
  }
  return { users: [] };
};

// Save data to file
const saveData = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    console.log('💾 Data saved to database');
  } catch (error) {
    console.error('❌ Error saving database:', error);
  }
};

const connectDB = async () => {
  initializeDatabase();
  console.log("📊 Persistent database connected successfully");
  return Promise.resolve();
};

const getUserModel = () => {
  return {
    findOne: async (query) => {
      const data = loadData();
      if (query.email) {
        return data.users.find(user => user.email === query.email) || null;
      }
      if (query._id) {
        return data.users.find(user => user._id === query._id) || null;
      }
      return null;
    },
    
    find: async () => {
      const data = loadData();
      console.log('Current users:', data.users.length);
      console.log('Users array created:', data.users.length);
      
      return {
        select: (fields) => {
          if (fields === '-password') {
            const usersWithoutPassword = data.users.map(user => {
              const { password, ...userWithoutPassword } = user;
              return userWithoutPassword;
            });
            console.log('🔍 Returning result object with select method');
            return usersWithoutPassword;
          }
          return data.users;
        }
      };
    },
    
    create: async (userData) => {
      const data = loadData();
      const newUser = {
        _id: String(data.users.length + 1),
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      data.users.push(newUser);
      saveData(data);
      
      console.log('✅ User created and saved:', newUser.email);
      return newUser;
    },
    
    findByIdAndUpdate: async (id, updateData, options) => {
      const data = loadData();
      const userIndex = data.users.findIndex(user => user._id === id);
      
      if (userIndex !== -1) {
        data.users[userIndex] = {
          ...data.users[userIndex],
          ...updateData,
          updatedAt: new Date()
        };
        
        saveData(data);
        
        if (options && options.new) {
          const user = data.users[userIndex];
          if (options.select === '-password') {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
          }
          return user;
        }
        
        return data.users[userIndex];
      }
      
      return null;
    },
    
    findByIdAndDelete: async (id) => {
      const data = loadData();
      const userIndex = data.users.findIndex(user => user._id === id);
      
      if (userIndex !== -1) {
        const deletedUser = data.users[userIndex];
        data.users.splice(userIndex, 1);
        saveData(data);
        return deletedUser;
      }
      
      return null;
    }
  };
};

module.exports = {
  connectDB,
  getUserModel,
  loadData,
  saveData
};
