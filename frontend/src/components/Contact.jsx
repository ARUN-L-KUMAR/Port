import React, { useState, useRef, useEffect } from 'react';
import { portfolioData } from '../data/mock';
import { 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Terminal,
  Zap,
  Shield,
  Wifi,
  Download
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionComplete, setTransmissionComplete] = useState(false);
  const contactRef = useRef(null);
  const { contact } = portfolioData;

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsTransmitting(true);
    
    // Simulate API call with robotic delay
    setTimeout(() => {
      setIsTransmitting(false);
      setTransmissionComplete(true);
      
      // Reset form after success animation
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTransmissionComplete(false);
      }, 3000);
    }, 2000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Quantum interference effect
  useEffect(() => {
    const createInterference = () => {
      const interference = document.createElement('div');
      interference.className = 'quantum-interference';
      interference.style.left = Math.random() * 100 + '%';
      interference.style.top = Math.random() * 100 + '%';
      
      if (contactRef.current) {
        contactRef.current.appendChild(interference);
        setTimeout(() => {
          if (contactRef.current && contactRef.current.contains(interference)) {
            contactRef.current.removeChild(interference);
          }
        }, 2000);
      }
    };

    const interval = setInterval(createInterference, 3000);
    return () => clearInterval(interval);
  }, []);

  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'github': return <Github className="social-icon" />;
      case 'linkedin': return <Linkedin className="social-icon" />;
      case 'portfolio': return <Mail className="social-icon" />;
      default: return <Mail className="social-icon" />;
    }
  };

  return (
    <section ref={contactRef} className="contact-section" id="contact">
      {/* Quantum Field Background */}
      <div className="quantum-field">
        {[...Array(100)].map((_, i) => (
          <div 
            key={i} 
            className="quantum-particle" 
            style={{ 
              '--delay': `${i * 50}ms`,
              '--duration': `${3 + Math.random() * 4}s`,
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`
            }}
          ></div>
        ))}
      </div>

      <div className="contact-container">
        {/* Header */}
        <div className="section-header">
          <div className="header-terminal">
            <Terminal className="terminal-icon" />
            <span className="terminal-text">contact.initialize()</span>
          </div>
          <h2 className="section-title">
            {contact.title}
          </h2>
          <p className="section-subtitle">{contact.subtitle}</p>
          
          {/* Connection Status */}
          <div className="connection-status">
            <div className="status-indicator">
              <Wifi className="status-icon" />
              <span>Secure Connection Established</span>
            </div>
            <div className="encryption-level">
              <Shield className="encryption-icon" />
              <span>Quantum Encryption: Active</span>
            </div>
          </div>
        </div>

        {/* Main Contact Grid */}
        <div className="contact-grid">
          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="form-header">
              <div className="form-title">
                <Send className="form-icon" />
                <span>Transmission Interface</span>
              </div>
              <div className="form-status">
                <div className={`status-light ${isTransmitting ? 'transmitting' : transmissionComplete ? 'success' : 'ready'}`}></div>
                <span>
                  {isTransmitting ? 'Transmitting...' : 
                   transmissionComplete ? 'Transmission Complete' : 'Ready to Send'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="name" className="input-label">
                    <span className="label-text">Identity</span>
                    <span className="label-required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your designation"
                      required
                    />
                    <div className="input-glow"></div>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="email" className="input-label">
                    <span className="label-text">Communication Channel</span>
                    <span className="label-required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="your.email@domain.com"
                      required
                    />
                    <div className="input-glow"></div>
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="subject" className="input-label">
                  <span className="label-text">Mission Subject</span>
                  <span className="label-required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Project collaboration, consultancy, or general inquiry"
                    required
                  />
                  <div className="input-glow"></div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="message" className="input-label">
                  <span className="label-text">Data Payload</span>
                  <span className="label-required">*</span>
                </label>
                <div className="input-wrapper">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Transmit your message here..."
                    rows="6"
                    required
                  ></textarea>
                  <div className="input-glow"></div>
                </div>
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isTransmitting ? 'transmitting' : transmissionComplete ? 'success' : ''}`}
                disabled={isTransmitting}
              >
                {isTransmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Transmitting Data...</span>
                  </>
                ) : transmissionComplete ? (
                  <>
                    <Zap className="btn-icon" />
                    <span>Transmission Successful</span>
                  </>
                ) : (
                  <>
                    <Send className="btn-icon" />
                    <span>Initialize Transmission</span>
                  </>
                )}
                <div className="btn-scanner"></div>
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="contact-info-section">
            <div className="info-header">
              <div className="info-title">
                <Mail className="info-icon" />
                <span>Direct Communication Channels</span>
              </div>
            </div>

            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">
                  <Mail />
                </div>
                <div className="method-content">
                  <span className="method-label">Email Protocol</span>
                  <span className="method-value">{contact.email}</span>
                </div>
                <div className="method-status">
                  <div className="status-dot active"></div>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">
                  <Phone />
                </div>
                <div className="method-content">
                  <span className="method-label">Voice Communication</span>
                  <span className="method-value">{contact.phone}</span>
                </div>
                <div className="method-status">
                  <div className="status-dot active"></div>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">
                  <MapPin />
                </div>
                <div className="method-content">
                  <span className="method-label">Physical Location</span>
                  <span className="method-value">{contact.location}</span>
                </div>
                <div className="method-status">
                  <div className="status-dot active"></div>
                </div>
              </div>
            </div>

            {/* Social Networks */}
            <div className="social-networks">
              <div className="networks-header">
                <span className="networks-title">Social Network Interfaces</span>
              </div>
              <div className="networks-grid">
                {contact.social.map((social, index) => (
                  <a 
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    {getSocialIcon(social.platform)}
                    <span className="social-label">{social.platform}</span>
                    <div className="social-glow"></div>
                  </a>
                ))}
              </div>
            </div>

            {/* Resume Download */}
            <div className="resume-download">
              <a 
                href="/Resume.pdf" 
                download="Arun_Kumar_Resume.pdf"
                className="download-btn"
              >
                <Download className="download-icon" />
                <span>Download Resume</span>
                <div className="btn-glow"></div>
              </a>
            </div>

            {/* System Status */}
            <div className="system-status">
              <div className="status-header">
                <span className="status-title">System Status</span>
              </div>
              <div className="status-items">
                <div className="status-item">
                  <div className="item-indicator online"></div>
                  <span>Response Time: &lt; 24hrs</span>
                </div>
                <div className="status-item">
                  <div className="item-indicator active"></div>
                  <span>Availability: Open for Projects</span>
                </div>
                <div className="status-item">
                  <div className="item-indicator success"></div>
                  <span>Security: Quantum Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;