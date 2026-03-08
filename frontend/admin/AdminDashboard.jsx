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
import UserManagement from './User';
import Navbar from '../src/Components/Navbar';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalRevenue: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
   
    setStats({
      totalUsers: 4,
      activeUsers: 3,
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
    { label: 'Manage Users', icon: <FiUserPlus />, action: () => setActiveTab('users') },
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
        return <UserManagement />;

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
          <Navbar />
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