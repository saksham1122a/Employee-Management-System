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
  FiUserCheck,
  FiCalendar
} from 'react-icons/fi';
import './ManagerDashboard.css';
import MyTeam from './MyTeam';
import Attendance from './Attendance';
import LeaveRequest from './LeaveRequest';
import Performance from './Performance';
import Tasks from './Tasks';

const ManagerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    teamPerformance: 0,
    monthlyGrowth: 0,
    attendancePercentage: 0,
    performanceImprovement: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const navigate = useNavigate();

  // Real-time data fetching
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setError('Please login to view dashboard data');
        setLoading(false);
        return;
      }
      
      // Fetch employees data
      const employeesResponse = await fetch('http://localhost:5000/api/auth/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Fetch leave requests
      const leavesResponse = await fetch('http://localhost:5000/api/auth/leave/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (employeesResponse.ok && leavesResponse.ok) {
        const employeesData = await employeesResponse.json();
        const leavesData = await leavesResponse.json();
        
        // Calculate real-time stats
        const totalEmployees = employeesData.filter(emp => emp.role === 'employee').length;
        const presentToday = employeesData.filter(emp => 
          emp.role === 'employee' && 
          emp.attendance?.dailyRecords?.[new Date().toISOString().split('T')[0]]?.status === 'Present'
        ).length;
        
        const pendingLeaves = leavesData.filter(leave => leave.status === 'pending').length;
        
        // Calculate team performance (average attendance percentage)
        const teamPerformance = employeesData
          .filter(emp => emp.role === 'employee')
          .reduce((acc, emp) => acc + (emp.attendance?.percentage || 0), 0) / totalEmployees || 0;
        
        // Calculate monthly growth (new employees this month)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const newThisMonth = employeesData.filter(emp => {
          const joinDate = new Date(emp.createdAt);
          return emp.role === 'employee' && 
                 joinDate.getMonth() === currentMonth && 
                 joinDate.getFullYear() === currentYear;
        }).length;
        
        // Calculate attendance percentage
        const attendancePercentage = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0;
        
        // Calculate performance improvement (mock data for now)
        const performanceImprovement = 5; // This could be calculated from historical data
        
        setStats({
          totalEmployees,
          presentToday,
          pendingLeaves,
          teamPerformance: Math.round(teamPerformance),
          monthlyGrowth: newThisMonth,
          attendancePercentage,
          performanceImprovement
        });
        
        // Generate recent activities from real data
        const activities = [];
        
        // Add attendance marking activities
        const today = new Date().toISOString().split('T')[0];
        employeesData.forEach((emp, index) => {
          if (emp.attendance?.dailyRecords?.[today]) {
            activities.push({
              id: `attendance-${emp.id || index}`,
              action: `Attendance marked for ${emp.name}`,
              user: emp.name,
              time: 'Today',
              icon: <FiCalendar />,
              color: '#2ecc71'
            });
          }
        });
        
        // Add leave request activities
        leavesData.slice(-3).forEach((leave, index) => {
          activities.push({
            id: `leave-${leave.id || index}`,
            action: `Leave request ${leave.status}`,
            user: leave.employeeName,
            time: new Date(leave.appliedOn).toLocaleDateString(),
            icon: leave.status === 'approved' ? <FiCheckCircle /> : <FiCalendar />,
            color: leave.status === 'approved' ? '#3498db' : '#f39c12'
          });
        });
        
        // Add new employee activities
        employeesData
          .filter(emp => emp.role === 'employee')
          .slice(-2)
          .forEach((emp, index) => {
            activities.push({
              id: `new-${emp.id || index}`,
              action: 'New team member joined',
              user: emp.name,
              time: new Date(emp.createdAt).toLocaleDateString(),
              icon: <FiUserCheck />,
              color: '#9b59b6'
            });
          });
        
        setRecentActivities(activities.slice(0, 4));
        setLastUpdated(new Date());
        setLoading(false);
      } else {
        throw new Error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const refreshData = () => {
    fetchDashboardData();
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <FiHome /> },
    { id: 'employees', label: 'My Team', icon: <FiUsers /> },
    { id: 'attendance', label: 'Attendance', icon: <FiCalendar /> },
    { id: 'leaves', label: 'Leave Requests', icon: <FiCalendar /> },
    { id: 'performance', label: 'Performance', icon: <FiBarChart2 /> },
    { id: 'tasks', label: 'Tasks', icon: <FiTrendingUp /> },
    { id: 'logout', label: 'Logout', icon: <FiLogOut />, isLogout: true }
  ];

  const quickActions = [
    { label: 'Approve Attendance', icon: <FiCheckCircle />, action: () => setActiveTab('attendance') },
    { label: 'Review Leaves', icon: <FiCalendar />, action: () => setActiveTab('leaves') },
    { label: 'Team Report', icon: <FiDownload />, action: () => console.log('Generate team report') }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="dashboard-content">
            {/* Real-time indicator */}
            <div className="real-time-indicator">
              <div className="real-time-dot"></div>
              <span>Live Data</span>
              <span className="last-updated">Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <button className="refresh-btn" onClick={refreshData}>
                <FiActivity /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading real-time data...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <h3>Error</h3>
                <p>{error}</p>
                <button className="btn-primary" onClick={refreshData}>Retry</button>
              </div>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FiUsers />
                    </div>
                    <div className="stat-info">
                      <h3>{stats.totalEmployees}</h3>
                      <p>Total Employees</p>
                      <span className="stat-change positive">
                        {stats.monthlyGrowth > 0 ? `+${stats.monthlyGrowth} this month` : 'No new this month'}
                      </span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FiUserCheck />
                    </div>
                    <div className="stat-info">
                      <h3>{stats.presentToday}</h3>
                      <p>Present Today</p>
                      <span className="stat-change positive">{stats.attendancePercentage}% attendance</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FiCalendar />
                    </div>
                    <div className="stat-info">
                      <h3>{stats.pendingLeaves}</h3>
                      <p>Pending Leaves</p>
                      <span className="stat-change neutral">{stats.pendingLeaves} requests</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FiTrendingUp />
                    </div>
                    <div className="stat-info">
                      <h3>{stats.teamPerformance}%</h3>
                      <p>Team Performance</p>
                      <span className="stat-change positive">+{stats.performanceImprovement}% improvement</span>
                    </div>
                  </div>
                </div>

                <div className="dashboard-grid">
                  <div className="card">
                    <div className="card-header">
                      <h3>Recent Activities</h3>
                      <button className="btn-icon" onClick={refreshData}>
                        <FiActivity />
                      </button>
                    </div>
                    <div className="activity-list">
                      {recentActivities.length > 0 ? (
                        recentActivities.map(activity => (
                          <div key={activity.id} className="activity-item">
                            <div className="activity-icon" style={{ color: activity.color }}>
                              {activity.icon}
                            </div>
                            <div className="activity-details">
                              <p className="activity-action">{activity.action}</p>
                              <p className="activity-meta">{activity.user} • {activity.time}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-activities">
                          <p>No recent activities</p>
                        </div>
                      )}
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
              </>
            )}
          </div>
        );

      case 'employees':
        return <MyTeam />;

      case 'attendance':
        return <Attendance />;

      case 'leaves':
        return <LeaveRequest />;

      case 'performance':
        return <Performance />;

      case 'tasks':
        return <Tasks />;

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
    // Preserve important data before clearing
    const tasksData = localStorage.getItem('managerTasks');
    const employeesData = localStorage.getItem('employees');
    
    // Clear authentication data only
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Restore preserved data
    if (tasksData) {
      localStorage.setItem('managerTasks', tasksData);
    }
    if (employeesData) {
      localStorage.setItem('employees', employeesData);
    }
    
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
            <FiMenu />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  className={`nav-item ${activeTab === item.id ? 'active' : ''} ${item.isLogout ? 'logout-item' : ''}`}
                  onClick={() => item.isLogout ? handleLogout() : setActiveTab(item.id)}
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
        {/* Content */}
        <main className="dashboard-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
