// Defines endpoints:

// POST /api/auth/register

// POST /api/auth/login

// PUT /api/auth/update-name

// GET /api/auth/users

// POST /api/auth/users

// PUT /api/auth/users/:id

// DELETE /api/auth/users/:id



const express = require("express");
const path = require("path");
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images and PDFs only
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG, GIF, and PDF files are allowed!'));
    }
  }
});

const { registerUser, loginUser, updateUserName, getAllUsers, createUser, updateUser, deleteUser, getAllEmployees, createLeaveRequest, getLeaveRequests, getAllLeaveRequests, updateLeaveRequest, deleteLeaveRequest, updateAttendance } = require("./auth.controller.js");

const { authMiddleware, requireAdmin } = require("./auth.middleware.js");



const router = express.Router();



// Public routes

router.post("/register", registerUser);

router.post("/login", loginUser);



// Protected routes

router.put("/update-name", authMiddleware, updateUserName);



// Admin only routes

router.get("/users", authMiddleware, requireAdmin, getAllUsers);

router.post("/users", authMiddleware, requireAdmin, createUser);

router.put("/users/:id", authMiddleware, requireAdmin, updateUser);

router.delete("/users/:id", authMiddleware, requireAdmin, deleteUser);



// Manager routes (managers can view employees)

router.get("/employees", authMiddleware, getAllEmployees);

// Leave management routes
router.post("/leave/request", authMiddleware, upload.single('attachment'), createLeaveRequest);
router.get("/leave/requests", authMiddleware, getLeaveRequests);
router.get("/leave/requests/all", authMiddleware, getAllLeaveRequests);
router.put("/leave/requests/:id", authMiddleware, updateLeaveRequest);
router.delete("/leave/requests/:id", authMiddleware, deleteLeaveRequest);

// Attendance management routes
router.put("/attendance", authMiddleware, updateAttendance);


module.exports = router;