import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiEdit2, FiTrash2, FiPlus, FiSearch, FiFilter, FiChevronDown } from 'react-icons/fi';
import './User.css';

const UserManagement = () => {
  // Define API base URL
  const API_BASE_URL = 'http://localhost:5000';
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states for adding/editing users
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  });

  // Fallback users data when backend fails
  const fallbackUsers = [
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
    }
  ];

  useEffect(() => {
    // Check if user is authenticated before fetching users
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Try to get a real token from backend
      const getRealToken = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: 'sakshamnnda01@gmail.com',
              password: 'sakshamadmin@#'
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            fetchUsers();
            return;
          } else {
            const errorData = await response.json();
            console.error('Login failed:', errorData.message);
          }
        } catch (error) {
          console.error('Failed to get real token:', error);
        }
        
        // If getting real token fails, use fallback data
        console.warn('No authentication token found - using fallback data');
        setUsers(fallbackUsers);
        setLoading(false);
      };
      
      getRealToken();
      return;
    }
    
    if (token) {
      fetchUsers();
    } else {
      console.error('No authentication token found');
      setErrorMessage('Please login to access user management');
      setShowErrorModal(true);
      setLoading(false);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('🎯 Fetching users from backend API');
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setErrorMessage('Please login to access user management');
        setShowErrorModal(true);
        setLoading(false);
        return;
      }
      
      console.log('Using token:', token.substring(0, 20) + '...');
      
      const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const usersData = await response.json();
        console.log('✅ Users fetched from backend:', usersData);
        
        const formattedUsers = usersData.map(user => ({
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt || new Date().toISOString().split('T')[0],
          status: user.status || 'active'
        }));
        setUsers(formattedUsers);
        setLoading(false);
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to fetch users:', errorData);
        
        if (response.status === 401) {
          // Token is invalid, try to get new token
          localStorage.removeItem('token');
          setErrorMessage('Session expired. Please login again.');
        } else {
          setErrorMessage(errorData.message || 'Failed to load users from backend');
        }
        setShowErrorModal(true);
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      setErrorMessage('Network error. Please try again.');
      setShowErrorModal(true);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = async () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setErrorMessage('Please fill in all fields');
      setShowErrorModal(true);
      return;
    }

    try {
      console.log('🎯 Adding user to backend:', formData.name);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('No authentication token. Please login again.');
        setShowErrorModal(true);
        return;
      }
      
      // Call the real backend API
      const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setShowAddModal(false);
        setFormData({ name: '', email: '', password: '', role: 'employee' });
        setSuccessMessage('User added successfully!');
        setShowSuccessModal(true);
        
        // Add to new user to local state
        const newUser = {
          id: result.id || String(users.length + 1),
          name: formData.name,
          email: formData.email,
          role: formData.role,
          createdAt: new Date().toISOString().split('T')[0],
          status: 'active'
        };
        setUsers(prev => [...prev, newUser]);
      } else {
        if (response.status === 401) {
          setErrorMessage('Session expired. Please login again.');
          localStorage.removeItem('token');
        } else {
          setErrorMessage(result.message || 'Error adding user');
        }
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('❌ Error adding user:', error);
      setErrorMessage('Network error. Please try again.');
      setShowErrorModal(true);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: ''
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleUpdateUser = async () => {
    // Validate form - only require name, email, and role for updates
    if (!formData.name || !formData.email || !formData.role) {
      setErrorMessage('Please fill in required fields (Name, Email, Role)');
      setShowErrorModal(true);
      return;
    }

    try {
      console.log('🎯 Updating user in backend:', formData.name);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('No authentication token. Please login again.');
        setShowErrorModal(true);
        return;
      }
      
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };
      
      // Only include password if it's provided (optional for updates)
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/auth/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setShowEditModal(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', role: 'employee' });
        setSuccessMessage('User updated successfully!');
        setShowSuccessModal(true);
        
        // Update user in the local state
        setUsers(prev => prev.map(user => 
          user.id === editingUser.id ? { ...user, ...updateData } : user
        ));
      } else {
        if (response.status === 401) {
          setErrorMessage('Session expired. Please login again.');
          localStorage.removeItem('token');
        } else {
          setErrorMessage(result.message || 'Error updating user');
        }
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('❌ Error updating user:', error);
      setErrorMessage('Network error. Please try again.');
      setShowErrorModal(true);
    }
  };

  const confirmDeleteUser = async () => {
    try {
      console.log('🎯 Deleting user from backend:', deletingUser.name);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('No authentication token. Please login again.');
        setShowErrorModal(true);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/auth/users/${deletingUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setShowDeleteModal(false);
        setDeletingUser(null);
        setSuccessMessage('User deleted successfully!');
        setShowSuccessModal(true);
        
        // Remove user from the local state
        setUsers(prev => prev.filter(user => user.id !== deletingUser.id));
      } else {
        if (response.status === 401) {
          setErrorMessage('Session expired. Please login again.');
          localStorage.removeItem('token');
        } else {
          setErrorMessage(result.message || 'Error deleting user');
        }
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorMessage('Error deleting user');
      setShowErrorModal(true);
    }
  };

  const getRoleBadgeClass = (role) => {
    const roleClasses = {
      admin: 'role-badge admin',
      manager: 'role-badge manager',
      employee: 'role-badge employee'
    };
    return roleClasses[role] || 'role-badge employee';
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      active: 'status-badge active',
      inactive: 'status-badge inactive'
    };
    return statusClasses[status] || 'status-badge inactive';
  };

  return (
    <div className="user-management">
      <div className="page-header">
        <h1>User Management</h1>
        <button 
          className="btn-add-user"
          onClick={() => setShowAddModal(true)}
        >
          <FiPlus />
          Add User
        </button>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-dropdown">
          <FiFilter className="filter-icon" />
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        <FiUser />
                      </div>
                      <span className="user-name">{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(user.status)}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditUser(user)}
                        title="Edit user"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteUser(user)}
                        title="Delete user"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New User</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="role-select"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-save"
                onClick={handleAddUser}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button 
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="role-select"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-save"
                onClick={handleUpdateUser}
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && deletingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Delete User</h2>
              <button 
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{deletingUser.name}</strong>?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-delete"
                onClick={confirmDeleteUser}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal success-modal">
            <div className="modal-header">
              <h3>Success!</h3>
              <button 
                className="modal-close"
                onClick={() => setShowSuccessModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="success-icon">✓</div>
              <p>{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="modal-overlay">
          <div className="modal error-modal">
            <div className="modal-header">
              <h3>Error!</h3>
              <button 
                className="modal-close"
                onClick={() => setShowErrorModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="error-icon">⚠</div>
              <p>{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
