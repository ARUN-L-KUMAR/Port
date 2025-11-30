import React, { useState, useRef, useEffect } from 'react';
import { portfolioData } from '../data/mock';
import { User, Code2, Database, Brain, Target, Coffee, Zap, GitBranch, GraduationCap, Award, Languages } from 'lucide-react';

const About = () => {
  const [visibleStats, setVisibleStats] = useState(new Set());
  const [visibleAdditionalStats, setVisibleAdditionalStats] = useState(new Set());
  const [scanlineActive, setScanlineActive] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const aboutRef = useRef(null);
  const { about } = portfolioData;

  // Intersection Observer for stat animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statId = entry.target.dataset.statId;
            if (statId) {
              setTimeout(() => {
                if (statId.startsWith('additional-')) {
                  setVisibleAdditionalStats(prev => new Set([...prev, statId]));
                } else {
                  setVisibleStats(prev => new Set([...prev, statId]));
                }
              }, parseInt(entry.target.dataset.delay) || 0);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const statElements = aboutRef.current?.querySelectorAll('.stat-card, .additional-stat-card');
    statElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Periodic scanning effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScanlineActive(true);
      setTimeout(() => setScanlineActive(false), 3000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getStatIcon = (label) => {
    if (label.includes('Years')) return <Code2 className="stat-icon" />;
    if (label.includes('Projects')) return <GitBranch className="stat-icon" />;
    if (label.includes('Technologies')) return <Database className="stat-icon" />;
    if (label.includes('Certificates')) return <Award className="stat-icon" />;
    return <Target className="stat-icon" />;
  };

  const handleCertificateClick = (statLabel) => {
    if (statLabel.includes('Certificates')) {
      setCertificateModalOpen(true);
    }
  };

  return (
    <section ref={aboutRef} className="about-section" id="about">
      {/* Neural Network Background */}
      <div className="neural-background">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="neural-node" 
            style={{ 
              '--delay': `${i * 200}ms`,
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`
            }}
          ></div>
        ))}
        <div className="neural-connections">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="connection-line" style={{ '--delay': `${i * 300}ms` }}></div>
          ))}
        </div>
      </div>

      {/* Scanning Line Effect */}
      {scanlineActive && <div className="about-scanline"></div>}

      <div className="about-container">
        {/* Header */}
        <div className="section-header">
          <div className="header-terminal">
            <User className="terminal-icon" />
            <span className="terminal-text">user.profile.load()</span>
          </div>
          <h2 className="section-title">
            <span className="title-accent">{'{'}</span>
            About Protocol
            <span className="title-accent">{'}'}</span>
          </h2>
          <div className="title-underline">
            <div className="underline-segment"></div>
            <div className="underline-dot"></div>
            <div className="underline-segment"></div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="about-grid">
          {/* Bio Section */}
          <div className="bio-section">
            <div className="bio-header">
              <div className="profile-indicator">
                <div className="indicator-ring">
                  <div className="ring-pulse"></div>
                </div>
                <Brain className="profile-icon" />
              </div>
              <div className="bio-meta">
                <span className="bio-label">System Analysis</span>
                <span className="bio-status">Complete</span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="system-analysis-tabs">
              <div className="tab-buttons">
                <button
                  className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                  onClick={() => setActiveTab('about')}
                >
                  <User className="tab-icon" />
                  <span>About</span>
                </button>
                <button
                  className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
                  onClick={() => setActiveTab('education')}
                >
                  <GraduationCap className="tab-icon" />
                  <span>Education</span>
                </button>
                <button
                  className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('personal')}
                >
                  <Brain className="tab-icon" />
                  <span>Personal Details</span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'about' && (
                <div className="bio-content">
                  <h3 className="bio-title">Who AM I</h3>
                  <p className="bio-text">
                    {about.description}
                  </p>

                  {/* System Capabilities */}
                  <div className="capabilities-grid">
                    <div className="capability-item">
                      <div className="capability-icon">
                        <Code2 />
                      </div>
                      <span>Full Stack Development</span>
                    </div>
                    <div className="capability-item">
                      <div className="capability-icon">
                        <Database />
                      </div>
                      <span>UI/UX DESIGN</span>
                    </div>
                    <div className="capability-item">
                      <div className="capability-icon">
                        <Brain />
                      </div>
                      <span>AI Integration</span>
                    </div>
                    <div className="capability-item">
                      <div className="capability-icon">
                        <Zap />
                      </div>
                      <span>Blockchain Development</span>
                    </div>
                  </div>

                  {/* Languages Section */}
                  <div className="languages-section">
                    <div className="languages-header">
                      <Languages className="languages-icon" />
                      <span>Languages</span>
                    </div>
                    <div className="languages-content">
                      <span className="language-tag">Tamil</span>
                      <span className="language-tag">English</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="education-content">
                  <h3 className="bio-title">Academic Journey</h3>
                  <div className="education-card">
                    <div className="card-header">
                      <div className="degree-badge">
                        <span className="degree-icon">🎓</span>
                        <span className="degree-level">Undergraduate</span>
                      </div>
                      <div className="timeline-indicator">
                        <span className="timeline-dot"></span>
                      </div>
                    </div>

                    <div className="card-content">
                      <h4 className="degree-title">B.Tech – Computer Science and Engineering</h4>
                      <div className="institution-info">
                        <div className="info-item">
                          <span className="info-icon">🏛️</span>
                          <span className="info-text">University College of Engineering, Kanchipuram</span>
                        </div>
                        <div className="info-item">
                          <span className="info-icon">⏰</span>
                          <span className="info-text">2022 – 2026</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'personal' && (
                <div className="personal-content">
                  <h3 className="bio-title">Personal Details</h3>

                  <div className="personal-info-grid">
                    <div className="info-row">
                      <span className="info-label">Name:</span>
                      <span className="info-value">Arun Kumar L</span>
                    </div>

                    <div className="info-row">
                      <span className="info-label">Education:</span>
                      <span className="info-value">B.Tech Computer Science and Engineering</span>
                    </div>

                    <div className="info-row">
                      <span className="info-label">Location:</span>
                      <span className="info-value">Kanchipuram, Tamil Nadu, India</span>
                    </div>

                    <div className="info-row">
                      <span className="info-label">Phone No:</span>
                      <span className="info-value">+91 8778929845</span>
                    </div>

                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">arunkumar582004@gmail.com</span>
                    </div>

                    <div className="info-row">
                      <span className="info-label">GitHub:</span>
                      <span className="info-value">
                        <a href="https://github.com/ARUN-L-KUMAR" target="_blank" rel="noopener noreferrer" className="info-link">
                          https://github.com/ARUN-L-KUMAR
                        </a>
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="info-label">LinkedIn:</span>
                      <span className="info-value">
                        <a href="https://linkedin.com/in/arun-kumar-l" target="_blank" rel="noopener noreferrer" className="info-link">
                          linkedin.com/in/arun-kumar-l
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="stats-dashboard">
            <div className="dashboard-header">
              <div className="dashboard-title">
                <Target className="dashboard-icon" />
                <span>Performance Metrics</span>
              </div>
              <div className="dashboard-status">
                <div className="status-light active"></div>
                <span>Live Data</span>
              </div>
            </div>

            <div className="stats-grid">
              {about.stats.map((stat, index) => {
                const statId = `stat-${index}`;
                const isVisible = visibleStats.has(statId);
                
                return (
                  <div
                    key={index}
                    className={`stat-card ${isVisible ? 'visible' : ''} ${stat.label.includes('Certificates') ? 'clickable' : ''}`}
                    data-stat-id={statId}
                    data-delay={index * 300}
                    onClick={() => handleCertificateClick(stat.label)}
                  >
                    <div className="stat-header">
                      {getStatIcon(stat.label)}
                      <div className="stat-indicators">
                        <div className="indicator-dot"></div>
                        <div className="indicator-dot"></div>
                        <div className="indicator-dot active"></div>
                      </div>
                    </div>
                    
                    <div className="stat-content">
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>

                    {/* Data Visualization */}
                    <div className="stat-visualization">
                      <div className="viz-bars">
                        {[...Array(8)].map((_, i) => (
                          <div 
                            key={i} 
                            className="viz-bar" 
                            style={{ 
                              '--height': `${Math.random() * 100}%`,
                              '--delay': `${i * 50}ms` 
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Holographic Border */}
                    <div className="stat-border">
                      <div className="border-corner top-left"></div>
                      <div className="border-corner top-right"></div>
                      <div className="border-corner bottom-left"></div>
                      <div className="border-corner bottom-right"></div>
                    </div>

                    {/* Energy Flow */}
                    <div className="energy-flow">
                      <div className="flow-particle"></div>
                      <div className="flow-particle"></div>
                      <div className="flow-particle"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Content Below Stats */}
            <div className="additional-stats-section">
              <div className="stats-header">
                <div className="stats-title">
                  <Target className="stats-icon" />
                  <span>Additional Metrics</span>
                </div>
              </div>

              <div className="additional-stats-grid">
                <div className={`additional-stat-card ${visibleAdditionalStats.has('additional-0') ? 'visible' : ''}`} data-stat-id="additional-0" data-delay="0">
                  <div className="stat-header">
                    <Code2 className="stat-icon" />
                    <div className="stat-indicators">
                      <div className="indicator-dot active"></div>
                    </div>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">95%</div>
                    <div className="stat-label">Code Quality</div>
                  </div>
                </div>

                <div className={`additional-stat-card ${visibleAdditionalStats.has('additional-1') ? 'visible' : ''}`} data-stat-id="additional-1" data-delay="200">
                  <div className="stat-header">
                    <Zap className="stat-icon" />
                    <div className="stat-indicators">
                      <div className="indicator-dot active"></div>
                    </div>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">24/7</div>
                    <div className="stat-label">Availability</div>
                  </div>
                </div>

                <div className={`additional-stat-card ${visibleAdditionalStats.has('additional-2') ? 'visible' : ''}`} data-stat-id="additional-2" data-delay="400">
                  <div className="stat-header">
                    <Brain className="stat-icon" />
                    <div className="stat-indicators">
                      <div className="indicator-dot active"></div>
                    </div>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">AI</div>
                    <div className="stat-label">Powered</div>
                  </div>
                </div>

                <div className={`additional-stat-card ${visibleAdditionalStats.has('additional-3') ? 'visible' : ''}`} data-stat-id="additional-3" data-delay="600">
                  <div className="stat-header">
                    <GitBranch className="stat-icon" />
                    <div className="stat-indicators">
                      <div className="indicator-dot active"></div>
                    </div>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">100%</div>
                    <div className="stat-label">Git Workflow</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* System Information */}
        <div className="system-info">
          <div className="info-terminal">
            <div className="terminal-header">
              <div className="terminal-controls">
                <div className="control-dot red"></div>
                <div className="control-dot yellow"></div>
                <div className="control-dot green"></div>
              </div>
              <span className="terminal-title">system_info.log</span>
            </div>
            <div className="terminal-content">
              <div className="terminal-line">
                <span className="prompt">{'>'}</span>
                <span className="command">System Status:</span>
                <span className="output success">Operational</span>
              </div>
              <div className="terminal-line">
                <span className="prompt">{'>'}</span>
                <span className="command">Neural Network:</span>
                <span className="output success">Active</span>
              </div>
              <div className="terminal-line">
                <span className="prompt">{'>'}</span>
                <span className="command">Learning Mode:</span>
                <span className="output active">Continuous</span>
              </div>
              <div className="terminal-line">
                <span className="prompt">{'>'}</span>
                <span className="command">Next Mission:</span>
                <span className="output">Building the Future</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {certificateModalOpen && (
        <div className="certificate-modal-overlay" onClick={() => setCertificateModalOpen(false)}>
          <div className="certificate-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🏆 Certificates & Achievements</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setCertificateModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              {about.certificates?.map((cert) => (
                <div key={cert.id} className="certificate-item">
                  <div className="cert-header">
                    <div className="cert-icon">{cert.icon}</div>
                    <div className="cert-info">
                      <h3>{cert.title}</h3>
                      <p className="cert-issuer">{cert.issuer}</p>
                      <span className="cert-duration">{cert.duration}</span>
                    </div>
                  </div>
                  
                  <div className="cert-description">
                    <p>{cert.description}</p>
                  </div>
                  
                  <div className="cert-details">
                    <div className="cert-projects">
                      <h4>Projects Built:</h4>
                      <div className="project-tags">
                        {cert.projects?.map((project, index) => (
                          <span key={index} className="project-tag">{project}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="cert-skills">
                      <h4>Skills Gained:</h4>
                      <div className="skill-tags">
                        {cert.skills?.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default About;