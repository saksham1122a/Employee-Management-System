// Defines endpoints:



// POST /api/auth/register

// POST /api/auth/login

// PUT /api/auth/update-name

// GET /api/auth/users

// POST /api/auth/users

// PUT /api/auth/users/:id

// DELETE /api/auth/users/:id



const express = require("express");

const { registerUser, loginUser, updateUserName, getAllUsers, createUser, updateUser, deleteUser, getAllEmployees, createLeaveRequest, getLeaveRequests, updateLeaveRequest, deleteLeaveRequest } = require("./auth.controller.js");

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
router.post("/leave/request", authMiddleware, createLeaveRequest);
router.get("/leave/requests", authMiddleware, getLeaveRequests);
router.put("/leave/requests/:id", authMiddleware, updateLeaveRequest);
router.delete("/leave/requests/:id", authMiddleware, deleteLeaveRequest);


module.exports = router;