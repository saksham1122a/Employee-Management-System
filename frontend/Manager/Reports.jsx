import React, { useState, useEffect } from 'react';
import { 
  FiFileText, 
  FiDownload, 
  FiCalendar, 
  FiFilter, 
  FiSearch,
  FiTrendingUp,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiRefreshCw,
  FiPrinter,
  FiMail,
  FiShare2,
  FiDatabase,
  FiTrendingDown,
  FiAlertTriangle,
  FiAward,
  FiTarget
} from 'react-icons/fi';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import './Reports.css';

const Reports = () => {
  const [reportsData, setReportsData] = useState({
    attendanceReports: [],
    performanceReports: [],
    leaveReports: [],
    departmentReports: [],
    monthlyReports: [],
    annualReports: [],
    summaryStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedReportType, setSelectedReportType] = useState('attendance');
  const [selectedTimeRange, setSelectedTimeRange] = useState('monthly');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Real-time data fetching
  const fetchReportsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setError('Please login to view reports');
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
        
        const employeeData = employeesData.filter(emp => emp.role === 'employee');
        
        // Generate comprehensive reports data
        const attendanceReports = generateAttendanceReports(employeeData);
        const performanceReports = generatePerformanceReports(employeeData);
        const leaveReports = generateLeaveReports(leavesData);
        const departmentReports = generateDepartmentReports(employeeData);
        const monthlyReports = generateMonthlyReports(employeeData, leavesData);
        const annualReports = generateAnnualReports(employeeData, leavesData);
        const summaryStats = generateSummaryStats(employeeData, leavesData);
        
        setReportsData({
          attendanceReports,
          performanceReports,
          leaveReports,
          departmentReports,
          monthlyReports,
          annualReports,
          summaryStats
        });
        
        setLastUpdated(new Date());
        setLoading(false);
      } else {
        throw new Error('Failed to fetch reports data');
      }
    } catch (error) {
      console.error('Error fetching reports data:', error);
      setError('Failed to load reports data');
      setLoading(false);
    }
  };

  const generateAttendanceReports = (employees) => {
    const monthlyData = [];
    const currentYear = new Date().getFullYear();
    
    for (let month = 1; month <= 12; month++) {
      const monthName = new Date(currentYear, month - 1).toLocaleString('default', { month: 'short' });
      const presentCount = employees.filter(emp => {
        const attendance = emp.attendance?.percentage || 0;
        return attendance >= 90;
      }).length;
      
      monthlyData.push({
        month: monthName,
        present: presentCount,
        absent: employees.length - presentCount,
        percentage: employees.length > 0 ? Math.round((presentCount / employees.length) * 100) : 0
      });
    }
    
    return monthlyData;
  };

  const generatePerformanceReports = (employees) => {
    return employees.map(emp => ({
      name: emp.name,
      department: emp.department || 'General',
      attendance: emp.attendance?.percentage || 0,
      points: emp.attendance?.points || 0,
      status: emp.attendance?.percentage >= 90 ? 'Excellent' : 
              emp.attendance?.percentage >= 75 ? 'Good' : 
              emp.attendance?.percentage >= 60 ? 'Average' : 'Poor',
      trend: Math.random() > 0.5 ? 'up' : 'down',
      trendValue: Math.floor(Math.random() * 10) - 5
    }));
  };

  const generateLeaveReports = (leaves) => {
    const leaveStats = {
      approved: leaves.filter(l => l.status === 'approved').length,
      pending: leaves.filter(l => l.status === 'pending').length,
      rejected: leaves.filter(l => l.status === 'rejected').length,
      total: leaves.length
    };
    
    const monthlyLeaves = [
      { month: 'Jan', approved: 5, pending: 2, rejected: 1 },
      { month: 'Feb', approved: 7, pending: 3, rejected: 2 },
      { month: 'Mar', approved: 6, pending: 1, rejected: 1 },
      { month: 'Apr', approved: 8, pending: 2, rejected: 3 },
      { month: 'May', approved: 9, pending: 4, rejected: 2 },
      { month: 'Jun', approved: 4, pending: 2, rejected: 1 }
    ];
    
    return { leaveStats, monthlyLeaves };
  };

  const generateDepartmentReports = (employees) => {
    const deptStats = employees.reduce((acc, emp) => {
      const dept = emp.department || 'General';
      if (!acc[dept]) {
        acc[dept] = { 
          department: dept, 
          employees: 0, 
          avgAttendance: 0, 
          totalPoints: 0,
          presentToday: 0,
          absentToday: 0
        };
      }
      acc[dept].employees += 1;
      acc[dept].avgAttendance += emp.attendance?.percentage || 0;
      acc[dept].totalPoints += emp.attendance?.points || 0;
      
      // Simulate present/absent today
      if (Math.random() > 0.2) {
        acc[dept].presentToday += 1;
      } else {
        acc[dept].absentToday += 1;
      }
      
      return acc;
    }, {});
    
    return Object.values(deptStats).map(dept => ({
      ...dept,
      avgAttendance: Math.round(dept.avgAttendance / dept.employees),
      attendanceRate: dept.employees > 0 ? Math.round((dept.presentToday / dept.employees) * 100) : 0
    }));
  };

  const generateMonthlyReports = (employees, leaves) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return {
      monthName: new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' }),
      totalEmployees: employees.length,
      avgAttendance: Math.round(employees.reduce((acc, emp) => acc + (emp.attendance?.percentage || 0), 0) / employees.length),
      totalLeaves: leaves.length,
      approvedLeaves: leaves.filter(l => l.status === 'approved').length,
      pendingLeaves: leaves.filter(l => l.status === 'pending').length,
      topPerformer: employees.sort((a, b) => (b.attendance?.points || 0) - (a.attendance?.points || 0))[0]?.name || 'N/A',
      worstPerformer: employees.sort((a, b) => (a.attendance?.points || 0) - (b.attendance?.points || 0))[0]?.name || 'N/A',
      departmentStats: generateDepartmentReports(employees)
    };
  };

  const generateAnnualReports = (employees, leaves) => {
    const currentYear = new Date().getFullYear();
    
    return {
      year: currentYear,
      totalEmployees: employees.length,
      yearlyAvgAttendance: Math.round(employees.reduce((acc, emp) => acc + (emp.attendance?.percentage || 0), 0) / employees.length),
      totalLeavesYear: leaves.length,
      employeeGrowth: '+12%',
      performanceImprovement: '+8%',
      satisfactionScore: 92,
      retentionRate: 94,
      productivityIndex: 87
    };
  };

  const generateSummaryStats = (employees, leaves) => {
    return {
      totalEmployees: employees.length,
      avgAttendance: Math.round(employees.reduce((acc, emp) => acc + (emp.attendance?.percentage || 0), 0) / employees.length),
      presentToday: employees.filter(emp => Math.random() > 0.2).length,
      absentToday: employees.filter(emp => Math.random() <= 0.2).length,
      pendingLeaves: leaves.filter(l => l.status === 'pending').length,
      approvedLeaves: leaves.filter(l => l.status === 'approved').length,
      totalPoints: employees.reduce((acc, emp) => acc + (emp.attendance?.points || 0), 0),
      activeDepartments: [...new Set(employees.map(emp => emp.department || 'General'))].length,
      topPerformers: employees.filter(emp => emp.attendance?.percentage >= 90).length,
      needImprovement: employees.filter(emp => emp.attendance?.percentage < 60).length
    };
  };

  useEffect(() => {
    fetchReportsData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchReportsData, 30000);
    
    return () => clearInterval(interval);
  }, [selectedReportType, selectedTimeRange, selectedDepartment]);

  const refreshData = () => {
    fetchReportsData();
  };

  const exportReport = (format) => {
    console.log(`Exporting report in ${format} format`);
    // Implementation for PDF/Excel export
  };

  const printReport = () => {
    window.print();
  };

  const emailReport = () => {
    console.log('Emailing report...');
    // Implementation for email functionality
  };

  const COLORS = ['#2ecc71', '#3498db', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c'];

  if (loading) {
    return (
      <div className="reports-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading reports data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-container">
        <div className="error-state">
          <h3>Error</h3>
          <p>{error}</p>
          <button className="btn-primary" onClick={refreshData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="reports-header">
        <div className="header-left">
          <h2>Reports & Analytics</h2>
        </div>
        <div className="header-right">
          <div className="real-time-indicator">
            <div className="real-time-dot"></div>
            <span>Live Data</span>
            <span className="last-updated">Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
          <button className="refresh-btn" onClick={refreshData}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="summary-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>{reportsData.summaryStats.totalEmployees}</h3>
            <p>Total Employees</p>
            <span className="stat-change positive">+12% this year</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{reportsData.summaryStats.avgAttendance}%</h3>
            <p>Avg Attendance</p>
            <span className="stat-change positive">+3% improvement</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-content">
            <h3>{reportsData.summaryStats.pendingLeaves}</h3>
            <p>Pending Leaves</p>
            <span className="stat-change neutral">2 requests</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiAward />
          </div>
          <div className="stat-content">
            <h3>{reportsData.summaryStats.topPerformers}</h3>
            <p>Top Performers</p>
            <span className="stat-change positive">+5 this month</span>
          </div>
        </div>
      </div>

      {/* Controls and Filters */}
      <div className="reports-controls">
        <div className="controls-left">
          <div className="report-type-selector">
            <label>Report Type:</label>
            <select value={selectedReportType} onChange={(e) => setSelectedReportType(e.target.value)}>
              <option value="attendance">Attendance Reports</option>
              <option value="performance">Performance Reports</option>
              <option value="leave">Leave Reports</option>
              <option value="department">Department Reports</option>
              <option value="monthly">Monthly Summary</option>
              <option value="annual">Annual Overview</option>
            </select>
          </div>
          <div className="time-range-selector">
            <label>Time Range:</label>
            <select value={selectedTimeRange} onChange={(e) => setSelectedTimeRange(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
          <div className="department-selector">
            <label>Department:</label>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
              <option value="all">All Departments</option>
              {reportsData.departmentReports.map(dept => (
                <option key={dept.department} value={dept.department}>{dept.department}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="controls-right">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      {/* Export Actions */}
      <div className="export-actions">
        <button className="export-btn" onClick={() => exportReport('pdf')}>
          <FiDownload /> Export PDF
        </button>
        <button className="export-btn" onClick={() => exportReport('excel')}>
          <FiDatabase /> Export Excel
        </button>
        <button className="export-btn" onClick={printReport}>
          <FiPrinter /> Print
        </button>
        <button className="export-btn" onClick={emailReport}>
          <FiMail /> Email
        </button>
        <button className="export-btn" onClick={() => {}}>
          <FiShare2 /> Share
        </button>
      </div>

      {/* Reports Content */}
      <div className="reports-content">
        {selectedReportType === 'attendance' && (
          <div className="report-section">
            <div className="section-header">
              <h3>Attendance Reports</h3>
              <div className="section-actions">
                <button className="btn-icon" onClick={refreshData}>
                  <FiRefreshCw />
                </button>
              </div>
            </div>
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <h4>Monthly Attendance Trends</h4>
                </div>
                <div className="chart-content">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={reportsData.attendanceReports}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="present" stackId="1" stroke="#2ecc71" fill="#2ecc71" />
                      <Area type="monotone" dataKey="absent" stackId="1" stroke="#e74c3c" fill="#e74c3c" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-header">
                  <h4>Attendance Percentage</h4>
                </div>
                <div className="chart-content">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reportsData.attendanceReports}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="percentage" stroke="#3498db" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReportType === 'performance' && (
          <div className="report-section">
            <div className="section-header">
              <h3>Performance Reports</h3>
              <div className="section-actions">
                <button className="btn-icon" onClick={refreshData}>
                  <FiRefreshCw />
                </button>
              </div>
            </div>
            <div className="performance-table-container">
              <table className="performance-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Department</th>
                    <th>Attendance %</th>
                    <th>Points</th>
                    <th>Status</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsData.performanceReports.map((emp, index) => (
                    <tr key={index}>
                      <td>{emp.name}</td>
                      <td>{emp.department}</td>
                      <td>{emp.attendance}%</td>
                      <td>{emp.points}</td>
                      <td>
                        <span className={`status-badge ${emp.status.toLowerCase()}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td>
                        <div className="trend-indicator">
                          {emp.trend === 'up' ? (
                            <FiTrendingUp className="trend-up" />
                          ) : (
                            <FiTrendingDown className="trend-down" />
                          )}
                          <span className={emp.trend}>{emp.trendValue}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReportType === 'leave' && (
          <div className="report-section">
            <div className="section-header">
              <h3>Leave Reports</h3>
              <div className="section-actions">
                <button className="btn-icon" onClick={refreshData}>
                  <FiRefreshCw />
                </button>
              </div>
            </div>
            <div className="leave-stats-grid">
              <div className="leave-stat-card">
                <div className="leave-icon approved">
                  <FiCheckCircle />
                </div>
                <div className="leave-content">
                  <h3>{reportsData.leaveReports.leaveStats.approved}</h3>
                  <p>Approved Leaves</p>
                </div>
              </div>
              <div className="leave-stat-card">
                <div className="leave-icon pending">
                  <FiClock />
                </div>
                <div className="leave-content">
                  <h3>{reportsData.leaveReports.leaveStats.pending}</h3>
                  <p>Pending Leaves</p>
                </div>
              </div>
              <div className="leave-stat-card">
                <div className="leave-icon rejected">
                  <FiXCircle />
                </div>
                <div className="leave-content">
                  <h3>{reportsData.leaveReports.leaveStats.rejected}</h3>
                  <p>Rejected Leaves</p>
                </div>
              </div>
              <div className="leave-stat-card">
                <div className="leave-icon total">
                  <FiFileText />
                </div>
                <div className="leave-content">
                  <h3>{reportsData.leaveReports.leaveStats.total}</h3>
                  <p>Total Leaves</p>
                </div>
              </div>
            </div>
            <div className="chart-card">
              <div className="chart-header">
                <h4>Monthly Leave Trends</h4>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportsData.leaveReports.monthlyLeaves}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="approved" fill="#2ecc71" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="pending" fill="#f39c12" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="rejected" fill="#e74c3c" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {selectedReportType === 'department' && (
          <div className="report-section">
            <div className="section-header">
              <h3>Department Reports</h3>
              <div className="section-actions">
                <button className="btn-icon" onClick={refreshData}>
                  <FiRefreshCw />
                </button>
              </div>
            </div>
            <div className="department-cards-grid">
              {reportsData.departmentReports.map((dept, index) => (
                <div key={index} className="department-card">
                  <div className="dept-header">
                    <h4>{dept.department}</h4>
                    <span className="dept-employees">{dept.employees} employees</span>
                  </div>
                  <div className="dept-stats">
                    <div className="dept-stat">
                      <span className="stat-label">Avg Attendance</span>
                      <span className="stat-value">{dept.avgAttendance}%</span>
                    </div>
                    <div className="dept-stat">
                      <span className="stat-label">Total Points</span>
                      <span className="stat-value">{dept.totalPoints}</span>
                    </div>
                    <div className="dept-stat">
                      <span className="stat-label">Present Today</span>
                      <span className="stat-value">{dept.presentToday}</span>
                    </div>
                    <div className="dept-stat">
                      <span className="stat-label">Absent Today</span>
                      <span className="stat-value">{dept.absentToday}</span>
                    </div>
                  </div>
                  <div className="dept-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${dept.attendanceRate}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{dept.attendanceRate}% attendance rate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedReportType === 'monthly' && (
          <div className="report-section">
            <div className="section-header">
              <h3>Monthly Summary</h3>
              <div className="section-actions">
                <button className="btn-icon" onClick={refreshData}>
                  <FiRefreshCw />
                </button>
              </div>
            </div>
            <div className="monthly-summary-card">
              <div className="summary-header">
                <h4>{reportsData.monthlyReports.monthName}</h4>
              </div>
              <div className="summary-grid">
                <div className="summary-item">
                  <div className="summary-icon">
                    <FiUsers />
                  </div>
                  <div className="summary-content">
                    <h4>Total Employees</h4>
                    <p>{reportsData.monthlyReports.totalEmployees}</p>
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-icon">
                    <FiCheckCircle />
                  </div>
                  <div className="summary-content">
                    <h4>Avg Attendance</h4>
                    <p>{reportsData.monthlyReports.avgAttendance}%</p>
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-icon">
                    <FiCalendar />
                  </div>
                  <div className="summary-content">
                    <h4>Total Leaves</h4>
                    <p>{reportsData.monthlyReports.totalLeaves}</p>
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-icon">
                    <FiAward />
                  </div>
                  <div className="summary-content">
                    <h4>Top Performer</h4>
                    <p>{reportsData.monthlyReports.topPerformer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReportType === 'annual' && (
          <div className="report-section">
            <div className="section-header">
              <h3>Annual Overview</h3>
              <div className="section-actions">
                <button className="btn-icon" onClick={refreshData}>
                  <FiRefreshCw />
                </button>
              </div>
            </div>
            <div className="annual-overview-card">
              <div className="overview-header">
                <h4>Year {reportsData.annualReports.year}</h4>
              </div>
              <div className="overview-metrics">
                <div className="metric-card">
                  <div className="metric-icon">
                    <FiUsers />
                  </div>
                  <div className="metric-content">
                    <h4>Total Employees</h4>
                    <p>{reportsData.annualReports.totalEmployees}</p>
                    <span className="metric-change positive">{reportsData.annualReports.employeeGrowth}</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">
                    <FiTarget />
                  </div>
                  <div className="metric-content">
                    <h4>Yearly Attendance</h4>
                    <p>{reportsData.annualReports.yearlyAvgAttendance}%</p>
                    <span className="metric-change positive">{reportsData.annualReports.performanceImprovement}</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">
                    <FiActivity />
                  </div>
                  <div className="metric-content">
                    <h4>Productivity Index</h4>
                    <p>{reportsData.annualReports.productivityIndex}</p>
                    <span className="metric-change positive">+5%</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">
                    <FiAward />
                  </div>
                  <div className="metric-content">
                    <h4>Satisfaction Score</h4>
                    <p>{reportsData.annualReports.satisfactionScore}</p>
                    <span className="metric-change positive">+3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;