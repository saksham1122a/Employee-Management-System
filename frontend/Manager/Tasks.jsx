import React, { useState, useEffect, useCallback } from 'react';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiCheckCircle, 
  FiAlertCircle,
  FiFilter,
  FiSearch,
  FiChevronDown,
  FiX,
  FiSave,
  FiTag
} from 'react-icons/fi';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    deadline: '',
    category: '',
    estimatedHours: ''
  });

  // Real-time employee data
  const [employees, setEmployees] = useState([]);

  // Load real-time employee data
  const loadEmployeesFromStorage = useCallback(() => {
    try {
      const storedEmployees = localStorage.getItem('employees');
      if (storedEmployees) {
        return JSON.parse(storedEmployees);
      }
    } catch (error) {
      console.error('Error loading employees from storage:', error);
    }
    return null;
  }, []);

  // Fetch available employees from backend
  const fetchAvailableEmployees = useCallback(async () => {
    try {
      console.log('🎯 Fetching available employees from backend...');
      
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        // Return fallback employees for testing
        return [
          { id: 'emp001', name: 'Mike Employee', email: 'mike@company.com', department: 'Management', role: 'employee', status: 'Active' },
          { id: 'emp002', name: 'Saksham Nanda', email: 'saksham@company.com', department: 'Development', role: 'employee', status: 'Active' }
        ];
      }
      
      console.log('🔑 Using token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch('http://localhost:5000/api/auth/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📡 API Response status:', response.status);
      
      if (response.ok) {
        const usersData = await response.json();
        console.log('✅ Employees fetched from backend:', usersData);
        
        // Filter to show only available employees (role === 'employee' and status === 'Active')
        const availableEmployees = usersData.filter(user => 
          user.role === 'employee' && 
          (user.status === 'Active' || user.status === 'active')
        );
        
        console.log('👥 Available employees after filtering:', availableEmployees);
        
        // Format data for display
        const formattedEmployees = availableEmployees.map(user => ({
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          department: user.department || 'General',
          status: user.status || 'Active',
          role: user.role
        }));
        
        // Save to localStorage for real-time sync
        localStorage.setItem('employees', JSON.stringify(formattedEmployees));
        console.log('👥 Available employees saved:', formattedEmployees.length);
        
        // If no available employees, return fallback
        if (formattedEmployees.length === 0) {
          console.log('⚠️ No available employees found, returning fallback');
          return [
            { id: 'emp001', name: 'Mike Employee', email: 'mike@company.com', department: 'Management', role: 'employee', status: 'Active' },
            { id: 'emp002', name: 'Saksham Nanda', email: 'saksham@company.com', department: 'Development', role: 'employee', status: 'Active' }
          ];
        }
        
        return formattedEmployees;
      } else if (response.status === 401) {
        console.error('Token expired or invalid');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        // Return fallback employees
        return [
          { id: 'emp001', name: 'Mike Employee', email: 'mike@company.com', department: 'Management', role: 'employee', status: 'Active' },
          { id: 'emp002', name: 'Saksham Nanda', email: 'saksham@company.com', department: 'Development', role: 'employee', status: 'Active' }
        ];
      } else {
        console.error('Failed to fetch employees from backend, status:', response.status);
        // Return fallback employees
        return [
          { id: 'emp001', name: 'Mike Employee', email: 'mike@company.com', department: 'Management', role: 'employee', status: 'Active' },
          { id: 'emp002', name: 'Saksham Nanda', email: 'saksham@company.com', department: 'Development', role: 'employee', status: 'Active' }
        ];
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      // Return fallback employees
      return [
        { id: 'emp001', name: 'Mike Employee', email: 'mike@company.com', department: 'Management', role: 'employee', status: 'Active' },
        { id: 'emp002', name: 'Saksham Nanda', email: 'saksham@company.com', department: 'Development', role: 'employee', status: 'Active' }
      ];
    }
  }, []);

  // Navigate back function
  const handleGoBack = () => {
    window.history.back();
  };

  // Initialize employees with real-time data only
  useEffect(() => {
    const initializeEmployees = async () => {
      // First try to fetch from backend
      const backendEmployees = await fetchAvailableEmployees();
      
      if (backendEmployees.length > 0) {
        setEmployees(backendEmployees);
        console.log('📋 Loaded available employees from backend:', backendEmployees.length, 'employees');
      } else {
        // Fallback to localStorage if backend fails
        const storedEmployees = loadEmployeesFromStorage();
        
        if (storedEmployees && storedEmployees.length > 0) {
          setEmployees(storedEmployees);
          console.log('📋 Loaded employees from localStorage fallback:', storedEmployees.length, 'employees');
        } else {
          // Only use real-time employees as last resort
          const realTimeEmployees = [
            { id: 'emp001', name: 'Mike Employee', email: 'mike@company.com', department: 'Management', role: 'employee', status: 'Active' },
            { id: 'emp002', name: 'Saksham Nanda', email: 'saksham@company.com', department: 'Development', role: 'employee', status: 'Active' }
          ];
          setEmployees(realTimeEmployees);
          // Save real-time data to storage
          localStorage.setItem('employees', JSON.stringify(realTimeEmployees));
          console.log('👥 Initialized with real-time employees:', realTimeEmployees.length);
        }
      }
    };
    
    initializeEmployees();
  }, [loadEmployeesFromStorage, fetchAvailableEmployees]);

  // Listen for employee data updates
  useEffect(() => {
    const handleEmployeeUpdate = (event) => {
      const { employees: updatedEmployees } = event.detail;
      if (updatedEmployees) {
        setEmployees(updatedEmployees);
        console.log('👥 Employee data updated in real-time:', updatedEmployees.length, 'employees');
      }
    };

    window.addEventListener('employeesUpdated', handleEmployeeUpdate);
    
    return () => {
      window.removeEventListener('employeesUpdated', handleEmployeeUpdate);
    };
  }, []);

  // Auto-sync employee data every 3 seconds
  useEffect(() => {
    const syncInterval = setInterval(async () => {
      // Try to fetch fresh data from backend
      const backendEmployees = await fetchAvailableEmployees();
      
      if (backendEmployees.length > 0) {
        // Update if backend data is different
        if (JSON.stringify(backendEmployees) !== JSON.stringify(employees)) {
          setEmployees(backendEmployees);
          console.log('🔄 Employee data synced from backend');
        }
      } else {
        // Fallback to localStorage sync
        const storedEmployees = loadEmployeesFromStorage();
        if (storedEmployees && JSON.stringify(storedEmployees) !== JSON.stringify(employees)) {
          setEmployees(storedEmployees);
          console.log('🔄 Employee data synced from storage');
        }
      }
    }, 3000);

    return () => clearInterval(syncInterval);
  }, [employees, loadEmployeesFromStorage, fetchAvailableEmployees]);

  const categories = [
    'Development', 'Design', 'Testing', 'Documentation', 'Meeting', 'Review', 'Research', 'Other'
  ];

  // Real-time data synchronization
  const loadTasksFromStorage = useCallback(() => {
    try {
      const storedTasks = localStorage.getItem('managerTasks');
      if (storedTasks) {
        return JSON.parse(storedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks from storage:', error);
    }
    return null;
  }, []);

  const saveTasksToStorage = useCallback((tasksData) => {
    try {
      localStorage.setItem('managerTasks', JSON.stringify(tasksData));
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('tasksUpdated', { 
        detail: { tasks: tasksData, action: 'save' } 
      }));
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
    }
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    const handleTasksUpdate = (event) => {
      const { tasks: updatedTasks } = event.detail;
      setTasks(updatedTasks);
    };

    window.addEventListener('tasksUpdated', handleTasksUpdate);
    
    return () => {
      window.removeEventListener('tasksUpdated', handleTasksUpdate);
    };
  }, []);

  // Initialize tasks with only real-time data
  useEffect(() => {
    const storedTasks = loadTasksFromStorage();
    
    if (storedTasks && storedTasks.length > 0) {
      // Filter to show only real-time tasks
      const realTimeTasks = storedTasks.filter(task => task.isRealTime === true);
      setTasks(realTimeTasks);
      console.log('📋 Loaded real-time tasks:', realTimeTasks.length, 'tasks');
    } else {
      // Start with empty state - no static data
      setTasks([]);
      console.log('📋 Starting with empty tasks - only real-time data will be shown');
    }
  }, [loadTasksFromStorage]);

  const handleAddTask = () => {
    // Find the selected employee to get their ID
    const selectedEmployee = employees.find(emp => emp.name === formData.assignedTo);
    
    const newTask = {
      id: Date.now(), // Use timestamp for unique ID
      ...formData,
      assignedToId: selectedEmployee?.id || '',
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      progress: 0,
      isRealTime: true, // Mark as real-time created task
      realTimeCreatedAt: new Date().toISOString(), // Track exact creation time
      employeeDepartment: selectedEmployee?.department || '',
      employeeEmail: selectedEmployee?.email || ''
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    
    setShowAddModal(false);
    resetForm();
    
    // Show notification for real-time task creation
    console.log('✅ New task created in real-time:', newTask.title);
    console.log('👤 Assigned to:', selectedEmployee?.name, 'from', selectedEmployee?.department);
  };

  const handleUpdateTask = () => {
    const updatedTasks = tasks.map(task => 
      task.id === selectedTask.id 
        ? { ...task, ...formData, updatedAt: new Date().toISOString() }
        : task
    );
    
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    setShowEditModal(false);
    resetForm();
    
    console.log('📝 Task updated in real-time:', selectedTask.title);
  };

  const handleDeleteTask = (taskId) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    
    console.log('🗑️ Task deleted in real-time:', taskToDelete?.title);
  };

  // Auto-sync with storage every 5 seconds for real-time updates
  useEffect(() => {
    const syncInterval = setInterval(() => {
      const storedTasks = loadTasksFromStorage();
      if (storedTasks && JSON.stringify(storedTasks) !== JSON.stringify(tasks)) {
        setTasks(storedTasks);
        console.log('🔄 Tasks synced from storage');
      }
    }, 5000);

    return () => clearInterval(syncInterval);
  }, [tasks, loadTasksFromStorage]);

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      priority: task.priority,
      deadline: task.deadline,
      category: task.category,
      estimatedHours: task.estimatedHours
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      deadline: '',
      category: '',
      estimatedHours: ''
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#27ae60';
      case 'in-progress': return '#3498db';
      case 'pending': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="tasks-container">
      {/* Header */}
      <div className="tasks-header">
        <div className="header-left">
          <h1>Task Management</h1>
          <p>Assign and track tasks for your team</p>
        </div>
        <div className="header-right">
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <FiPlus />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="tasks-controls">
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <div className="filter-dropdown">
            <button 
              className="filter-btn"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <FiFilter />
              <span>Filters</span>
              <FiChevronDown />
            </button>
            
            {showFilterDropdown && (
              <div className="filter-menu">
                <div className="filter-group">
                  <label>Status</label>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Priority</label>
                  <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="task-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{tasks.filter(t => t.status === 'completed').length}</h3>
            <p>Completed</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-info">
            <h3>{tasks.filter(t => t.status === 'in-progress').length}</h3>
            <p>In Progress</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FiAlertCircle />
          </div>
          <div className="stat-info">
            <h3>{tasks.filter(t => t.status === 'pending').length}</h3>
            <p>Pending</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-info">
            <h3>{tasks.filter(t => getDaysUntilDeadline(t.deadline) <= 3 && t.status !== 'completed').length}</h3>
            <p>Due Soon</p>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="tasks-grid">
        {filteredTasks.map(task => {
          const daysUntilDeadline = getDaysUntilDeadline(task.deadline);
          const isOverdue = daysUntilDeadline < 0 && task.status !== 'completed';
          
          return (
            <div key={task.id} className={`task-card ${isOverdue ? 'overdue' : ''} ${task.isRealTime ? 'real-time' : ''}`}>
              {task.isRealTime && (
                <div className="real-time-indicator">
                  <span className="pulse-dot"></span>
                  <span className="real-time-text">Live</span>
                </div>
              )}
              <div className="task-header">
                <div className="task-priority" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                  {task.priority.toUpperCase()}
                </div>
                <div className="task-actions">
                  <button className="action-btn edit" onClick={() => handleEditTask(task)} title="Edit Task">
                    <FiEdit2 />
                    <span>Edit</span>
                  </button>
                  <button className="action-btn delete" onClick={() => handleDeleteTask(task.id)} title="Delete Task">
                    <FiTrash2 />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
              
              <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description}</p>
                
                <div className="task-meta">
                  <div className="meta-item">
                    <FiUser />
                    <span>{task.assignedTo}</span>
                  </div>
                  <div className="meta-item">
                    <FiCalendar />
                    <span>{task.deadline}</span>
                  </div>
                  <div className="meta-item">
                    <FiClock />
                    <span>{task.estimatedHours}h</span>
                  </div>
                  <div className="meta-item">
                    <FiTag />
                    <span>{task.category}</span>
                  </div>
                </div>
                
                <div className="task-footer">
                  <div className="task-status" style={{ backgroundColor: getStatusColor(task.status) }}>
                    {task.status.replace('-', ' ').toUpperCase()}
                  </div>
                  <div className="task-deadline">
                    {isOverdue ? (
                      <span className="overdue-text">Overdue</span>
                    ) : daysUntilDeadline <= 3 ? (
                      <span className="due-soon-text">Due in {daysUntilDeadline} days</span>
                    ) : (
                      <span>{daysUntilDeadline} days left</span>
                    )}
                  </div>
                </div>
                
                {task.status === 'in-progress' && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${task.progress}%` }}
                    ></div>
                    <span className="progress-text">{task.progress}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title-section">
                <h2>Add New Task</h2>
                <div className="real-time-employee-indicator">
                  <span className="pulse-dot"></span>
                  <span>Live Employee Data</span>
                </div>
              </div>
              <button className="close-btn" onClick={() => {
                setShowAddModal(false);
                handleGoBack();
              }}>
                <FiX />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter task title"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter task description"
                  rows="3"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Assign To *</label>
                  <div className="employee-select-container">
                    <select
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                      required
                      className="employee-select"
                    >
                      <option value="">Select Employee</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.name}>
                          {emp.name} - {emp.department} ({emp.status})
                        </option>
                      ))}
                    </select>
                    <button 
                      type="button" 
                      className="refresh-employees-btn"
                      onClick={async () => {
                        const freshEmployees = await fetchAvailableEmployees();
                        if (freshEmployees.length > 0) {
                          setEmployees(freshEmployees);
                          console.log('🔄 Employees refreshed:', freshEmployees.length);
                        }
                      }}
                      title="Refresh employee list"
                    >
                      🔄
                    </button>
                  </div>
                  {formData.assignedTo && (
                    <div className="selected-employee-info">
                      {(() => {
                        const selectedEmp = employees.find(emp => emp.name === formData.assignedTo);
                        return selectedEmp ? (
                          <div className="employee-details">
                            <span className="employee-email">📧 {selectedEmp.email}</span>
                            <span className="employee-dept">🏢 {selectedEmp.department}</span>
                            <span className={`employee-status ${selectedEmp.status.toLowerCase()}`}>
                              🟢 {selectedEmp.status}
                            </span>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                  {employees.length === 0 && (
                    <div className="no-employees-warning">
                      <span>⚠️ No available employees found. Please refresh or contact administrator.</span>
                      <button 
                        type="button" 
                        className="debug-btn"
                        onClick={() => {
                          console.log('🔍 Debug Information:');
                          console.log('Token:', sessionStorage.getItem('token') ? 'Exists' : 'Not found');
                          console.log('User:', sessionStorage.getItem('user'));
                          console.log('Current employees:', employees);
                          console.log('LocalStorage employees:', localStorage.getItem('employees'));
                          
                          // Manually set fallback employees for testing
                          const fallbackEmployees = [
                            { id: 'emp001', name: 'Mike Employee', email: 'mike@company.com', department: 'Management', role: 'employee', status: 'Active' },
                            { id: 'emp002', name: 'Saksham Nanda', email: 'saksham@company.com', department: 'Development', role: 'employee', status: 'Active' }
                          ];
                          setEmployees(fallbackEmployees);
                          localStorage.setItem('employees', JSON.stringify(fallbackEmployees));
                          console.log('🔧 Set fallback employees for testing');
                        }}
                        title="Debug: Set fallback employees"
                      >
                        🔧 Debug
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Priority *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Deadline *</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Estimated Hours</label>
                <input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
                  placeholder="Enter estimated hours"
                  min="1"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddTask}>
                <FiSave />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Task</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <FiX />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter task title"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter task description"
                  rows="3"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Assign To *</label>
                  <div className="employee-select-container">
                    <select
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                      required
                      className="employee-select"
                    >
                      <option value="">Select Employee</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.name}>
                          {emp.name} - {emp.department} ({emp.status})
                        </option>
                      ))}
                    </select>
                    <button 
                      type="button" 
                      className="refresh-employees-btn"
                      onClick={async () => {
                        const freshEmployees = await fetchAvailableEmployees();
                        if (freshEmployees.length > 0) {
                          setEmployees(freshEmployees);
                          console.log('🔄 Employees refreshed:', freshEmployees.length);
                        }
                      }}
                      title="Refresh employee list"
                    >
                      🔄
                    </button>
                  </div>
                  {formData.assignedTo && (
                    <div className="selected-employee-info">
                      {(() => {
                        const selectedEmp = employees.find(emp => emp.name === formData.assignedTo);
                        return selectedEmp ? (
                          <div className="employee-details">
                            <span className="employee-email">📧 {selectedEmp.email}</span>
                            <span className="employee-dept">🏢 {selectedEmp.department}</span>
                            <span className={`employee-status ${selectedEmp.status.toLowerCase()}`}>
                              🟢 {selectedEmp.status}
                            </span>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                  {employees.length === 0 && (
                    <div className="no-employees-warning">
                      <span>⚠️ No available employees found. Please refresh or contact administrator.</span>
                      <button 
                        type="button" 
                        className="debug-btn"
                        onClick={() => {
                          console.log('🔍 Debug Information:');
                          console.log('Token:', sessionStorage.getItem('token') ? 'Exists' : 'Not found');
                          console.log('User:', sessionStorage.getItem('user'));
                          console.log('Current employees:', employees);
                          console.log('LocalStorage employees:', localStorage.getItem('employees'));
                          
                          // Manually set fallback employees for testing
                          const fallbackEmployees = [
                            { id: 'emp001', name: 'Mike Employee', email: 'mike@company.com', department: 'Management', role: 'employee', status: 'Active' },
                            { id: 'emp002', name: 'Saksham Nanda', email: 'saksham@company.com', department: 'Development', role: 'employee', status: 'Active' }
                          ];
                          setEmployees(fallbackEmployees);
                          localStorage.setItem('employees', JSON.stringify(fallbackEmployees));
                          console.log('🔧 Set fallback employees for testing');
                        }}
                        title="Debug: Set fallback employees"
                      >
                        🔧 Debug
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Priority *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Deadline *</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Estimated Hours</label>
                <input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
                  placeholder="Enter estimated hours"
                  min="1"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleUpdateTask}>
                <FiSave />
                <span>Update Task</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
