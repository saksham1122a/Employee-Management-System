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
  FiX,
  FiUserCheck
} from 'react-icons/fi';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    teamPerformance: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching employee data
    const mockEmployees = [
      { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering', status: 'Present', attendance: '95%', joinDate: '2024-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing', status: 'Present', attendance: '92%', joinDate: '2024-01-10' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', department: 'Sales', status: 'Absent', attendance: '88%', joinDate: '2023-12-20' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', department: 'Engineering', status: 'Present', attendance: '96%', joinDate: '2024-02-01' },
      { id: 5, name: 'Tom Brown', email: 'tom@example.com', department: 'HR', status: 'Leave', attendance: '90%', joinDate: '2024-01-25' }
    ];

    setEmployees(mockEmployees);
    setStats({
      totalEmployees: mockEmployees.length,
      presentToday: mockEmployees.filter(e => e.status === 'Present').length,
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
    { id: 3, action: 'New team member joined', user: 'Tom Brown', time: '6 hours ago', icon: <FiUserPlus />, color: '#9b59b6' },
    { id: 4, action: 'Performance review completed', user: 'System', time: '8 hours ago', icon: <FiActivity />, color: '#f39c12' }
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
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

      case 'employees':
        return (
          <div className="employees-management">
            <div className="card">
              <div className="card-header">
                <h3>My Team</h3>
                <div className="card-actions">
                  <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="btn-primary">
                    <FiUserPlus /> Add Employee
                  </button>
                </div>
              </div>
              <div className="table-container">
                <table className="employees-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Attendance</th>
                      <th>Join Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map(employee => (
                      <tr key={employee.id}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">{employee.name.charAt(0)}</div>
                            <div>
                              <span className="employee-name">{employee.name}</span>
                              <span className="employee-email">{employee.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="department-badge">{employee.department}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${employee.status.toLowerCase()}`}>
                            {employee.status}
                          </span>
                        </td>
                        <td>
                          <span className="attendance-badge">{employee.attendance}</span>
                        </td>
                        <td>{employee.joinDate}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-icon" title="View Details">
                              <FiEdit />
                            </button>
                            <button className="btn-icon" title="Send Message">
                              <FiBell />
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

      case 'attendance':
        return (
          <div className="attendance-management">
            <div className="card">
              <div className="card-header">
                <h3>Attendance Management</h3>
                <button className="btn-primary">
                  <FiCheckCircle /> Mark All Present
                </button>
              </div>
              <div className="attendance-grid">
                {employees.map(employee => (
                  <div key={employee.id} className="attendance-card">
                    <div className="attendance-header">
                      <div className="user-avatar">{employee.name.charAt(0)}</div>
                      <div>
                        <h4>{employee.name}</h4>
                        <p>{employee.department}</p>
                      </div>
                    </div>
                    <div className="attendance-status">
                      <span className={`status-badge ${employee.status.toLowerCase()}`}>
                        {employee.status}
                      </span>
                      <span className="attendance-percentage">{employee.attendance}</span>
                    </div>
                    <div className="attendance-actions">
                      <button className="btn-small btn-success">Present</button>
                      <button className="btn-small btn-warning">Late</button>
                      <button className="btn-small btn-danger">Absent</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'leaves':
        return (
          <div className="leaves-management">
            <div className="card">
              <div className="card-header">
                <h3>Leave Requests</h3>
                <div className="card-actions">
                  <button className="btn-primary">
                    <FiCalendar /> View Calendar
                  </button>
                </div>
              </div>
              <div className="leaves-list">
                {employees.filter(e => e.status === 'Leave' || e.status === 'Absent').map(employee => (
                  <div key={employee.id} className="leave-card">
                    <div className="leave-info">
                      <div className="user-avatar">{employee.name.charAt(0)}</div>
                      <div>
                        <h4>{employee.name}</h4>
                        <p>{employee.department}</p>
                        <p className="leave-reason">Personal Leave</p>
                      </div>
                    </div>
                    <div className="leave-actions">
                      <button className="btn-small btn-success">Approve</button>
                      <button className="btn-small btn-danger">Reject</button>
                    </div>
                  </div>
                ))}
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
