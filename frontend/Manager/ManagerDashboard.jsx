import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiTrendingUp, 
  FiSettings, 
  FiLogOut,
  FiHome,
  FiUsers,
  FiBarChart2,
  FiActivity,
  FiCheckCircle,
  FiDownload,
  FiBell,
  FiMenu,
  FiX,
  FiUserCheck,
  FiCalendar
} from 'react-icons/fi';
import './ManagerDashboard.css';
import MyTeam from './MyTeam';
import Attendance from './Attendance';
import LeaveRequest from './LeaveRequest';

const ManagerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    teamPerformance: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching stats
    setStats({
      totalEmployees: 5,
      presentToday: 3,
      pendingLeaves: 2,
      teamPerformance: 92
    });
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <FiHome /> },
    { id: 'employees', label: 'My Team', icon: <FiUsers /> },
    { id: 'attendance', label: 'Attendance', icon: <FiCalendar /> },
    { id: 'leaves', label: 'Leave Requests', icon: <FiCalendar /> },
    { id: 'performance', label: 'Performance', icon: <FiBarChart2 /> },
    { id: 'reports', label: 'Reports', icon: <FiTrendingUp /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> }
  ];

  const quickActions = [
    { label: 'Approve Attendance', icon: <FiCheckCircle />, action: () => setActiveTab('attendance') },
    { label: 'Review Leaves', icon: <FiCalendar />, action: () => setActiveTab('leaves') },
    { label: 'Team Report', icon: <FiDownload />, action: () => console.log('Generate team report') }
  ];

  const recentActivities = [
    { id: 1, action: 'Attendance marked for team', user: 'System', time: '2 hours ago', icon: <FiCalendar />, color: '#2ecc71' },
    { id: 2, action: 'Leave request approved', user: 'Jane Smith', time: '4 hours ago', icon: <FiCheckCircle />, color: '#3498db' },
    { id: 3, action: 'New team member joined', user: 'Tom Brown', time: '6 hours ago', icon: <FiUserCheck />, color: '#9b59b6' },
    { id: 4, action: 'Performance review completed', user: 'System', time: '8 hours ago', icon: <FiActivity />, color: '#f39c12' }
  ];

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
                  <h3>{stats.totalEmployees}</h3>
                  <p>Total Employees</p>
                  <span className="stat-change positive">+2 this month</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FiUserCheck />
                </div>
                <div className="stat-info">
                  <h3>{stats.presentToday}</h3>
                  <p>Present Today</p>
                  <span className="stat-change positive">85% attendance</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FiCalendar />
                </div>
                <div className="stat-info">
                  <h3>{stats.pendingLeaves}</h3>
                  <p>Pending Leaves</p>
                  <span className="stat-change neutral">2 requests</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FiTrendingUp />
                </div>
                <div className="stat-info">
                  <h3>{stats.teamPerformance}%</h3>
                  <p>Team Performance</p>
                  <span className="stat-change positive">+5% improvement</span>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="card">
                <div className="card-header">
                  <h3>Recent Activities</h3>
                  <button className="btn-icon">
                    <FiActivity />
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

      case 'employees':
        return <MyTeam />;

      case 'attendance':
        return <Attendance />;

      case 'leaves':
        return <LeaveRequest />;

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

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="manager-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <h2>TeamBuddy</h2>
            <span>Manager</span>
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
            <h1>Manager Dashboard</h1>
          </div>
          
          <div className="header-right">
            <button className="notification-btn">
              <FiBell />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-profile">
              <div className="user-avatar">M</div>
              <div className="user-info">
                <span className="user-name">Manager User</span>
                <span className="user-role">Team Manager</span>
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

export default ManagerDashboard;
