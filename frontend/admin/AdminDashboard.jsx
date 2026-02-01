import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiUsers, 
  FiTrendingUp, 
  FiSettings, 
  FiLogOut,
  FiHome,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiBarChart2,
  FiUserPlus,
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiDownload,
  FiBell,
  FiMenu,
  FiX
} from 'react-icons/fi';
import '../admin/AdminDashboard.css';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalRevenue: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching data
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Employee', status: 'Active', joinDate: '2024-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active', joinDate: '2024-01-10' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'HR', status: 'Inactive', joinDate: '2023-12-20' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Employee', status: 'Active', joinDate: '2024-02-01' },
      { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'Employee', status: 'Active', joinDate: '2024-01-25' }
    ];

    setUsers(mockUsers);
    setStats({
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.filter(u => u.status === 'Active').length,
      newUsers: 2,
      totalRevenue: 125000
    });
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <FiHome /> },
    { id: 'users', label: 'Users', icon: <FiUsers /> },
    { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 /> },
    { id: 'departments', label: 'Departments', icon: <FiBriefcase /> },
    { id: 'attendance', label: 'Attendance', icon: <FiCalendar /> },
    { id: 'payroll', label: 'Payroll', icon: <FiDollarSign /> },
    { id: 'reports', label: 'Reports', icon: <FiTrendingUp /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> }
  ];

  const quickActions = [
    { label: 'Add User', icon: <FiUserPlus />, action: () => navigate('/admin/add-user') },
    { label: 'Generate Report', icon: <FiDownload />, action: () => console.log('Generate report') },
    { label: 'System Settings', icon: <FiSettings />, action: () => setActiveTab('settings') }
  ];

  const recentActivities = [
    { id: 1, action: 'New user registered', user: 'Alice Cooper', time: '2 hours ago', icon: <FiUserPlus />, color: '#2ecc71' },
    { id: 2, action: 'System backup completed', user: 'System', time: '4 hours ago', icon: <FiCheckCircle />, color: '#3498db' },
    { id: 3, action: 'Failed login attempt', user: 'Unknown', time: '6 hours ago', icon: <FiAlertCircle />, color: '#e74c3c' },
    { id: 4, action: 'Database updated', user: 'System', time: '8 hours ago', icon: <FiActivity />, color: '#f39c12' }
  ];

  const handleLogout = () => {
    // Handle logout logic
    navigate('/login');
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FiUsers />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                  <span className="stat-change positive">+12%</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FiActivity />
                </div>
                <div className="stat-info">
                  <h3>{stats.activeUsers}</h3>
                  <p>Active Users</p>
                  <span className="stat-change positive">+8%</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FiUserPlus />
                </div>
                <div className="stat-info">
                  <h3>{stats.newUsers}</h3>
                  <p>New Users</p>
                  <span className="stat-change positive">+25%</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FiDollarSign />
                </div>
                <div className="stat-info">
                  <h3>${stats.totalRevenue.toLocaleString()}</h3>
                  <p>Revenue</p>
                  <span className="stat-change positive">+15%</span>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="card">
                <div className="card-header">
                  <h3>Recent Activities</h3>
                  <button className="btn-icon">
                    <FiFilter />
                  </button>
                </div>
                <div className="activity-list">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon" style={{ color: activity.color }}>
                        {activity.icon}
                      </div>
                      <div className="activity-details">
                        <p className="activity-action">{activity.action}</p>
                        <p className="activity-meta">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="quick-actions-grid">
                  {quickActions.map((action, index) => (
                    <button key={index} className="quick-action-btn" onClick={action.action}>
                      <div className="action-icon">{action.icon}</div>
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="users-management">
            <div className="card">
              <div className="card-header">
                <h3>User Management</h3>
                <div className="card-actions">
                  <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="btn-primary">
                    <FiUserPlus /> Add User
                  </button>
                </div>
              </div>
              <div className="table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Join Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">{user.name.charAt(0)}</div>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className="role-badge">{user.role}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.status.toLowerCase()}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{user.joinDate}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-icon" title="Edit">
                              <FiEdit />
                            </button>
                            <button className="btn-icon delete" title="Delete">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="coming-soon">
            <div className="coming-soon-content">
              <h2>Coming Soon</h2>
              <p>This section is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <h2>TeamBuddy</h2>
            <span>Admin</span>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="mobile-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FiMenu />
            </button>
            <h1>Admin Dashboard</h1>
          </div>
          
          <div className="header-right">
            <button className="notification-btn">
              <FiBell />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-profile">
              <div className="user-avatar">A</div>
              <div className="user-info">
                <span className="user-name">Admin User</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="dashboard-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;