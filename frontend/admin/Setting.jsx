import React, { useState, useEffect } from 'react';
import { FiSettings, FiUser, FiBell, FiLock, FiDatabase, FiMonitor, FiMoon, FiSun, FiGlobe, FiMail, FiShield, FiClock, FiCheck, FiX, FiSave, FiRefreshCw, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Setting.css';

const Settings = () => {
  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'TeamBuddy EMS',
    siteDescription: 'Employee Management System',
    maintenanceMode: false,
    debugMode: false,
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour',
    language: 'en'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    attendanceAlerts: true,
    salaryUpdates: true,
    systemAlerts: true,
    weeklyReports: false,
    marketingEmails: false
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordComplexity: true,
    loginAttempts: 5,
    autoLogout: true,
    ipRestriction: false,
    auditLogging: true
  });

  // Database Settings
  const [databaseSettings, setDatabaseSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 90,
    compression: true,
    encryption: true,
    maxConnections: 100
  });

  // UI Settings
  const [uiSettings, setUiSettings] = useState({
    darkMode: false,
    compactMode: false,
    animations: true,
    sidebarCollapsed: false,
    showNotifications: true,
    theme: 'default'
  });

  // Loading states
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [activeTab, setActiveTab] = useState('system');

  // Real-time status indicators
  const [systemStatus, setSystemStatus] = useState({
    database: 'connected',
    server: 'online',
    cache: 'active',
    backup: 'up-to-date'
  });

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        cache: Math.random() > 0.1 ? 'active' : 'syncing',
        backup: Math.random() > 0.05 ? 'up-to-date' : 'pending'
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setSystemSettings(prev => ({ ...prev, ...settings.system }));
        setNotificationSettings(prev => ({ ...prev, ...settings.notifications }));
        setSecuritySettings(prev => ({ ...prev, ...settings.security }));
        setDatabaseSettings(prev => ({ ...prev, ...settings.database }));
        setUiSettings(prev => ({ ...prev, ...settings.ui }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = async (section, settings) => {
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const allSettings = {
        system: section === 'system' ? settings : systemSettings,
        notifications: section === 'notifications' ? settings : notificationSettings,
        security: section === 'security' ? settings : securitySettings,
        database: section === 'database' ? settings : databaseSettings,
        ui: section === 'ui' ? settings : uiSettings
      };
      
      localStorage.setItem('adminSettings', JSON.stringify(allSettings));
      setLastSaved(new Date().toLocaleTimeString());
      
      toast.success(`${section} settings saved successfully!`, {
        position: 'top-right',
        autoClose: 3000
      });
    } catch (error) {
      toast.error('Failed to save settings', {
        position: 'top-right',
        autoClose: 3000
      });
    } finally {
      setSaving(false);
    }
  };

  // Test notification
  const testNotification = () => {
    toast.info('Test notification from Settings!', {
      position: 'top-right',
      autoClose: 3000
    });
  };

  // Reset to defaults
  const resetToDefaults = (section) => {
    const defaults = {
      system: {
        siteName: 'TeamBuddy EMS',
        siteDescription: 'Employee Management System',
        maintenanceMode: false,
        debugMode: false,
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12-hour',
        language: 'en'
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        attendanceAlerts: true,
        salaryUpdates: true,
        systemAlerts: true,
        weeklyReports: false,
        marketingEmails: false
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordComplexity: true,
        loginAttempts: 5,
        autoLogout: true,
        ipRestriction: false,
        auditLogging: true
      },
      database: {
        autoBackup: true,
        backupFrequency: 'daily',
        retentionPeriod: 90,
        compression: true,
        encryption: true,
        maxConnections: 100
      },
      ui: {
        darkMode: false,
        compactMode: false,
        animations: true,
        sidebarCollapsed: false,
        showNotifications: true,
        theme: 'default'
      }
    };

    switch (section) {
      case 'system':
        setSystemSettings(defaults.system);
        break;
      case 'notifications':
        setNotificationSettings(defaults.notifications);
        break;
      case 'security':
        setSecuritySettings(defaults.security);
        break;
      case 'database':
        setDatabaseSettings(defaults.database);
        break;
      case 'ui':
        setUiSettings(defaults.ui);
        break;
    }

    toast.info(`${section} settings reset to defaults`, {
      position: 'top-right',
      autoClose: 3000
    });
  };

  const tabs = [
    { id: 'system', label: 'System', icon: <FiSettings /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'security', label: 'Security', icon: <FiLock /> },
    { id: 'database', label: 'Database', icon: <FiDatabase /> },
    { id: 'ui', label: 'Appearance', icon: <FiMonitor /> }
  ];

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Settings</h2>
        <div className="header-actions">
          <div className="last-saved">
            {lastSaved && <span>Last saved: {lastSaved}</span>}
          </div>
          <button className="refresh-btn" onClick={() => window.location.reload()}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      <div className="settings-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="settings-content">
        {/* System Status */}
        <div className="status-bar">
          <div className="status-item">
            <div className={`status-indicator ${systemStatus.database}`}></div>
            <span>Database: {systemStatus.database}</span>
          </div>
          <div className="status-item">
            <div className={`status-indicator ${systemStatus.server}`}></div>
            <span>Server: {systemStatus.server}</span>
          </div>
          <div className="status-item">
            <div className={`status-indicator ${systemStatus.cache}`}></div>
            <span>Cache: {systemStatus.cache}</span>
          </div>
          <div className="status-item">
            <div className={`status-indicator ${systemStatus.backup}`}></div>
            <span>Backup: {systemStatus.backup}</span>
          </div>
        </div>

        {/* System Settings */}
        {activeTab === 'system' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>System Configuration</h3>
              <div className="section-actions">
                <button 
                  className="reset-btn"
                  onClick={() => resetToDefaults('system')}
                >
                  <FiRefreshCw /> Reset
                </button>
                <button 
                  className="save-btn"
                  onClick={() => saveSettings('system', systemSettings)}
                  disabled={saving}
                >
                  {saving ? <FiClock className="spinner" /> : <FiSave />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            <div className="settings-grid">
              <div className="setting-item">
                <label>Site Name</label>
                <input
                  type="text"
                  value={systemSettings.siteName}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  placeholder="Enter site name"
                />
              </div>

              <div className="setting-item">
                <label>Site Description</label>
                <textarea
                  value={systemSettings.siteDescription}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  placeholder="Enter site description"
                  rows={3}
                />
              </div>

              <div className="setting-item">
                <label>Timezone</label>
                <select
                  value={systemSettings.timezone}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, timezone: e.target.value }))}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="IST">India Standard Time</option>
                  <option value="CET">Central European Time</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Date Format</label>
                <select
                  value={systemSettings.dateFormat}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Time Format</label>
                <select
                  value={systemSettings.timeFormat}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, timeFormat: e.target.value }))}
                >
                  <option value="12-hour">12-hour</option>
                  <option value="24-hour">24-hour</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Language</label>
                <select
                  value={systemSettings.language}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, language: e.target.value }))}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>

              <div className="setting-item toggle">
                <label>Maintenance Mode</label>
                <button
                  className={`toggle-btn ${systemSettings.maintenanceMode ? 'active' : ''}`}
                  onClick={() => setSystemSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item toggle">
                <label>Debug Mode</label>
                <button
                  className={`toggle-btn ${systemSettings.debugMode ? 'active' : ''}`}
                  onClick={() => setSystemSettings(prev => ({ ...prev, debugMode: !prev.debugMode }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>Notification Preferences</h3>
              <div className="section-actions">
                <button 
                  className="reset-btn"
                  onClick={() => resetToDefaults('notifications')}
                >
                  <FiRefreshCw /> Reset
                </button>
                <button 
                  className="save-btn"
                  onClick={() => saveSettings('notifications', notificationSettings)}
                  disabled={saving}
                >
                  {saving ? <FiClock className="spinner" /> : <FiSave />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            <div className="settings-grid">
              <div className="setting-item toggle">
                <label>Email Notifications</label>
                <button
                  className={`toggle-btn ${notificationSettings.emailNotifications ? 'active' : ''}`}
                  onClick={() => setNotificationSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item toggle">
                <label>Push Notifications</label>
                <button
                  className={`toggle-btn ${notificationSettings.pushNotifications ? 'active' : ''}`}
                  onClick={() => setNotificationSettings(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item toggle">
                <label>SMS Notifications</label>
                <button
                  className={`toggle-btn ${notificationSettings.smsNotifications ? 'active' : ''}`}
                  onClick={() => setNotificationSettings(prev => ({ ...prev, smsNotifications: !prev.smsNotifications }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item toggle">
                <label>Attendance Alerts</label>
                <button
                  className={`toggle-btn ${notificationSettings.attendanceAlerts ? 'active' : ''}`}
                  onClick={() => setNotificationSettings(prev => ({ ...prev, attendanceAlerts: !prev.attendanceAlerts }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item toggle">
                <label>Salary Updates</label>
                <button
                  className={`toggle-btn ${notificationSettings.salaryUpdates ? 'active' : ''}`}
                  onClick={() => setNotificationSettings(prev => ({ ...prev, salaryUpdates: !prev.salaryUpdates }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item toggle">
                <label>System Alerts</label>
                <button
                  className={`toggle-btn ${notificationSettings.systemAlerts ? 'active' : ''}`}
                  onClick={() => setNotificationSettings(prev => ({ ...prev, systemAlerts: !prev.systemAlerts }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item toggle">
                <label>Weekly Reports</label>
                <button
                  className={`toggle-btn ${notificationSettings.weeklyReports ? 'active' : ''}`}
                  onClick={() => setNotificationSettings(prev => ({ ...prev, weeklyReports: !prev.weeklyReports }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item toggle">
                <label>Marketing Emails</label>
                <button
                  className={`toggle-btn ${notificationSettings.marketingEmails ? 'active' : ''}`}
                  onClick={() => setNotificationSettings(prev => ({ ...prev, marketingEmails: !prev.marketingEmails }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item">
                <button className="test-notification-btn" onClick={testNotification}>
                  <FiBell /> Test Notification
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>Security Configuration</h3>
              <div className="section-actions">
                <button 
                  className="reset-btn"
                  onClick={() => resetToDefaults('security')}
                >
                  <FiRefreshCw /> Reset
                </button>
                <button 
                  className="save-btn"
                  onClick={() => saveSettings('security', securitySettings)}
                  disabled={saving}
                >
                  {saving ? <FiClock className="spinner" /> : <FiSave />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            <div className="settings-grid">
              <div className="setting-item toggle">
                <label>Two-Factor Authentication</label>
                <button
                  className={`toggle-btn ${securitySettings.twoFactorAuth ? 'active' : ''}`}
                  onClick={() => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item">
                <label>Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                  min="5"
                  max="120"
                />
              </div>

              <div className="setting-item toggle">
                <label>Password Complexity</label>
                <button
                  className={`toggle-btn ${securitySettings.passwordComplexity ? 'active' : ''}`}
                  onClick={() => setSecuritySettings(prev => ({ ...prev, passwordComplexity: !prev.passwordComplexity }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item">
                <label>Max Login Attempts</label>
                <input
                  type="number"
                  value={securitySettings.loginAttempts}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))}
                  min="3"
                  max="10"
                />
              </div>

              <div className="setting-item toggle">
                <label>Auto Logout</label>
                <button
                  className={`toggle-btn ${securitySettings.autoLogout ? 'active' : ''}`}
                  onClick={() => setSecuritySettings(prev => ({ ...prev, autoLogout: !prev.autoLogout }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item toggle">
                <label>IP Restriction</label>
                <button
                  className={`toggle-btn ${securitySettings.ipRestriction ? 'active' : ''}`}
                  onClick={() => setSecuritySettings(prev => ({ ...prev, ipRestriction: !prev.ipRestriction }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item toggle">
                <label>Audit Logging</label>
                <button
                  className={`toggle-btn ${securitySettings.auditLogging ? 'active' : ''}`}
                  onClick={() => setSecuritySettings(prev => ({ ...prev, auditLogging: !prev.auditLogging }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Database Settings */}
        {activeTab === 'database' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>Database Configuration</h3>
              <div className="section-actions">
                <button 
                  className="reset-btn"
                  onClick={() => resetToDefaults('database')}
                >
                  <FiRefreshCw /> Reset
                </button>
                <button 
                  className="save-btn"
                  onClick={() => saveSettings('database', databaseSettings)}
                  disabled={saving}
                >
                  {saving ? <FiClock className="spinner" /> : <FiSave />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            <div className="settings-grid">
              <div className="setting-item toggle">
                <label>Auto Backup</label>
                <button
                  className={`toggle-btn ${databaseSettings.autoBackup ? 'active' : ''}`}
                  onClick={() => setDatabaseSettings(prev => ({ ...prev, autoBackup: !prev.autoBackup }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item">
                <label>Backup Frequency</label>
                <select
                  value={databaseSettings.backupFrequency}
                  onChange={(e) => setDatabaseSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Retention Period (days)</label>
                <input
                  type="number"
                  value={databaseSettings.retentionPeriod}
                  onChange={(e) => setDatabaseSettings(prev => ({ ...prev, retentionPeriod: parseInt(e.target.value) }))}
                  min="7"
                  max="365"
                />
              </div>

              <div className="setting-item toggle">
                <label>Compression</label>
                <button
                  className={`toggle-btn ${databaseSettings.compression ? 'active' : ''}`}
                  onClick={() => setDatabaseSettings(prev => ({ ...prev, compression: !prev.compression }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item toggle">
                <label>Encryption</label>
                <button
                  className={`toggle-btn ${databaseSettings.encryption ? 'active' : ''}`}
                  onClick={() => setDatabaseSettings(prev => ({ ...prev, encryption: !prev.encryption }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item">
                <label>Max Connections</label>
                <input
                  type="number"
                  value={databaseSettings.maxConnections}
                  onChange={(e) => setDatabaseSettings(prev => ({ ...prev, maxConnections: parseInt(e.target.value) }))}
                  min="10"
                  max="1000"
                />
              </div>
            </div>
          </div>
        )}

        {/* UI Settings */}
        {activeTab === 'ui' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>Appearance Settings</h3>
              <div className="section-actions">
                <button 
                  className="reset-btn"
                  onClick={() => resetToDefaults('ui')}
                >
                  <FiRefreshCw /> Reset
                </button>
                <button 
                  className="save-btn"
                  onClick={() => saveSettings('ui', uiSettings)}
                  disabled={saving}
                >
                  {saving ? <FiClock className="spinner" /> : <FiSave />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            <div className="settings-grid">
              <div className="setting-item toggle">
                <label>Dark Mode</label>
                <button
                  className={`toggle-btn ${uiSettings.darkMode ? 'active' : ''}`}
                  onClick={() => setUiSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item toggle">
                <label>Compact Mode</label>
                <button
                  className={`toggle-btn ${uiSettings.compactMode ? 'active' : ''}`}
                  onClick={() => setUiSettings(prev => ({ ...prev, compactMode: !prev.compactMode }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item toggle">
                <label>Animations</label>
                <button
                  className={`toggle-btn ${uiSettings.animations ? 'active' : ''}`}
                  onClick={() => setUiSettings(prev => ({ ...prev, animations: !prev.animations }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item toggle">
                <label>Sidebar Collapsed</label>
                <button
                  className={`toggle-btn ${uiSettings.sidebarCollapsed ? 'active' : ''}`}
                  onClick={() => setUiSettings(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item toggle">
                <label>Show Notifications</label>
                <button
                  className={`toggle-btn ${uiSettings.showNotifications ? 'active' : ''}`}
                  onClick={() => setUiSettings(prev => ({ ...prev, showNotifications: !prev.showNotifications }))}
                >
                  <div className="toggle-slider">
                    <FiToggleRight className="toggle-icon" />
                  </div>
                </button>
              </div>

              <div className="setting-item">
                <label>Theme</label>
                <select
                  value={uiSettings.theme}
                  onChange={(e) => setUiSettings(prev => ({ ...prev, theme: e.target.value }))}
                >
                  <option value="default">Default</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Settings;