import React, { useState, useEffect } from 'react';
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

  const employees = [
    { id: 'emp001', name: 'John Smith' },
    { id: 'emp002', name: 'Sarah Johnson' },
    { id: 'emp003', name: 'Mike Wilson' },
    { id: 'emp004', name: 'Emily Davis' },
    { id: 'emp005', name: 'Robert Brown' }
  ];

  const categories = [
    'Development', 'Design', 'Testing', 'Documentation', 'Meeting', 'Review', 'Research', 'Other'
  ];

  // Sample tasks data
  useEffect(() => {
    const sampleTasks = [
      {
        id: 1,
        title: 'Complete Dashboard Design',
        description: 'Design and implement the new dashboard layout with modern UI components',
        assignedTo: 'John Smith',
        assignedToId: 'emp001',
        priority: 'high',
        status: 'in-progress',
        deadline: '2024-02-28',
        category: 'Design',
        estimatedHours: '8',
        createdAt: '2024-02-20',
        progress: 65
      },
      {
        id: 2,
        title: 'API Integration',
        description: 'Integrate payment gateway API with the existing system',
        assignedTo: 'Sarah Johnson',
        assignedToId: 'emp002',
        priority: 'high',
        status: 'pending',
        deadline: '2024-02-25',
        category: 'Development',
        estimatedHours: '12',
        createdAt: '2024-02-19',
        progress: 0
      },
      {
        id: 3,
        title: 'User Testing',
        description: 'Conduct user testing sessions and gather feedback',
        assignedTo: 'Mike Wilson',
        assignedToId: 'emp003',
        priority: 'medium',
        status: 'in-progress',
        deadline: '2024-03-01',
        category: 'Testing',
        estimatedHours: '6',
        createdAt: '2024-02-18',
        progress: 40
      },
      {
        id: 4,
        title: 'Documentation Update',
        description: 'Update API documentation with new endpoints',
        assignedTo: 'Emily Davis',
        assignedToId: 'emp004',
        priority: 'low',
        status: 'completed',
        deadline: '2024-02-22',
        category: 'Documentation',
        estimatedHours: '4',
        createdAt: '2024-02-17',
        progress: 100
      }
    ];
    setTasks(sampleTasks);
  }, []);

  const handleAddTask = () => {
    const newTask = {
      id: tasks.length + 1,
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      progress: 0
    };
    setTasks([...tasks, newTask]);
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdateTask = () => {
    setTasks(tasks.map(task => 
      task.id === selectedTask.id 
        ? { ...task, ...formData }
        : task
    ));
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

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
            <div key={task.id} className={`task-card ${isOverdue ? 'overdue' : ''}`}>
              <div className="task-header">
                <div className="task-priority" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                  {task.priority.toUpperCase()}
                </div>
                <div className="task-actions">
                  <button className="action-btn edit" onClick={() => handleEditTask(task)}>
                    <FiEdit2 />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDeleteTask(task.id)}>
                    <FiTrash2 />
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
              <h2>Add New Task</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
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
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
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
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
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