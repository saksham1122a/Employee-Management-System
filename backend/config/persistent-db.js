// MongoDB Atlas persistent database adapter
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

// Define Schema for database state storage
const DbStoreSchema = new mongoose.Schema({
  key: { type: String, default: 'ems_db_store', unique: true },
  data: { type: Object, required: true }
}, { timestamps: true });

const DbStore = mongoose.model('DbStore', DbStoreSchema);

let dbInMemory = { users: [] };

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
  ],
  leaveRequests: []
};

// Connect to MongoDB and fetch database state
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://sakshamwork47_db_user:lYuBBxY2e6NmpMdx@sakshamems.fripeyu.mongodb.net/";
    console.log("🔌 Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("📊 Connected to MongoDB Atlas successfully");

    // Fetch state document
    let record = await DbStore.findOne({ key: 'ems_db_store' });
    if (record) {
      dbInMemory = record.data;
      console.log("📦 Database state loaded from MongoDB Atlas");
    } else {
      console.log("⚠️ No database state found in MongoDB Atlas. Initializing...");
      
      // Fallback: load from local file if exists
      if (fs.existsSync(DB_FILE)) {
        try {
          const fileData = fs.readFileSync(DB_FILE, 'utf8');
          dbInMemory = JSON.parse(fileData);
          console.log("📂 Loaded state from local database.json file");
        } catch (e) {
          dbInMemory = initialData;
        }
      } else {
        dbInMemory = initialData;
      }

      // Save initial data to MongoDB
      await DbStore.create({ key: 'ems_db_store', data: dbInMemory });
      console.log("📊 Database state initialized in MongoDB Atlas");
    }
  } catch (error) {
    console.error("❌ MongoDB Atlas connection failed:", error);
    process.exit(1);
  }
};

// Load data from memory
const loadData = () => {
  return dbInMemory;
};

// Save data to memory and push asynchronously to MongoDB Atlas
const saveData = (data) => {
  dbInMemory = data;
  
  // Update MongoDB state document asynchronously
  DbStore.updateOne({ key: 'ems_db_store' }, { data }, { upsert: true })
    .then(() => {
      console.log('💾 Data successfully synced with MongoDB Atlas');
      // Also write locally as a backup
      fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), (err) => {
        if (err) console.error('❌ Error saving local backup:', err);
      });
    })
    .catch(error => {
      console.error('❌ Error syncing with MongoDB Atlas:', error);
    });
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
