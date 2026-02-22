// Authentication controller functions

const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword, generateToken } = require("../utils/hashPassword.js");
const { getUserModel, loadData, saveData } = require("../config/persistent-db.js");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('🔍 Register user data:', { name, email, password: '***' });

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const User = getUserModel();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role: 'employee' // Default role for signup
    };

    console.log('🔍 Creating user with data:', { ...userData, password: '***' });

    const user = await User.create(userData);

    console.log('✅ User created:', { id: user._id, email: user.email, role: user.role });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔍 Login attempt:", { email }); // Debug log

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const User = getUserModel();
    const user = await User.findOne({ email });

    console.log("👤 User found:", user ? { id: user._id, email: user.email, role: user.role } : null); // Debug log

    if (!user) {
      console.log("❌ User not found in database"); // Debug log
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);

    console.log("🔐 Password match:", isMatch); // Debug log

    if (!isMatch) {
      console.log("❌ Password does not match"); // Debug log
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    console.log("🎫 Token generated for user:", user.email); // Debug log

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error); // Debug log
    res.status(500).json({ message: error.message });
  }
};

const updateUserName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Find user by ID (you'll need to get user ID from JWT token)
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const User = getUserModel();
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { name: name.trim() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Name updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const User = getUserModel();
    const findResult = await User.find();
    const users = findResult.select('-password');

    res.status(200).json(users);
  } catch (error) {
    console.error('❌ getAllUsers error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Separate function for managers to view employees (no admin requirement)
const getAllEmployees = async (req, res) => {
  try {
    const User = getUserModel();
    const findResult = await User.find();
    const users = findResult.select('-password');

    // Filter to show only employees
    const employees = users.filter(user => user.role === 'employee');

    res.status(200).json(employees);
  } catch (error) {
    console.error('❌ getAllEmployees error:', error);
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const User = getUserModel();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        status: 'active'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: "Name, email, and role are required" });
    }

    const User = getUserModel();
    const updateData = { name, email, role };

    if (password) {
      updateData.password = await hashPassword(password);
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        status: 'active'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const User = getUserModel();
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLeaveRequest = async (req, res) => {
  try {
    const { type, startDate, endDate, reason, emergencyContact, emergencyPhone, attachment } = req.body;
    
    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }
    
    // Calculate days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    if (days <= 0) {
      return res.status(400).json({ message: "End date must be after start date" });
    }
    
    // Get user info from token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const data = loadData();
    
    // Initialize leaveRequests array if it doesn't exist
    if (!data.leaveRequests) {
      data.leaveRequests = [];
    }
    
    const newLeaveRequest = {
      id: String(data.leaveRequests.length + 1),
      type,
      startDate,
      endDate,
      days,
      status: 'pending',
      reason,
      appliedOn: new Date().toISOString().split('T')[0],
      approvedBy: '--',
      approvedOn: '--',
      employeeId: decoded.id,
      employeeName: decoded.name,
      employeeEmail: decoded.email,
      emergencyContact: emergencyContact || '',
      emergencyPhone: emergencyPhone || '',
      attachment: attachment || null
    };
    
    data.leaveRequests.push(newLeaveRequest);
    saveData(data);
    
    res.status(201).json({
      message: "Leave request submitted successfully",
      leaveRequest: newLeaveRequest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeaveRequests = async (req, res) => {
  try {
    // Get user info from token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const data = loadData();
    
    // Get leave requests for the current user
    const userLeaveRequests = data.leaveRequests ? 
      data.leaveRequests.filter(leave => leave.employeeId === decoded.id) : [];
    
    res.status(200).json(userLeaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedBy, rejectionReason } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    
    const data = loadData();
    
    // Find the leave request
    const leaveRequestIndex = data.leaveRequests.findIndex(leave => leave.id === id);
    
    if (leaveRequestIndex === -1) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    
    // Update the leave request
    data.leaveRequests[leaveRequestIndex] = {
      ...data.leaveRequests[leaveRequestIndex],
      status,
      approvedBy: approvedBy || '--',
      approvedOn: new Date().toISOString().split('T')[0],
      rejectionReason: rejectionReason || null
    };
    
    saveData(data);
    
    res.status(200).json({
      message: "Leave request updated successfully",
      leaveRequest: data.leaveRequests[leaveRequestIndex]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const User = getUserModel();
    const data = loadData();
    
    // Find the leave request
    const leaveRequestIndex = data.leaveRequests.findIndex(leave => leave.id === id);
    
    if (leaveRequestIndex === -1) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    
    const leaveRequest = data.leaveRequests[leaveRequestIndex];
    
    // Check if the user owns this leave request
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (leaveRequest.employeeId !== decoded.id) {
      return res.status(403).json({ message: "Not authorized to delete this leave request" });
    }
    
    // Remove the leave request
    data.leaveRequests.splice(leaveRequestIndex, 1);
    saveData(data);
    
    res.status(200).json({
      message: "Leave request deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUserName,
  getAllUsers,
  getAllEmployees,
  createUser,
  updateUser,
  deleteUser,
  createLeaveRequest,
  getLeaveRequests,
  updateLeaveRequest,
  deleteLeaveRequest,
};
