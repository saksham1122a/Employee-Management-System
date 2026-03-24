import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiSend, FiInbox, FiPaperclip, FiSearch, FiFilter, FiTrash2, FiArchive, FiStar, FiMoreVertical, FiCheck, FiCheckCircle, FiClock, FiUser, FiMail, FiBell } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Messages.css';

// Move getDefaultMessages outside the component to fix ReferenceError
const getDefaultMessages = () => {
  return []; // Return empty array - we'll fetch real data from localStorage
};

const Messages = () => {
  const [messages, setMessages] = useState(() => {
    // Load messages from localStorage (real-time data from Contact.jsx)
    const savedMessages = localStorage.getItem('adminMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Ensure unique keys by removing duplicates
        const uniqueMessages = parsedMessages.filter((msg, index, self) =>
          index === self.findIndex((m) => m.id === msg.id)
        );
        return uniqueMessages;
      } catch (error) {
        console.error('Error loading saved messages:', error);
      }
    }
    return getDefaultMessages();
  });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('inbox');
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  // Real-time data fetching from localStorage
  useEffect(() => {
    const fetchRealTimeMessages = () => {
      const savedMessages = localStorage.getItem('adminMessages');
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          // Filter to show only user-sent messages (exclude default/mock messages)
          const userMessages = parsedMessages.filter(msg => 
            msg.sender !== 'John Doe' && 
            msg.senderEmail !== 'john.doe@company.com' &&
            msg.sender !== 'Sarah Wilson' &&
            msg.senderEmail !== 'sarah.wilson@company.com' &&
            msg.sender !== 'Mike Johnson' &&
            msg.senderEmail !== 'mike.johnson@company.com' &&
            msg.sender !== 'System Admin' &&
            msg.senderEmail !== 'system@company.com' &&
            msg.sender !== 'Emma Davis' &&
            msg.senderEmail !== 'emma.davis@company.com'
          );
          
          // Ensure unique keys
          const uniqueMessages = userMessages.filter((msg, index, self) =>
            index === self.findIndex((m) => m.id === msg.id)
          );
          
          setMessages(uniqueMessages);
        } catch (error) {
          console.error('Error loading real-time messages:', error);
        }
      }
    };

    // Initial fetch
    fetchRealTimeMessages();
    
    // Set up polling for real-time updates (every 5 seconds)
    const interval = setInterval(fetchRealTimeMessages, 5000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Update localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('adminMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const getFilteredMessages = () => {
    let filtered = messages;
    
    // Filter out system-generated "New User" messages - only show real user messages
    filtered = filtered.filter(msg => 
      msg.sender !== 'New User' && 
      msg.senderEmail !== 'newuser@company.com'
    );
    
    // Apply tab filter
    if (activeTab === 'starred') {
      filtered = filtered.filter(msg => msg.isStarred);
    } else if (activeTab === 'sent') {
      filtered = []; // Mock sent messages would be here
    } else if (activeTab === 'archived') {
      filtered = filtered.filter(msg => msg.isArchived);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(msg =>
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filterType !== 'all') {
      filtered = filtered.filter(msg => msg.category === filterType);
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      setMessages(prev => prev.map(msg =>
        msg.id === message.id ? { ...msg, isRead: true } : msg
      ));
    }
  };

  const handleStarToggle = (messageId, e) => {
    e.stopPropagation();
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
    toast.success('Message starred status updated');
  };

  const handleDelete = (messageId, e) => {
    e.stopPropagation();
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
    toast.success('Message deleted');
  };

  const handleArchive = (messageId, e) => {
    e.stopPropagation();
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, isArchived: true } : msg
    ));
    toast.success('Message archived');
  };

  const handleSendReply = () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    // Simulate sending reply
    const replyMessage = {
      id: messages.length + 1,
      sender: 'Admin',
      senderEmail: 'admin@company.com',
      subject: `Re: ${selectedMessage.subject}`,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      category: 'sent',
      priority: 'medium',
      attachments: []
    };

    setMessages(prev => [replyMessage, ...prev]);
    setNewMessage('');
    setReplyingTo(null);
    toast.success('Reply sent successfully');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e53e3e';
      case 'medium': return '#f39c12';
      case 'low': return '#48bb78';
      default: return '#718096';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'work': return <FiMessageSquare />;
      case 'meeting': return <FiClock />;
      case 'hr': return <FiUser />;
      case 'system': return <FiBell />;
      case 'finance': return <FiMail />;
      default: return <FiMessageSquare />;
    }
  };

  const filteredMessages = getFilteredMessages();
  const unreadCount = messages.filter(msg => !msg.isRead && !msg.isArchived).length;

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h2>Messages</h2>
        <div className="header-actions">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <FiFilter className="filter-icon" />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="work">Work</option>
              <option value="meeting">Meeting</option>
              <option value="hr">HR</option>
              <option value="system">System</option>
              <option value="finance">Finance</option>
            </select>
          </div>
        </div>
      </div>

      <div className="messages-layout">
        {/* Sidebar */}
        <div className="messages-sidebar">
          <div className="message-tabs">
            <button
              className={`tab-btn ${activeTab === 'inbox' ? 'active' : ''}`}
              onClick={() => setActiveTab('inbox')}
            >
              <FiInbox />
              <span>Inbox</span>
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>
            <button
              className={`tab-btn ${activeTab === 'starred' ? 'active' : ''}`}
              onClick={() => setActiveTab('starred')}
            >
              <FiStar />
              <span>Starred</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
              onClick={() => setActiveTab('sent')}
            >
              <FiSend />
              <span>Sent</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'archived' ? 'active' : ''}`}
              onClick={() => setActiveTab('archived')}
            >
              <FiArchive />
              <span>Archived</span>
            </button>
          </div>

          <div className="message-list">
            {loading ? (
              <div className="loading-messages">
                <div className="spinner"></div>
                <p>Loading messages...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="no-messages">
                <FiInbox />
                <p>No messages found</p>
              </div>
            ) : (
              filteredMessages.map(message => (
                <div
                  key={message.id}
                  className={`message-item ${selectedMessage?.id === message.id ? 'active' : ''} ${!message.isRead ? 'unread' : ''}`}
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="message-avatar">
                    {message.sender.charAt(0).toUpperCase()}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="sender">{message.sender}</span>
                      <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
                    </div>
                    <div className="subject">{message.subject}</div>
                    <div className="preview">{message.content.substring(0, 60)}...</div>
                    <div className="message-meta">
                      <div className="category-tag" style={{ color: getPriorityColor(message.priority) }}>
                        {getCategoryIcon(message.category)}
                        <span>{message.category}</span>
                      </div>
                      {message.attachments.length > 0 && (
                        <span className="attachment-indicator">
                          <FiPaperclip />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="message-actions">
                    <button
                      className="action-btn"
                      onClick={(e) => handleStarToggle(message.id, e)}
                    >
                      <FiStar className={message.isStarred ? 'starred' : ''} />
                    </button>
                    <button className="action-btn">
                      <FiMoreVertical />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className="message-content-area">
          {selectedMessage ? (
            <div className="message-detail">
              <div className="message-detail-header">
                <div className="sender-info">
                  <div className="sender-avatar">
                    {selectedMessage.sender.charAt(0).toUpperCase()}
                  </div>
                  <div className="sender-details">
                    <h3>{selectedMessage.sender}</h3>
                    <p>{selectedMessage.senderEmail}</p>
                    <span className="message-time">
                      {new Date(selectedMessage.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="message-actions">
                  <button className="action-btn">
                    <FiStar className={selectedMessage.isStarred ? 'starred' : ''} />
                  </button>
                  <button className="action-btn" onClick={(e) => handleArchive(selectedMessage.id, e)}>
                    <FiArchive />
                  </button>
                  <button className="action-btn" onClick={(e) => handleDelete(selectedMessage.id, e)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <div className="message-body">
                <h2 className="message-subject">{selectedMessage.subject}</h2>
                <div className="message-text">
                  {selectedMessage.content}
                </div>

                {selectedMessage.attachments.length > 0 && (
                  <div className="message-attachments">
                    <h4>Attachments</h4>
                    <div className="attachment-list">
                      {selectedMessage.attachments.map((attachment, index) => (
                        <div key={index} className="attachment-item">
                          <FiPaperclip />
                          <span>{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reply Section */}
              <div className="reply-section">
                <div className="reply-header">
                  <h4>Reply</h4>
                </div>
                <div className="reply-form">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your reply..."
                    rows={4}
                  />
                  <div className="reply-actions">
                    <button className="attach-btn">
                      <FiPaperclip />
                    </button>
                    <button
                      className="send-btn"
                      onClick={handleSendReply}
                      disabled={!newMessage.trim()}
                    >
                      <FiSend />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-message-selected">
              <FiMessageSquare />
              <h3>Select a message to read</h3>
              <p>Choose a message from the list to view its content</p>
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Messages;