import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiEdit2, FiTrash2, FiPlus, FiSearch, FiFilter, FiChevronDown } from 'react-icons/fi';
import './User.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);

  // Form states for adding/editing users
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'employee', createdAt: '2024-01-15', status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'manager', createdAt: '2024-01-10', status: 'active' },
      { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: '2024-01-05', status: 'active' },
      { id: 4, name: 'Mike Johnson', email: 'mike@example.com', role: 'employee', createdAt: '2024-01-20', status: 'inactive' },
    ];
    
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = async () => {
    try {
      // API call to add user
      const newUser = {
        id: users.length + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      
      setUsers([...users, newUser]);
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', role: 'employee' });
      
      console.log('User added:', newUser);
    } catch (error) {
      console.error('Error adding user:', error);
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

  const handleUpdateUser = async () => {
    try {
      // API call to update user
      const updatedUsers = users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      );
      
      setUsers(updatedUsers);
      setShowEditModal(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'employee' });
      
      console.log('User updated:', editingUser.id);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    try {
      // API call to delete user
      const updatedUsers = users.filter(user => user.id !== deletingUser.id);
      setUsers(updatedUsers);
      setShowDeleteModal(false);
      setDeletingUser(null);
      
      console.log('User deleted:', deletingUser.id);
    } catch (error) {
      console.error('Error deleting user:', error);
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
                <th>Created</th>
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
                  <td>{user.createdAt}</td>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button 
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <FiTrash2 className="warning-icon" />
                <p>Are you sure you want to delete this user?</p>
                <p><strong>{deletingUser.name}</strong> ({deletingUser.email})</p>
              </div>
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
    </div>
  );
};

export default UserManagement;