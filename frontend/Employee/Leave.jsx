import React, { useState, useEffect } from 'react';
import { 
  FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle,
  FiPlus, FiEdit, FiTrash2, FiDownload, FiFilter, FiSearch, FiSend, FiFileText, FiUser, FiMail, FiPhone, FiCheck, FiX
} from 'react-icons/fi';
import './Leave.css';

const Leave = () => {
  const [notification, setNotification] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState({
    annual: 12,
    sick: 8,
    personal: 4,
    maternity: 90,
    paternity: 14,
    totalAvailable: 128
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const NotificationComponent = () => {
    if (!notification) return null;

    const getNotificationStyle = () => {
      switch (notification.type) {
        case 'success':
          return {
            icon: <FiCheckCircle />,
            bgColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderColor: '#10b981'
          };
        case 'error':
          return {
            icon: <FiXCircle />,
            bgColor: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            borderColor: '#ef4444'
          };
        case 'warning':
          return {
            icon: <FiAlertCircle />,
            bgColor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderColor: '#f59e0b'
          };
        default:
          return {
            icon: <FiCheckCircle />,
            bgColor: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderColor: '#3b82f6'
          };
      }
    };

    const style = getNotificationStyle();

    return (
      <div className="notification-container">
        <div 
          className="notification-toast"
          style={{
            background: style.bgColor,
            borderLeft: `4px solid ${style.borderColor}`,
            animation: 'slideInRight 0.3s ease-out, fadeIn 0.4s ease-out'
          }}
        >
          <div className="notification-icon">
            {style.icon}
          </div>
          <div className="notification-content">
            <div className="notification-title">
              {notification.type === 'success' ? 'Success!' : 
               notification.type === 'error' ? 'Error!' : 
               notification.type === 'warning' ? 'Warning!' : 'Notification'}
            </div>
            <div className="notification-message">
              {notification.message}
            </div>
          </div>
          <button 
            className="notification-close"
            onClick={() => setNotification(null)}
          >
            <FiX />
          </button>
        </div>
      </div>
    );
  };

  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get current user from sessionStorage
  const getCurrentUser = () => {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const currentUser = getCurrentUser();

  // Fetch leave history from backend
  const fetchLeaveHistory = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/auth/leave/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLeaveHistory(data);
        setLoading(false);
      } else {
        console.error('Failed to fetch leave history');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching leave history:', error);
      setLoading(false);
    }
  };

  // Fetch leave history on component mount
  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
    attachment: null,
    emergencyContact: '',
    emergencyPhone: ''
  });

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [quickFormData, setQuickFormData] = useState({
    type: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
    emergencyContact: '',
    emergencyPhone: '',
    attachment: null
  });

  const leaveTypes = [
    { value: 'annual', label: 'Annual Leave', icon: '🏖️', maxDays: 12 },
    { value: 'sick', label: 'Sick Leave', icon: '🏥', maxDays: 8 },
    { value: 'personal', label: 'Personal Leave', icon: '👤', maxDays: 4 },
    { value: 'maternity', label: 'Maternity Leave', icon: '🤱', maxDays: 90 },
    { value: 'paternity', label: 'Paternity Leave', icon: '👨‍👧‍👦', maxDays: 14 }
  ];

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    
    const days = calculateDays(quickFormData.startDate, quickFormData.endDate);
    
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        showNotification('Please login to submit leave request', 'error');
        return;
      }
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('type', quickFormData.type);
      formDataToSend.append('startDate', quickFormData.startDate);
      formDataToSend.append('endDate', quickFormData.endDate);
      formDataToSend.append('reason', quickFormData.reason);
      formDataToSend.append('emergencyContact', quickFormData.emergencyContact);
      formDataToSend.append('emergencyPhone', quickFormData.emergencyPhone);
      
      // Add file if exists
      if (quickFormData.attachment) {
        formDataToSend.append('attachment', quickFormData.attachment);
      }
      
      const response = await fetch('http://localhost:5000/api/auth/leave/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData - browser sets it with boundary
        },
        body: formDataToSend
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update leave balance
        const currentBalance = leaveBalance[quickFormData.type] || 0;
        setLeaveBalance(prev => ({
          ...prev,
          [quickFormData.type]: currentBalance - days,
        }));
        
        // Clear form and close
        setQuickFormData({
          type: 'annual',
          startDate: '',
          endDate: '',
          reason: '',
          emergencyContact: '',
          emergencyPhone: '',
          attachment: null,
          referenceId: ''
        });
        setShowQuickForm(false);
        
        // Refresh leave history
        await fetchLeaveHistory();
        
        // Show success message
        showNotification(`Leave request submitted successfully! ${days} days requested.`, 'success');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to submit leave request', 'error');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      showNotification('Network error. Please try again.', 'error');
    }
  };

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    const days = calculateDays(formData.startDate, formData.endDate);
    
    // Validation
    if (!formData.type || !formData.startDate || !formData.endDate || !formData.reason) {
      showNotification('Please fill in all required fields', 'warning');
      return;
    }
    
    if (days <= 0) {
      showNotification('End date must be after start date', 'error');
      return;
    }
    
    const leaveTypeInfo = leaveTypes.find(type => type.value === formData.type);
    const availableDays = leaveBalance[formData.type] || 0;
    
    if (days > availableDays) {
      showNotification(`Insufficient leave balance. Available: ${availableDays} days, Requested: ${days} days`, 'warning');
      return;
    }
    
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        showNotification('Please login to submit leave request', 'error');
        return;
      }
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('type', formData.type);
      formDataToSend.append('startDate', formData.startDate);
      formDataToSend.append('endDate', formData.endDate);
      formDataToSend.append('reason', formData.reason);
      formDataToSend.append('emergencyContact', formData.emergencyContact);
      formDataToSend.append('emergencyPhone', formData.emergencyPhone);
      
      // Add file if exists
      if (formData.attachment) {
        formDataToSend.append('attachment', formData.attachment);
      }
      
      const response = await fetch('http://localhost:5000/api/auth/leave/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData - browser sets it with boundary
        },
        body: formDataToSend
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update leave balance
        const currentBalance = leaveBalance[formData.type] || 0;
        setLeaveBalance(prev => ({
          ...prev,
          [formData.type]: currentBalance - days,
          totalAvailable: prev.totalAvailable - days
        }));
        
        // Reset form
        setFormData({
          type: 'annual',
          startDate: '',
          endDate: '',
          reason: '',
          attachment: null,
          emergencyContact: '',
          emergencyPhone: ''
        });
        setShowRequestForm(false);
        
        // Refresh leave history
        await fetchLeaveHistory();
        
        // Show success message
        showNotification(`Leave request submitted successfully! ${days} days requested.`, 'success');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to submit leave request', 'error');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      showNotification('Network error. Please try again.', 'error');
    }
  };

  const handleDeleteRequest = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          showNotification('Please login to delete leave request', 'error');
          return;
        }
        
        const response = await fetch(`http://localhost:5000/api/auth/leave/requests/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          // Update leave balance back
          const deletedLeave = leaveHistory.find(leave => leave.id === id);
          if (deletedLeave) {
            setLeaveBalance(prev => ({
              ...prev,
              [deletedLeave.type]: prev[deletedLeave.type] + deletedLeave.days,
              totalAvailable: prev.totalAvailable + deletedLeave.days
            }));
          }
          
          // Refresh leave history
          await fetchLeaveHistory();
          
          showNotification('Leave request deleted successfully!', 'success');
        } else {
          const errorData = await response.json();
          showNotification(errorData.message || 'Failed to delete leave request', 'error');
        }
      } catch (error) {
        console.error('Error deleting leave request:', error);
        showNotification('Network error. Please try again.', 'error');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'approved': { class: 'approved', label: 'Approved', icon: <FiCheckCircle /> },
      'pending': { class: 'pending', label: 'Pending', icon: <FiAlertCircle /> },
      'rejected': { class: 'rejected', label: 'Rejected', icon: <FiXCircle /> }
    };
    
    const config = statusConfig[status] || statusConfig['pending'];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const filteredHistory = leaveHistory.filter(leave => {
    const matchesStatus = filterStatus === 'all' || leave.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getLeaveTypeIcon = (type) => {
    const typeConfig = leaveTypes.find(t => t.label === type);
    return typeConfig?.icon || '';
  };

  return (
    <div className="leave-container" style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <NotificationComponent />
      <div className="leave-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Leave Management</h1>
            <p>Request leave and track your leave history</p>
          </div>
          <button 
            className="btn-apply-leave"
            onClick={() => setShowQuickForm(!showQuickForm)}
            title="Quick Leave Request Form"
          >
            <FiSend /> Apply for Leave
          </button>
        </div>
        
        {/* Quick Leave Request Form */}
        {showQuickForm && (
          <div className="quick-form-overlay">
            <div className="quick-form-modal">
              <div className="quick-form-header">
                <h3>Quick Leave Request</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowQuickForm(false)}
                >
                  <FiX />
                </button>
              </div>
              
              <form onSubmit={handleQuickSubmit} className="quick-leave-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="quick-type">Leave Type</label>
                    <select
                      id="quick-type"
                      value={quickFormData.type}
                      onChange={(e) => setQuickFormData(prev => ({ ...prev, type: e.target.value }))}
                      required
                    >
                      {leaveTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="quick-startDate">Start Date</label>
                    <input
                      type="date"
                      id="quick-startDate"
                      value={quickFormData.startDate}
                      onChange={(e) => setQuickFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="quick-endDate">End Date</label>
                    <input
                      type="date"
                      id="quick-endDate"
                      value={quickFormData.endDate}
                      onChange={(e) => setQuickFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="quick-reason">Reason</label>
                  <textarea
                    id="quick-reason"
                    value={quickFormData.reason}
                    onChange={(e) => setQuickFormData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Enter reason for leave request"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowQuickForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn-submit"
                  >
                    <FiSend /> Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Leave Balance Cards */}
      <div className="balance-section">
        <div className="section-header">
          <h2>Leave Balance</h2>
        </div>
        
        <div className="balance-grid">
          {Object.entries(leaveBalance).filter(([key]) => key !== 'totalAvailable').map(([type, days]) => {
            const leaveTypeInfo = leaveTypes.find(t => t.value === type);
            return (
              <div key={type} className="balance-card">
                <div className="balance-icon">
                  {leaveTypeInfo?.icon || '📄'}
                </div>
                <div className="balance-info">
                  <h3>{leaveTypeInfo?.label || type}</h3>
                  <div className="balance-details">
                    <span className="days-available">{days} days</span>
                    <span className="max-days">/ {leaveTypeInfo?.maxDays || 0} days</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(days / (leaveTypeInfo?.maxDays || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="total-balance">
          <div className="total-info">
            <span className="total-label">Total Available Days:</span>
            <span className="total-days">{leaveBalance.totalAvailable}</span>
          </div>
        </div>
      </div>

      {/* Leave History */}
      <div className="history-section">
        <div className="section-header">
          <h2>Leave History</h2>
          <div className="history-controls">
            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search leave requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="btn-export">
              <FiDownload /> Export
            </button>
          </div>
        </div>

        <div className="history-table">
          <div className="table-header">
            <div className="table-cell">Type</div>
            <div className="table-cell">Dates</div>
            <div className="table-cell">Days</div>
            <div className="table-cell">Reason</div>
            <div className="table-cell">Applied On</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Actions</div>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading leave history...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="empty-state">
              <FiUser className="empty-icon" />
              <h3>No Leave Requests Found</h3>
              <p>You haven't submitted any leave requests yet.</p>
              <p>Click "Request Leave" to submit your first request.</p>
            </div>
          ) : (
            filteredHistory.map(leave => (
              <div key={leave.id} className="table-row">
                <div className="table-cell">
                  <div className="leave-type">
                    <span className="type-icon">{getLeaveTypeIcon(leave.type)}</span>
                    <span className="type-name">{leave.type}</span>
                  </div>
                </div>
                <div className="table-cell dates">
                  <div className="date-range">
                    <span>{leave.startDate}</span>
                    <span className="to">to</span>
                    <span>{leave.endDate}</span>
                  </div>
                </div>
                <div className="table-cell days">{leave.days} days</div>
                <div className="table-cell reason">{leave.reason}</div>
                <div className="table-cell applied">{leave.appliedOn}</div>
                <div className="table-cell">{getStatusBadge(leave.status)}</div>
                <div className="table-cell actions">
                  <button className="btn-action" onClick={() => handleDeleteRequest(leave.id)}>
                    <FiTrash2 />
                  </button>
                  {leave.status === 'pending' && (
                    <button className="btn-action delete" onClick={() => handleDeleteRequest(leave.id)}>
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Leave Request Form Modal */}
      {showRequestForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Request Leave</h3>
              <button 
                className="modal-close"
                onClick={() => setShowRequestForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmitRequest} className="leave-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="type">Leave Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    {leaveTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Requested Days</label>
                  <div className="days-display">
                    {calculateDays(formData.startDate, formData.endDate)} days
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reason">Reason</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Please provide a reason for your leave request..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="emergencyContact">Emergency Contact Name</label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    placeholder="Emergency contact person"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="emergencyPhone">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    id="emergencyPhone"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    placeholder="Emergency contact number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="attachment">Attachment (Optional)</label>
                <input
                  type="file"
                  id="attachment"
                  name="attachment"
                  onChange={(e) => setFormData(prev => ({ ...prev, attachment: e.target.files[0] }))}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <small>Upload medical certificate or supporting documents</small>
              </div>

              <div className="modal-footer">
                <button 
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-submit"
                >
                  <FiSend /> Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;
