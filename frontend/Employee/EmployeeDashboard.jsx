import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCalendar, FiCheckSquare, FiLogOut, FiMenu, FiX, 
  FiClock, FiUser, FiSun, FiMoon, FiCheck, FiXCircle
} from 'react-icons/fi';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('attendance');
  const navigate = useNavigate();

  const [attendanceData, setAttendanceData] = useState({
    todayStatus: 'not-checked-in',
    checkIn: '--:--',
    checkOut: '--:--',
    totalHours: '0h 0m'
  });

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete project documentation', priority: 'high', status: 'pending', dueDate: '2024-01-30' },
    { id: 2, title: 'Review code changes', priority: 'medium', status: 'in-progress', dueDate: '2024-01-28' },
    { id: 3, title: 'Team meeting preparation', priority: 'low', status: 'completed', dueDate: '2024-01-25' }
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, type: 'Sick Leave', startDate: '2024-02-01', endDate: '2024-02-02', status: 'pending', reason: 'Medical appointment' },
    { id: 2, type: 'Annual Leave', startDate: '2024-01-15', endDate: '2024-01-17', status: 'approved', reason: 'Family vacation' }
  ]);

  const menuItems = [
    { id: 'attendance', label: 'Attendance', icon: <FiCalendar /> },
    { id: 'tasks', label: 'Tasks', icon: <FiCheckSquare /> },
    { id: 'leave', label: 'Leave', icon: <FiClock /> }
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  const handleCheckIn = () => {
    const now = new Date();
    const checkInTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setAttendanceData(prev => ({
      ...prev,
      checkIn: checkInTime,
      todayStatus: 'present'
    }));
  };

  const handleCheckOut = () => {
    const now = new Date();
    const checkOutTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setAttendanceData(prev => ({
      ...prev,
      checkOut: checkOutTime,
      totalHours: '8h 30m'
    }));
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'attendance':
        return (
          <div className="content-section">
            <h2>Attendance Management</h2>
            
            <div className="attendance-card">
              <h3>Today's Attendance</h3>
              <div className="attendance-status">
                <div className={`status-badge ${attendanceData.todayStatus}`}>
                  {attendanceData.todayStatus === 'present' ? <FiCheck /> : <FiXCircle />}
                  {attendanceData.todayStatus === 'present' ? 'Present' : 'Not Checked In'}
                </div>
              </div>
              
              <div className="attendance-details">
                <div className="time-item">
                  <span className="label">Check In:</span>
                  <span className="time">{attendanceData.checkIn}</span>
                </div>
                <div className="time-item">
                  <span className="label">Check Out:</span>
                  <span className="time">{attendanceData.checkOut}</span>
                </div>
                <div className="time-item">
                  <span className="label">Total Hours:</span>
                  <span className="time">{attendanceData.totalHours}</span>
                </div>
              </div>
              
              <div className="attendance-actions">
                {attendanceData.checkIn === '--:--' ? (
                  <button className="btn-primary" onClick={handleCheckIn}>
                    <FiSun /> Check In
                  </button>
                ) : attendanceData.checkOut === '--:--' ? (
                  <button className="btn-secondary" onClick={handleCheckOut}>
                    <FiMoon /> Check Out
                  </button>
                ) : (
                  <button className="btn-disabled" disabled>
                    <FiCheck /> Completed
                  </button>
                )}
              </div>
            </div>

            <div className="weekly-summary">
              <h3>This Week Summary</h3>
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-number">4</span>
                  <span className="stat-label">Days Present</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Days Absent</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">1</span>
                  <span className="stat-label">Days Late</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="content-section">
            <h2>Task Management</h2>
            
            <div className="tasks-overview">
              <div className="task-stat">
                <span className="task-count">{tasks.length}</span>
                <span className="task-label">Total Tasks</span>
              </div>
              <div className="task-stat">
                <span className="task-count">{tasks.filter(t => t.status === 'completed').length}</span>
                <span className="task-label">Completed</span>
              </div>
              <div className="task-stat">
                <span className="task-count">{tasks.filter(t => t.status === 'pending').length}</span>
                <span className="task-label">Pending</span>
              </div>
            </div>

            <div className="tasks-list">
              <h3>My Tasks</h3>
              {tasks.map(task => (
                <div key={task.id} className={`task-item ${task.status}`}>
                  <div className="task-priority">
                    <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                  </div>
                  <div className="task-content">
                    <h4 className="task-title">{task.title}</h4>
                    <p className="task-due">Due: {task.dueDate}</p>
                  </div>
                  <div className="task-status">
                    <span className={`status-badge ${task.status}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'leave':
        return (
          <div className="content-section">
            <h2>Leave Management</h2>
            
            <div className="leave-balance">
              <h3>Leave Balance</h3>
              <div className="balance-stats">
                <div className="balance-item">
                  <span className="balance-number">12</span>
                  <span className="balance-label">Available Days</span>
                </div>
                <div className="balance-item">
                  <span className="balance-number">5</span>
                  <span className="balance-label">Used Days</span>
                </div>
                <div className="balance-item">
                  <span className="balance-number">1</span>
                  <span className="balance-label">Pending Requests</span>
                </div>
              </div>
              <button className="btn-primary">
                Request Leave
              </button>
            </div>

            <div className="leave-history">
              <h3>Leave History</h3>
              {leaveRequests.map(request => (
                <div key={request.id} className="leave-item">
                  <div className="leave-info">
                    <h4>{request.type}</h4>
                    <p>{request.startDate} - {request.endDate}</p>
                    <p>Reason: {request.reason}</p>
                  </div>
                  <div className="leave-status">
                    <span className={`status-badge ${request.status}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div className="content-section"><h2>Select a section</h2></div>;
    }
  };

  return (
    <div className="employee-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <h2>Employee Portal</h2>
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
                  className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(item.id)}
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
            <h1>Employee Dashboard</h1>
          </div>
          
          <div className="header-right">
            <div className="user-profile">
              <div className="user-avatar">
                <FiUser />
              </div>
              <div className="user-info">
                <span className="user-name">John Doe</span>
                <span className="user-role">Employee</span>
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

export default EmployeeDashboard;