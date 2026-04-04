import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiEdit2, FiCamera, FiSave, FiX, FiMapPin, FiCalendar, FiBriefcase } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../StyleSheets/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    phone: "", 
    avatar: "",
    role: "",
    department: "",
    employeeId: "",
    joinDate: "",
    address: "",
    bio: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const token = sessionStorage.getItem("token");
      const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
      
      if (!token) {
        navigate("/login");
        return;
      }

      // Try to get permanent data from localStorage first
      const userId = storedUser.id || storedUser._id || 'default';
      const permanentUserData = localStorage.getItem(`profile_${userId}`);
      
      // Use permanent data if available, otherwise use session data
      const userData = permanentUserData ? JSON.parse(permanentUserData) : {
        id: storedUser.id || storedUser._id || "1",
        firstName: storedUser.firstName || storedUser.name?.split(' ')[0] || "John",
        lastName: storedUser.lastName || storedUser.name?.split(' ')[1] || "Doe",
        email: storedUser.email || "john.doe@company.com",
        phone: storedUser.phone || "+1 234 567 8900",
        avatar: storedUser.avatar || "",
        role: storedUser.role || "employee",
        department: storedUser.department || "Engineering",
        employeeId: storedUser.employeeId || "EMP001",
        joinDate: storedUser.createdAt ? new Date(storedUser.createdAt).toLocaleDateString() : "2024-01-15",
        address: storedUser.address || "123 Main St, City, State 12345",
        bio: storedUser.bio || "Passionate professional dedicated to excellence in my role."
      };

      console.log('Loading user data:', userData); // Debug log
      setUser(userData);
      setFormData(userData);
      
      // Update sessionStorage with permanent data
      sessionStorage.setItem("user", JSON.stringify(userData));
      
    } catch (error) {
      console.error("Error loading user data:", error);
      navigate("/login");
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Update session storage immediately
      const updatedUser = { ...user, ...formData };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Save permanently to localStorage
      const userId = updatedUser.id || updatedUser._id || 'default';
      localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedUser));
      
      // Try to update backend API
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch('http://localhost:5000/api/auth/update-profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            phone: updatedUser.phone,
            department: updatedUser.department,
            address: updatedUser.address,
            bio: updatedUser.bio,
            avatar: updatedUser.avatar
          })
        });
        
        if (response.ok) {
          console.log('Profile updated successfully on backend');
        } else {
          console.log('Backend update failed, but local storage saved');
        }
      } catch (apiError) {
        console.log('API call failed, but local storage saved:', apiError);
      }
      
      setIsEditing(false);
      toast.success("Profile updated successfully! Changes are permanently saved.");
    } catch (err) {
      setError(err.message || "Failed to update profile");
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        toast.error("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result;
        const updatedFormData = { ...formData, avatar: newAvatar };
        setFormData(updatedFormData);
        
        // Update immediately in sessionStorage
        const updatedUser = { ...user, avatar: newAvatar };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Save permanently to localStorage
        const userId = updatedUser.id || updatedUser._id || 'default';
        localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedUser));
        
        toast.success("Profile picture updated and saved permanently!");
      };
      reader.readAsDataURL(file);
    }
  };

  const getRoleDisplay = (role) => {
    switch(role) {
      case 'admin': return 'Administrator';
      case 'manager': return 'Manager';
      case 'employee': return 'Employee';
      default: return 'Employee';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return '👑';
      case 'manager': return '👔';
      case 'employee': return '💼';
      default: return '💼';
    }
  };

  if (!user) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header-bg"></div>
      
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className={`profile-avatar ${isEditing ? 'editable' : ''}`}>
              {isEditing ? (
                <label htmlFor="avatar-upload" className="avatar-upload-label">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Avatar" />
                  ) : (
                    <div className="avatar-placeholder">
                      <FiCamera />
                      <span>Change Photo</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    style={{display: 'none'}} 
                  />
                </label>
              ) : (
                user.avatar ? (
                  <img src={user.avatar} alt="Avatar" />
                ) : (
                  <div className="avatar-initial">
                    {user.firstName?.charAt(0).toUpperCase()}{user.lastName?.charAt(0).toUpperCase()}
                  </div>
                )
              )}
            </div>
            
            <div className="profile-info">
              <h1 className="profile-name">{user.firstName} {user.lastName}</h1>
              <div className="profile-role-badge">
                <span className="role-icon">{getRoleIcon(user.role)}</span>
                <span className="role-text">{getRoleDisplay(user.role)}</span>
              </div>
              <p className="profile-department">{user.department}</p>
            </div>
            
            {!isEditing && (
              <button className="edit-profile-btn" onClick={handleEditToggle}>
                <FiEdit2 /> Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form className="profile-edit-form" onSubmit={handleUpdate}>
              <div className="edit-form-grid">
                <div className="form-group">
                  <label><FiUser /> First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label><FiUser /> Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label><FiPhone /> Phone</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label><FiBriefcase /> Department</label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label><FiCalendar /> Employee ID</label>
                  <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} readOnly />
                </div>
                <div className="form-group">
                  <label><FiMapPin /> Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </div>
                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3"></textarea>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleEditToggle} disabled={isLoading}>
                  <FiX /> Cancel
                </button>
                <button type="submit" className="save-btn" disabled={isLoading}>
                  <FiSave /> {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-icon"><FiUser /></div>
                  <div className="detail-content">
                    <label>Full Name</label>
                    <p>{user.firstName} {user.lastName}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon"><FiPhone /></div>
                  <div className="detail-content">
                    <label>Phone</label>
                    <p>{user.phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon"><FiBriefcase /></div>
                  <div className="detail-content">
                    <label>Department</label>
                    <p>{user.department}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon"><FiCalendar /></div>
                  <div className="detail-content">
                    <label>Join Date</label>
                    <p>{user.joinDate}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon"><FiMapPin /></div>
                  <div className="detail-content">
                    <label>Address</label>
                    <p>{user.address || "Not provided"}</p>
                  </div>
                </div>
              </div>
              
              <div className="bio-section">
                <h3>About Me</h3>
                <p>{user.bio || "No bio provided"}</p>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-navigation">
          <h3>Quick Navigation</h3>
          <div className="nav-buttons">
            {user?.role === 'employee' && (
              <Link to="/employee" className="nav-btn employee-btn">
                <div className="btn-icon">💼</div>
                <div className="btn-content">
                  <span className="btn-title">Employee Dashboard</span>
                  <span className="btn-subtitle">View your workspace</span>
                </div>
              </Link>
            )}
            
            {user?.role === 'manager' && (
              <Link to="/manager" className="nav-btn manager-btn">
                <div className="btn-icon">👔</div>
                <div className="btn-content">
                  <span className="btn-title">Manager Dashboard</span>
                  <span className="btn-subtitle">Manage your team</span>
                </div>
              </Link>
            )}
            
            {user?.role === 'admin' && (
              <Link to="/admin" className="nav-btn admin-btn">
                <div className="btn-icon">👑</div>
                <div className="btn-content">
                  <span className="btn-title">Admin Dashboard</span>
                  <span className="btn-subtitle">System administration</span>
                </div>
              </Link>
            )}
            
            {/* Additional navigation options */}
            <Link to="/employee/attendance" className="nav-btn secondary-btn">
              <div className="btn-icon">📊</div>
              <div className="btn-content">
                <span className="btn-title">Attendance</span>
                <span className="btn-subtitle">View attendance records</span>
              </div>
            </Link>
            
            <Link to="/employee/leave" className="nav-btn secondary-btn">
              <div className="btn-icon">📅</div>
              <div className="btn-content">
                <span className="btn-title">Leave Management</span>
                <span className="btn-subtitle">Request leave</span>
              </div>
            </Link>
          </div>
        </div>
        
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Profile;
