import React, { useState, useRef, useEffect } from 'react';
import { portfolioData } from '../data/mock';
import { User, Code2, Database, Brain, Target, Coffee, Zap, GitBranch, GraduationCap, Award, Languages } from 'lucide-react';

const About = () => {
  const [visibleStats, setVisibleStats] = useState(new Set());
  const [scanlineActive, setScanlineActive] = useState(false);
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
                setVisibleStats(prev => new Set([...prev, statId]));
              }, parseInt(entry.target.dataset.delay) || 0);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const statElements = aboutRef.current?.querySelectorAll('.stat-card');
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

            <div className="bio-content">
              <p className="bio-text">
                {about.description}
              </p>
              
              {/* System Capabilities */}
              <div className="capabilities-grid">
                <div className="capability-item">
                  <div className="capability-icon">
                    <Code2 />
                  </div>
                  <span>Frontend Development</span>
                </div>
                <div className="capability-item">
                  <div className="capability-icon">
                    <Database />
                  </div>
                  <span>Full Stack Learning</span>
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

              {/* Education Section */}
              <div className="education-section">
                <div className="education-header">
                  <GraduationCap className="education-icon" />
                  <span>Education & Certifications</span>
                </div>
                <div className="education-content">
                  <div className="education-item">
                    <div className="edu-title">B.Tech – Computer Science and Engineering</div>
                    <div className="edu-institution">University College of Engineering, Kanchipuram</div>
                    <div className="edu-year">2022 – 2026</div>
                    <div className="edu-details">Relevant Courses: Data Structures, Algorithms, DBMS, AIML, UI/UX Design, BLOCKCHAIN</div>
                  </div>
                  <div className="certifications">
                    <div className="cert-item">
                      <div className="cert-dot"></div>
                      <span>🏆 Full Stack Web Development Internship – Novitech Pvt Ltd (30 Days)</span>
                      <p className="cert-description">Worked on basic web apps and mini-projects using HTML, CSS, JavaScript, and React.js. Gained hands-on experience in responsive UI design, component-based development, and Git-based version control. Projects included: ToDo App, Weather App, Text to Speech App, and a Netflix & E-Commerce Interface Clone.</p>
                    </div>
                    <div className="cert-item">
                      <div className="cert-dot"></div>
                      <span>🏆 Flutter Development Webinar Certificate (3 Days)</span>
                      <p className="cert-description">Attended an introductory webinar focused on cross-platform mobile app development using Flutter. Learned about Dart syntax, widget-based UI structure, and building simple interfaces for both Android and iOS platforms. Projects included: ToDo App, Calculator, and a Swiggy Interface Clone.</p>
                    </div>
                    <div className="cert-item">
                      <div className="cert-dot"></div>
                      <span>🏆 Introduction to Machine Learning - Certified by IIT Madras (NPTEL)</span>
                      <p className="cert-description">Successfully completed the Introduction to Machine Learning course offered by NPTEL, IIT Madras. Gained strong foundational knowledge in ML concepts like supervised/unsupervised learning, SVM, k-NN, Naive Bayes, and evaluation metrics through weekly assignments and lectures by IIT faculty.</p>
                    </div>
                  </div>
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
                    className={`stat-card ${isVisible ? 'visible' : ''}`}
                    data-stat-id={statId}
                    data-delay={index * 300}
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
    </section>
  );
};

export default About;