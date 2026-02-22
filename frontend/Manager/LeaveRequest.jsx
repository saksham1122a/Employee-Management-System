import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUser, FiCheckCircle, FiX } from 'react-icons/fi';
import './LeaveRequest.css';

const LeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    // Mock leave request data
    const mockLeaveRequests = [
      { 
        id: 1, 
        name: 'Mike Johnson', 
        department: 'Sales', 
        type: 'Personal Leave', 
        startDate: '2024-02-15', 
        endDate: '2024-02-17',
        status: 'pending',
        reason: 'Family emergency'
      },
      { 
        id: 2, 
        name: 'Tom Brown', 
        department: 'HR', 
        type: 'Sick Leave', 
        startDate: '2024-02-18', 
        endDate: '2024-02-19',
        status: 'pending',
        reason: 'Medical appointment'
      },
      { 
        id: 3, 
        name: 'Sarah Wilson', 
        department: 'Engineering', 
        type: 'Annual Leave', 
        startDate: '2024-02-20', 
        endDate: '2024-02-25',
        status: 'approved',
        reason: 'Vacation'
      }
    ];

    setLeaveRequests(mockLeaveRequests);
  }, []);

  const handleLeaveAction = (requestId, action) => {
    setLeaveRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: action } : req
    ));
  };

  const pendingRequests = leaveRequests.filter(req => req.status === 'pending');
  const approvedRequests = leaveRequests.filter(req => req.status === 'approved');
  const rejectedRequests = leaveRequests.filter(req => req.status === 'rejected');

  return (
    <div className="leave-request-container">
      <div className="leave-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-info">
            <h3>{pendingRequests.length}</h3>
            <p>Pending Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{approvedRequests.length}</h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiX />
          </div>
          <div className="stat-info">
            <h3>{rejectedRequests.length}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

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
          {leaveRequests.map(request => (
            <div key={request.id} className="leave-card">
              <div className="leave-info">
                <div className="user-avatar">{request.name.charAt(0)}</div>
                <div>
                  <h4>{request.name}</h4>
                  <p>{request.department}</p>
                  <p className="leave-type">{request.type}</p>
                  <p className="leave-dates">{request.startDate} - {request.endDate}</p>
                  <p className="leave-reason">{request.reason}</p>
                </div>
              </div>
              <div className="leave-status">
                <span className={`status-badge ${request.status}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
                {request.status === 'pending' && (
                  <div className="leave-actions">
                    <button 
                      className="btn-small btn-success" 
                      onClick={() => handleLeaveAction(request.id, 'approved')}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn-small btn-danger" 
                      onClick={() => handleLeaveAction(request.id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;