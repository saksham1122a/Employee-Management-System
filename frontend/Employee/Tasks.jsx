import React, { useState, useEffect } from 'react';
import { 
  FiCheckSquare, FiCalendar, FiClock, FiUser, FiAlertCircle,
  FiPlus, FiEdit, FiTrash2, FiFilter, FiSearch, FiCheck,
  FiTrendingUp, FiActivity, FiTarget
} from 'react-icons/fi';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch tasks from Manager's data source
  const fetchTasksFromManager = async () => {
    try {
      // First try to fetch from Manager's localStorage
      const managerTasks = localStorage.getItem('managerTasks');
      if (managerTasks) {
        const parsedTasks = JSON.parse(managerTasks);
        console.log('✅ Fetched tasks from Manager localStorage:', parsedTasks);
        
        // Filter tasks for current employee
        const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
        const employeeTasks = parsedTasks.filter(task => 
          task.assignedTo === currentUser.email || 
          task.assignedTo === currentUser.name ||
          task.assignedTo === currentUser.id
        );
        
        console.log('✅ Filtered tasks for current employee:', employeeTasks);
        return employeeTasks;
      }
      
      // If no localStorage data, try Manager's API
      const token = sessionStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:5000/api/auth/employees', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const usersData = await response.json();
          // Find current employee and get their assigned tasks
          const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
          const currentEmployee = usersData.find(user => 
            user.email === currentUser.email || user.id === currentUser.id
          );
          
          if (currentEmployee && currentEmployee.assignedTasks) {
            console.log('✅ Fetched tasks from Manager API:', currentEmployee.assignedTasks);
            return currentEmployee.assignedTasks;
          }
        }
      }
      
      // Fallback to mock data
      console.log('Using mock data - no Manager data found');
      return mockTasks;
    } catch (error) {
      console.error('Error fetching tasks from Manager:', error);
      return mockTasks;
    }
  };

  // Mock data for fallback with proper deadline field
  const mockTasks = [
    {
      id: 1,
      title: 'Complete project documentation',
      description: 'Update technical documentation for the new features',
      status: 'pending',
      priority: 'high',
      deadline: '2024-01-25',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20'
    },
    {
      id: 2,
      title: 'Code review for feature branch',
      description: 'Review pull requests and provide feedback',
      status: 'in-progress',
      priority: 'medium',
      deadline: '2024-01-22',
      createdAt: '2024-01-19',
      updatedAt: '2024-01-19'
    },
    {
      id: 3,
      title: 'Update unit tests',
      description: 'Add test cases for new functionality',
      status: 'completed',
      priority: 'low',
      deadline: '2024-01-21',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-18'
    }
  ];

  // Initialize with mock data immediately, then try to fetch from Manager
  useEffect(() => {
    // Set initial mock data immediately
    setTasks(mockTasks);
    setLoading(false);
    
    // Try to fetch from Manager in background
    const fetchManagerData = async () => {
      try {
        const managerTasks = await fetchTasksFromManager();
        setTasks(managerTasks);
      } catch (error) {
        console.log('Using mock data due to Manager fetch error:', error);
        // Keep using mock data
      }
    };

    // Fetch in background after initial render
    fetchManagerData();
    
    // Listen for real-time updates from Manager
    const handleManagerUpdate = (event) => {
      const { taskId, newStatus, employee } = event.detail;
      const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
      
      // Only update if it's for current employee
      if (employee.email === currentUser.email || employee.id === currentUser.id) {
        console.log('🔄 Real-time update received from Manager:', event.detail);
        fetchManagerData(); // Refresh tasks
      }
    };

    window.addEventListener('taskStatusUpdated', handleManagerUpdate);
    
    return () => {
      window.removeEventListener('taskStatusUpdated', handleManagerUpdate);
    };
  }, []);

  // Calculate days until deadline
  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Get deadline status
  const getDeadlineStatus = (deadline) => {
    const daysUntil = getDaysUntilDeadline(deadline);
    
    if (!daysUntil) return { text: 'No deadline', color: '#666' };
    if (daysUntil < 0) return { text: `${Math.abs(daysUntil)} days overdue`, color: '#e74c3c' };
    if (daysUntil === 0) return { text: 'Due today', color: '#f39c12' };
    if (daysUntil <= 3) return { text: `${daysUntil} days left`, color: '#f39c12' };
    return { text: `${daysUntil} days left`, color: '#27ae60' };
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle task status update and notify manager
  const handleTaskStatusUpdate = async (taskId, newStatus) => {
    try {
      // Update local state immediately for better UX
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      );
      setTasks(updatedTasks);

      // Notify Manager via localStorage event
      const taskToUpdate = tasks.find(task => task.id === taskId);
      const notification = {
        type: 'task_status_update',
        taskId: taskId,
        taskTitle: taskToUpdate?.title,
        oldStatus: taskToUpdate?.status,
        newStatus: newStatus,
        employee: JSON.parse(sessionStorage.getItem('user') || '{}'),
        timestamp: new Date().toISOString()
      };

      // Store notification for Manager
      const existingNotifications = JSON.parse(localStorage.getItem('managerNotifications') || '[]');
      existingNotifications.push(notification);
      localStorage.setItem('managerNotifications', JSON.stringify(existingNotifications));

      // Update Manager's localStorage tasks
      const managerTasks = JSON.parse(localStorage.getItem('managerTasks') || '[]');
      const updatedManagerTasks = managerTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString(), updatedBy: 'employee' }
          : task
      );
      localStorage.setItem('managerTasks', JSON.stringify(updatedManagerTasks));

      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('taskStatusUpdated', { 
        detail: { taskId, newStatus, employee: notification.employee } 
      }));

      console.log(`✅ Task ${taskId} status updated to ${newStatus} and Manager notified`);
    } catch (error) {
      console.error('Error updating task status:', error);
      // Revert local state if update failed
      setTasks(tasks);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { class: 'completed', label: 'Completed', icon: <FiCheck /> },
      'in-progress': { class: 'in-progress', label: 'In Progress', icon: <FiActivity /> },
      'pending': { class: 'pending', label: 'Pending', icon: <FiAlertCircle /> }
    };
    
    const config = statusConfig[status] || statusConfig['pending'];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'high': { class: 'high', label: 'High' },
      'medium': { class: 'medium', label: 'Medium' },
      'low': { class: 'low', label: 'Low' }
    };
    
    const config = priorityConfig[priority] || priorityConfig['medium'];
    return (
      <span className={`priority-badge ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length
  };

  if (loading) {
    return (
      <div className="tasks-container">
        <div className="loading-spinner">
          <FiActivity className="spinner-icon" />
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>Task Management</h1>
        <p>Manage your assigned tasks and track progress</p>
      </div>

      {/* Task Statistics */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <FiTarget />
          </div>
          <div className="stat-content">
            <h3>{taskStats.total}</h3>
            <span>Total Tasks</span>
          </div>
        </div>
        
        <div className="stat-card completed">
          <div className="stat-icon">
            <FiCheckSquare />
          </div>
          <div className="stat-content">
            <h3>{taskStats.completed}</h3>
            <span>Completed</span>
          </div>
        </div>
        
        <div className="stat-card in-progress">
          <div className="stat-icon">
            <FiActivity />
          </div>
          <div className="stat-content">
            <h3>{taskStats.inProgress}</h3>
            <span>In Progress</span>
          </div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-icon">
            <FiAlertCircle />
          </div>
          <div className="stat-content">
            <h3>{taskStats.pending}</h3>
            <span>Pending</span>
          </div>
        </div>
      </div>

      {/* Task Controls */}
      <div className="task-controls">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search tasks..."
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
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <FiTarget className="empty-icon" />
            <h3>No Tasks Found</h3>
            <p>No tasks match your current filters.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={`task-card ${task.status}`}>
              <div className="task-header">
                <h3>{task.title}</h3>
                <div className="task-badges">
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.priority)}
                </div>
              </div>
              
              <div className="task-description">
                <p>{task.description}</p>
              </div>
              
              <div className="task-meta">
                <div className="meta-item">
                  <FiCalendar />
                  <span>Deadline: {task.deadline || 'No deadline'}</span>
                </div>
                <div className="meta-item deadline-status" style={{ color: getDeadlineStatus(task.deadline).color }}>
                  <FiClock />
                  <span>{getDeadlineStatus(task.deadline).text}</span>
                </div>
                <div className="meta-item">
                  <FiClock />
                  <span>Created: {task.createdAt || 'N/A'}</span>
                </div>
              </div>
              
              <div className="task-actions">
                {task.status !== 'completed' && (
                  <button 
                    className="btn-action complete"
                    onClick={() => handleTaskStatusUpdate(task.id, 'completed')}
                    title="Mark as Completed"
                  >
                    <FiCheck /> Mark Complete
                  </button>
                )}
                
                {task.status === 'completed' && (
                  <button 
                    className="btn-action revert"
                    onClick={() => handleTaskStatusUpdate(task.id, 'in-progress')}
                    title="Revert to In Progress"
                  >
                    <FiActivity /> Revert
                  </button>
                )}
                
                {task.status === 'in-progress' && (
                  <button 
                    className="btn-action pending"
                    onClick={() => handleTaskStatusUpdate(task.id, 'pending')}
                    title="Mark as Pending"
                  >
                    <FiAlertCircle /> Mark Pending
                  </button>
                )}
                
                {task.status === 'pending' && (
                  <button 
                    className="btn-action start"
                    onClick={() => handleTaskStatusUpdate(task.id, 'in-progress')}
                    title="Start Working"
                  >
                    <FiActivity /> Start Task
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
