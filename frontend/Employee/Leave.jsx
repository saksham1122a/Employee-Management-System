import React, { useState } from 'react';
import { 
  FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle,
  FiPlus, FiEdit, FiTrash2, FiDownload, FiFilter, FiSearch,
  FiSend, FiFileText, FiUser, FiMail, FiPhone
} from 'react-icons/fi';
import './Leave.css';

const Leave = () => {
  const [leaveBalance, setLeaveBalance] = useState({
    annual: 12,
    sick: 8,
    personal: 4,
    maternity: 90,
    paternity: 14,
    totalAvailable: 128
  });

  const [leaveHistory, setLeaveHistory] = useState([
    { 
      id: 1, 
      type: 'Sick Leave', 
      startDate: '2024-01-15', 
      endDate: '2024-01-16', 
      days: 2, 
      status: 'approved', 
      reason: 'Medical appointment and recovery',
      appliedOn: '2024-01-10',
      approvedBy: 'John Manager',
      approvedOn: '2024-01-11'
    },
    { 
      id: 2, 
      type: 'Annual Leave', 
      startDate: '2023-12-20', 
      endDate: '2023-12-25', 
      days: 6, 
      status: 'approved', 
      reason: 'Family vacation',
      appliedOn: '2023-12-01',
      approvedBy: 'John Manager',
      approvedOn: '2023-12-05'
    },
    { 
      id: 3, 
      type: 'Personal Leave', 
      startDate: '2024-02-01', 
      endDate: '2024-02-02', 
      days: 2, 
      status: 'pending', 
      reason: 'Personal work',
      appliedOn: '2024-01-25',
      approvedBy: '--',
      approvedOn: '--'
    },
    { 
      id: 4, 
      type: 'Sick Leave', 
      startDate: '2023-11-10', 
      endDate: '2023-11-10', 
      days: 1, 
      status: 'rejected', 
      reason: 'Not feeling well',
      appliedOn: '2023-11-09',
      approvedBy: 'John Manager',
      approvedOn: '2023-11-10',
      rejectionReason: 'Insufficient medical documentation'
    }
  ]);

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
  const [showLeavePolicy, setShowLeavePolicy] = useState(false);

  const leaveTypes = [
    { value: 'annual', label: 'Annual Leave', icon: '🏖️', maxDays: 12 },
    { value: 'sick', label: 'Sick Leave', icon: '🏥', maxDays: 8 },
    { value: 'personal', label: 'Personal Leave', icon: '👤', maxDays: 4 },
    { value: 'maternity', label: 'Maternity Leave', icon: '🤱', maxDays: 90 },
    { value: 'paternity', label: 'Paternity Leave', icon: '👨‍👧‍👦', maxDays: 14 }
  ];

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    
    const days = calculateDays(formData.startDate, formData.endDate);
    const newRequest = {
      id: leaveHistory.length + 1,
      type: leaveTypes.find(type => type.value === formData.type)?.label || formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: days,
      status: 'pending',
      reason: formData.reason,
      appliedOn: new Date().toISOString().split('T')[0],
      approvedBy: '--',
      approvedOn: '--'
    };

    setLeaveHistory(prev => [newRequest, ...prev]);
    
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
    return typeConfig?.icon || '📄';
  };

  return (
    <div className="leave-container">
      <div className="leave-header">
        <h1>Leave Management</h1>
        <p>Request leave and track your leave history</p>
      </div>

      {/* Leave Balance Cards */}
      <div className="balance-section">
        <div className="section-header">
          <h2>Leave Balance</h2>
          <button 
            className="btn-policy"
            onClick={() => setShowLeavePolicy(!showLeavePolicy)}
          >
            <FiFileText /> Leave Policy
          </button>
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

      {/* Leave Policy Section */}
      {showLeavePolicy && (
        <div className="policy-section">
          <h3>Leave Policy</h3>
          <div className="policy-content">
            <div className="policy-item">
              <h4>Annual Leave</h4>
              <p>12 days per year, accumulates up to 24 days. Requires 2 weeks notice.</p>
            </div>
            <div className="policy-item">
              <h4>Sick Leave</h4>
              <p>8 days per year. Medical certificate required for more than 2 consecutive days.</p>
            </div>
            <div className="policy-item">
              <h4>Personal Leave</h4>
              <p>4 days per year for personal emergencies. Requires immediate notification.</p>
            </div>
            <div className="policy-item">
              <h4>Maternity Leave</h4>
              <p>90 days paid leave. Requires medical certification and 1 month notice.</p>
            </div>
            <div className="policy-item">
              <h4>Paternity Leave</h4>
              <p>14 days paid leave. Requires birth certificate and 2 weeks notice.</p>
            </div>
          </div>
        </div>
      )}

      {/* Request Leave Button */}
      <div className="request-section">
        <button 
          className="btn-request-leave"
          onClick={() => setShowRequestForm(true)}
        >
          <FiPlus /> Request Leave
        </button>
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
          
          {filteredHistory.map(leave => (
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
                <button className="btn-action">
                  <FiEdit />
                </button>
                {leave.status === 'pending' && (
                  <button className="btn-action delete">
                    <FiTrash2 />
                  </button>
                )}
              </div>
            </div>
          ))}
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