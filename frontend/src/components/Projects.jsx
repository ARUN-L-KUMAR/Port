import React, { useState, useRef, useEffect } from 'react';
import { portfolioData } from '../data/mock';
import { ExternalLink, Github, Play, Code, Zap, Database, Monitor, Palette, Link } from 'lucide-react';

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const projectsRef = useRef(null);
  const { projects } = portfolioData;

  // Mouse tracking for holographic effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (projectsRef.current) {
        const rect = projectsRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    const projectsElement = projectsRef.current;
    if (projectsElement) {
      projectsElement.addEventListener('mousemove', handleMouseMove);
      return () => projectsElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Live': return <Zap className="status-icon live" />;
      case 'Development': return <Code className="status-icon dev" />;
      case 'Concept': return <Database className="status-icon concept" />;
      default: return <Play className="status-icon" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Live': return '#00FFD1';
      case 'Development': return '#FFD700';
      case 'Concept': return '#FF6B9D';
      default: return '#6FD2C0';
    }
  };

  const getCategoryIcon = (title) => {
    if (title.includes('Frontend')) return <Monitor className="category-icon" />;
    if (title.includes('UI') || title.includes('UX')) return <Palette className="category-icon" />;
    if (title.includes('Blockchain')) return <Link className="category-icon" />;
    if (title.includes('Data')) return <Database className="category-icon" />;
    return <Code className="category-icon" />;
  };

  return (
    <section ref={projectsRef} className="projects-section" id="projects">
      {/* Background Pattern */}
      <div className="section-bg-pattern"></div>
      
      {/* Holographic Cursor Follower */}
      <div 
        className="holographic-cursor"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`
        }}
      ></div>

      <div className="projects-container">
        {/* Header */}
        <div className="section-header">
          <div className="header-line"></div>
          <h2 className="section-title">
            <span className="title-bracket">{'<'}</span>
            Projects Archive
            <span className="title-bracket">{'/>'}</span>
          </h2>
          <p className="section-subtitle">Exploring the boundaries of technology</p>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className={`project-card ${hoveredProject === project.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              style={{ '--delay': `${index * 100}ms` }}
            >
              {/* Card Glow Effect */}
              <div className="card-glow"></div>
              
              {/* Status Badge */}
              <div className="project-status" style={{ '--status-color': getStatusColor(project.status) }}>
                {getStatusIcon(project.status)}
                <span>{project.status}</span>
              </div>

              {/* Project Image */}
              <div className="project-image-container">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="project-image"
                  loading="lazy"
                />
                <div className="image-overlay">
                  <div className="overlay-grid"></div>
                </div>
              </div>

              {/* Project Content */}
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>

                {/* Technologies */}
                <div className="project-technologies">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex} 
                      className="tech-tag"
                      style={{ '--tech-delay': `${techIndex * 50}ms` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="project-actions">
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="action-btn primary">
                      <ExternalLink className="btn-icon" />
                      <span>Live Demo</span>
                      <div className="btn-glow"></div>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="action-btn secondary">
                      <Github className="btn-icon" />
                      <span>Source</span>
                      <div className="btn-glow"></div>
                    </a>
                  )}
                </div>
              </div>

              {/* Mechanical Elements */}
              <div className="mechanical-corners">
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>
              </div>

              {/* Data Stream */}
              <div className="data-stream">
                <div className="stream-line"></div>
                <div className="stream-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading More Indicator */}
        <div className="load-more-indicator">
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
          <span className="loading-text">Analyzing more projects...</span>
        </div>
      </div>
    </section>
  );
};

export default Projects;