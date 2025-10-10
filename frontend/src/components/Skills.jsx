import React, { useState, useEffect, useRef } from 'react';
import { portfolioData } from '../data/mock';
import { Code, Database, Brain, Zap, ChevronRight, Activity, Cloud, Leaf, FileCode, Palette, GitBranch, Landmark, Send, Link2 } from 'lucide-react';

const Skills = () => {
  const [visibleSkills, setVisibleSkills] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState(0);
  const skillsRef = useRef(null);
  const { skills } = portfolioData;

  // Intersection Observer for skill animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const skillId = entry.target.dataset.skillId;
            if (skillId) {
              setTimeout(() => {
                setVisibleSkills(prev => new Set([...prev, skillId]));
              }, parseInt(entry.target.dataset.delay) || 0);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const skillElements = skillsRef.current?.querySelectorAll('.skill-item');
    skillElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Auto-rotate categories
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory(prev => (prev + 1) % skills.categories.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [skills.categories.length]);

  const getCategoryIcon = (title) => {
    if (title.includes('Frontend')) return <Code className="category-icon" />;
    if (title.includes('Backend')) return <Database className="category-icon" />;
    if (title.includes('Blockchain')) return <Link2 className="category-icon" />;
    if (title.includes('Tools')) return <GitBranch className="category-icon" />;
    if (title.includes('AI')) return <Brain className="category-icon" />;
    if (title.includes('Data')) return <Landmark className="category-icon" />;
    return <Zap className="category-icon" />;
  };

  const getSkillColor = (level) => {
    if (level >= 90) return '#00FFD1';
    if (level >= 80) return '#00D4FF';
    if (level >= 70) return '#6FD2C0';
    return '#4D4D4D';
  };

  return (
    <section ref={skillsRef} className="skills-section" id="skills">
      {/* Background Matrix */}
      <div className="matrix-background">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="matrix-line" style={{ '--delay': `${i * 100}ms` }}></div>
        ))}
      </div>

      <div className="skills-container">
        {/* Header */}
        <div className="section-header">
          <div className="header-terminal">
            <Activity className="terminal-icon" />
            <span className="terminal-text">system.skills.analyze()</span>
          </div>
          <h2 className="section-title">
            Technical Specifications
          </h2>
          <p className="section-subtitle">Capabilities and proficiency levels</p>
        </div>

        {/* Skills Interface */}
        <div className="skills-interface">
          {/* Category Navigation */}
          <div className="category-nav">
            {skills.categories.map((category, index) => (
              <button
                key={index}
                className={`category-btn ${activeCategory === index ? 'active' : ''}`}
                onClick={() => setActiveCategory(index)}
              >
                {getCategoryIcon(category.title)}
                <span className="category-title">{category.title}</span>
                <ChevronRight className="category-arrow" />
                <div className="category-glow"></div>
              </button>
            ))}
          </div>

          {/* Skills Display */}
          <div className="skills-display">
            <div className="display-header">
              <div className="display-title">
                {getCategoryIcon(skills.categories[activeCategory].title)}
                <span>{skills.categories[activeCategory].title}</span>
              </div>
              <div className="display-status">
                <div className="status-indicator active"></div>
                <span>Online</span>
              </div>
            </div>

            <div className="skills-grid">
              {skills.categories[activeCategory].skills.map((skill, skillIndex) => {
                const skillId = `${activeCategory}-${skillIndex}`;
                const isVisible = visibleSkills.has(skillId);
                
                return (
                  <div
                    key={skillIndex}
                    className={`skill-item ${isVisible ? 'visible' : ''}`}
                    data-skill-id={skillId}
                    data-delay={skillIndex * 200}
                  >
                    {/* Skill Header */}
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span 
                        className="skill-level"
                        style={{ color: getSkillColor(skill.level) }}
                      >
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="skill-progress-container">
                      <div className="skill-progress-bg">
                        <div 
                          className="skill-progress-fill"
                          style={{ 
                            '--progress': `${skill.level}%`,
                            '--color': getSkillColor(skill.level)
                          }}
                        ></div>
                        <div className="progress-scanner"></div>
                      </div>
                    </div>

                    {/* Holographic Elements */}
                    <div className="skill-hologram">
                      <div className="hologram-dots">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="hologram-dot" style={{ '--delay': `${i * 100}ms` }}></div>
                        ))}
                      </div>
                    </div>

                    {/* Data Visualization */}
                    <div className="skill-data">
                      <div className="data-bars">
                        {[...Array(Math.floor(skill.level / 20))].map((_, i) => (
                          <div key={i} className="data-bar" style={{ '--delay': `${i * 50}ms` }}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* System Stats */}
        <div className="system-stats">
          <div className="stat-item">
            <div className="stat-icon">
              <Code />
            </div>
            <div className="stat-content">
              <span className="stat-value">20+</span>
              <span className="stat-label">Technologies</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <Database />
            </div>
            <div className="stat-content">
              <span className="stat-value">2+</span>
              <span className="stat-label">Years Experience</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <Brain />
            </div>
            <div className="stat-content">
              <span className="stat-value">25+</span>
              <span className="stat-label">Projects</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;