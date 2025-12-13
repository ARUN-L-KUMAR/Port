import React, { useState, useRef, useEffect } from 'react';
import { portfolioData } from '../data/mock';
import { ExternalLink, Github, Play, Code, Zap, Database, Monitor, Palette, Link, Calendar, Building, ChevronDown, ChevronUp } from 'lucide-react';

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedInternships, setExpandedInternships] = useState(new Set());
  const [highlightedProject, setHighlightedProject] = useState(null);
  /* State for Load More functionality */
  const [visibleCount, setVisibleCount] = useState(3);
  const PROJECTS_INCREMENT = 3;

  const projectsRef = useRef(null);
  const { projects, internships } = portfolioData;

  const categories = [
    'All',
    'Frontend',
    'Full Stack',
    'AI / ML',
    'Internships',
    'Blockchain / Web3',
    'UI/UX Design'
  ];

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

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PROJECTS_INCREMENT);
  }, [selectedCategory, searchQuery]);

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

  // Category derivation based on technologies/title/description
  const deriveProjectCategories = (project) => {
    const tech = (project.technologies || []).map(t => t.toLowerCase());
    const hay = `${project.title} ${project.description}`.toLowerCase();
    const set = new Set();

    // Specific project categorization based on user's grouping
    if (project.title === 'Netflix Clone' || project.title === 'Weather Forecasting App' ||
      project.title === 'Text to Speech App' || project.title === 'Frontend Mini Projects Collection' ||
      project.title === 'Online-Quiz-Application' || project.title === 'Smart-Study-Planner' ||
      project.title === 'Personal_CRM' || project.title === 'movie-review-platform') {
      set.add('Frontend');
    }
    if (project.title === 'Java With Spring Boot' || project.title === 'Codealpha_Social_Media' ||
      project.title === 'Codealpha_Communication_app' || project.title === 'Codealpha_Project_Management' ||
      project.title === 'Codealpha_Ecommerce_store' || project.title === 'Market') {
      set.add('Full Stack');
    }
    if (project.title === 'Data Science & Analysis Basics' || project.title === 'Emotion_Detect Public' ||
      project.title === 'Crops Disease Detection') {
      set.add('AI / ML');
    }
    if (project.title === 'UI & UX Design' || project.title === 'Agritech App UI') {
      set.add('UI/UX Design');
    }
    if (project.title === 'CommunityCoin DApp' || project.title === 'Artisanchain' || project.title === 'EventDapp') {
      set.add('Blockchain / Web3');
    }
    if (project.title === 'AICTE – Sustainable Agriculture' || project.title === 'AICTE – Web Development' ||
      project.title === 'CodeAlpha Internship' || tech.includes('#internship')) {
      set.add('Internships');
    }

    // Fallback to technology-based categorization if not specifically matched
    if (set.size === 0) {
      const isFrontend = tech.some(t => ['react', 'html', 'css', 'javascript', 'tailwind'].includes(t));
      const hasBackend = tech.some(t => ['node.js', 'node', 'express.js', 'express', 'mongodb', 'mysql', 'python', 'java', 'spring boot'].includes(t));
      if (isFrontend && hasBackend) set.add('Full Stack');
      else if (isFrontend) set.add('Frontend');

      if (tech.some(t => ['solidity', 'ethers.js', 'hardhat', 'web3', 'ethereum'].includes(t)) || hay.includes('dapp')) set.add('Blockchain / Web3');
      if (tech.some(t => ['openai', 'ai', 'tensorflow', 'machine learning'].includes(t)) || hay.includes('ai')) set.add('AI / ML');
      if (tech.some(t => ['figma', 'ui design', 'ui/ux', 'design'].includes(t)) || /\bui\b|\bux\b/.test(hay)) set.add('UI/UX Design');
      if (hay.includes('internship') || hay.includes('tripxplo') || hay.includes('codealpha')) set.add('Internships');

      if (set.size === 0) set.add('Frontend');
    }

    return Array.from(set);
  };

  const matchesSearch = (project) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(q) ||
      (project.description || '').toLowerCase().includes(q) ||
      (project.technologies || []).join(' ').toLowerCase().includes(q)
    );
  };

  const inSelectedCategory = (project) => {
    if (selectedCategory === 'All') return true;
    const cats = deriveProjectCategories(project);
    return cats.includes(selectedCategory);
  };

  const filteredProjects = selectedCategory === 'Internships'
    ? internships.filter(internship => matchesSearch({ title: internship.company, description: internship.projects.map(p => p.title).join(' ') }))
    : projects.filter(p => inSelectedCategory(p) && matchesSearch(p));

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMoreProjects = visibleCount < filteredProjects.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + PROJECTS_INCREMENT);
  };

  const toggleInternshipExpansion = (internshipId) => {
    setExpandedInternships(prev => {
      const newSet = new Set(prev);
      if (newSet.has(internshipId)) {
        newSet.delete(internshipId);
      } else {
        newSet.add(internshipId);
      }
      return newSet;
    });
  };

  const navigateToProject = (projectTitle) => {
    // Find the corresponding project in the projects array
    const project = projects.find(p => p.title === projectTitle);
    if (project) {
      // Switch to "All" category to show all projects
      setSelectedCategory('All');
      // Highlight the specific project
      setHighlightedProject(project.id);
      // Scroll to the project after a brief delay to allow re-render
      setTimeout(() => {
        const projectElement = document.getElementById(`project-${project.id}`);
        if (projectElement) {
          projectElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Remove highlight after animation
          setTimeout(() => setHighlightedProject(null), 3000);
        }
      }, 100);
    }
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
            What I Done(Projects)
            <span className="title-bracket">{'/>'}</span>
          </h2>
          <p className="section-subtitle">Building across Frontend, Full Stack, Web3, AI, and Design</p>
        </div>

        {/* Filter Bar */}
        <div className="projects-filter-bar">
          <div className="filter-tabs" role="tablist" aria-label="Project categories">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={selectedCategory === cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="filter-search">
            <input
              type="text"
              placeholder="Search projects or tech (e.g., React, Solidity, OpenAI)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search projects"
              className="filter-search-input"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {visibleProjects.map((item, index) => {
            const isInternship = selectedCategory === 'Internships';
            const project = isInternship ? null : item;
            const internship = isInternship ? item : null;

            return (
              <div
                key={item.id}
                id={`project-${item.id}`}
                className={`project-card ${hoveredProject === item.id ? 'hovered' : ''} ${highlightedProject === item.id ? 'highlighted' : ''} filter-animate`}
                onMouseEnter={() => setHoveredProject(item.id)}
                onMouseLeave={() => setHoveredProject(null)}
                style={{ '--delay': `${index * 100}ms` }}
              >
                {/* Card Glow Effect */}
                <div className="card-glow"></div>

                {/* Status Badge - Only for projects, not internships */}
                {!isInternship && (
                  <div className="project-status" style={{ '--status-color': getStatusColor(project.status) }}>
                    {getStatusIcon(project.status)}
                    <span>{project.status}</span>
                  </div>
                )}

                {/* Badge for Internships */}
                {isInternship && internship.badge && (
                  <div className="project-status internship-badge">
                    <span>{internship.badge}</span>
                  </div>
                )}

                {/* Project Image or Internship Image */}
                <div className="project-image-container">
                  <img
                    src={isInternship ? internship.image : project.image}
                    alt={isInternship ? internship.company : project.title}
                    className="project-image"
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <div className="overlay-grid"></div>
                  </div>
                </div>

                {/* Project Content or Internship Content */}
                <div className="project-content">
                  {isInternship ? (
                    <>
                      {/* Internship Header */}
                      <div className="internship-header">
                        <div className="internship-company">
                          <Building className="company-icon" />
                          <span>{internship.company}</span>
                        </div>
                        <div className="internship-duration">
                          <Calendar className="duration-icon" />
                          <span>{internship.duration}</span>
                        </div>
                      </div>

                      {/* Expandable Projects Section */}
                      <div className="internship-projects">
                        <div
                          className="projects-toggle-header"
                          onClick={() => toggleInternshipExpansion(internship.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <h4 className="projects-title">Projects Completed:</h4>
                          {expandedInternships.has(internship.id) ? (
                            <ChevronUp className="toggle-icon" />
                          ) : (
                            <ChevronDown className="toggle-icon" />
                          )}
                        </div>

                        {expandedInternships.has(internship.id) && (
                          <div className="projects-expanded-content">
                            {internship.projects.map((proj, projIndex) => (
                              <div key={projIndex} className="project-item-expanded">
                                <div className="project-details">
                                  <div className="project-header">
                                    <h5
                                      className="project-title-expanded clickable"
                                      onClick={() => navigateToProject(proj.title)}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      {proj.title}
                                    </h5>
                                    {proj.status && (
                                      <div className="project-status-badge" style={{ '--status-color': getStatusColor(proj.status) }}>
                                        <span>{proj.status}</span>
                                      </div>
                                    )}
                                  </div>
                                  {proj.description && (
                                    <p className="project-description-expanded">{proj.description}</p>
                                  )}
                                  {proj.technologies && proj.technologies.length > 0 && (
                                    <div className="project-technologies-expanded">
                                      {proj.technologies.map((tech, techIndex) => (
                                        <span
                                          key={techIndex}
                                          className="tech-tag-expanded"
                                          style={{ '--tech-delay': `${techIndex * 50}ms` }}
                                        >
                                          {tech}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  <div className="project-actions-expanded">
                                    {proj.demoUrl && (
                                      <a
                                        href={proj.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="action-btn primary project-demo-btn"
                                      >
                                        <ExternalLink className="btn-icon" />
                                        <span>Live Demo</span>
                                        <div className="btn-glow"></div>
                                      </a>
                                    )}
                                    {proj.githubUrl && (
                                      <a
                                        href={proj.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="action-btn secondary project-github-btn"
                                      >
                                        <Github className="btn-icon" />
                                        <span>Source Code</span>
                                        <div className="btn-glow"></div>
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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
            );
          })}
        </div>

        {/* Load More Button */}
        {hasMoreProjects && (
          <div className="load-more-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button
              className="action-btn primary load-more-btn"
              onClick={handleLoadMore}
              style={{
                padding: '0.8rem 2rem',
                fontSize: '1rem',
                letterSpacing: '1px',
                cursor: 'pointer'
              }}
            >
              <ChevronDown className="btn-icon" />
              <span>LOAD MORE DATA</span>
              <div className="btn-glow"></div>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;