import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiLinkedin, FiTwitter, FiGithub, FiCheck } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../StyleSheets/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new message object
      const newMessage = {
        id: Date.now(), // Use timestamp as unique ID
        sender: formData.name,
        senderEmail: formData.email,
        subject: formData.subject,
        content: formData.message,
        timestamp: new Date().toISOString(),
        isRead: false,
        isStarred: false,
        category: 'work', // Default category for contact form messages
        priority: 'medium',
        attachments: []
      };

      // Get existing messages from localStorage
      const existingMessages = localStorage.getItem('adminMessages');
      let messages = [];
      
      if (existingMessages) {
        try {
          messages = JSON.parse(existingMessages);
        } catch (error) {
          console.error('Error loading existing messages:', error);
        }
      }

      // Add new message at the beginning
      messages.unshift(newMessage);

      // Save back to localStorage
      localStorage.setItem('adminMessages', JSON.stringify(messages));

      // Show success message
      toast.success('Message sent successfully! It will appear in the admin Messages panel.', {
        position: 'top-right',
        autoClose: 5000
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Simulate sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section" style={{ backgroundColor: '#f7f7f7' }}>
      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p className="contact-intro">
              Have questions or want to discuss how TeamBuddy can transform your workforce management? 
              Our team is here to help you every step of the way.
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <FiMail />
                </div>
                <div>
                  <h4>Email Us</h4>
                  <p>support@teambuddy.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <FiPhone />
                </div>
                <div>
                  <h4>Call Us</h4>
                  <p>+1 (555) 123-4567</p>
                  <p>Mon - Fri, 9am - 6pm EST</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <FiMapPin />
                </div>
                <div>
                  <h4>Visit Us</h4>
                  <p>Vishal Nagar</p>
                  <p>Ludhiana, Punjab 141001, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <div className="contact-form-wrapper">
              <h3>Send us a Message</h3>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Your Name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="subject"
                    placeholder="Subject" 
                    value={formData.subject}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <textarea 
                    name="message"
                    placeholder="Your Message" 
                    rows="5" 
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="btn-spinner"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="btn-icon" /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;