import React, { useEffect, useRef, useState } from 'react';
import { portfolioData } from '../data/mock';
import { ArrowDown, Terminal, Cpu, Zap } from 'lucide-react';
import HoloBadge from './HoloBadge';

// Detect if should skip heavy animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const heroRef = useRef(null);

  const { hero } = portfolioData;
  const fullText = hero.name;

  // Typewriter effect for name
  useEffect(() => {
    if (currentIndex < fullText.length && isTyping) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, prefersReducedMotion ? 50 : 120);
      return () => clearTimeout(timeout);
    } else if (currentIndex === fullText.length) {
      setIsTyping(false);
    }
  }, [currentIndex, isTyping, fullText]);

  // Handle button clicks - scroll to sections
  const handleProjectsClick = () => {
    const projectsSection = document.querySelector('#projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContactClick = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={heroRef} className="hero-container" id="hero">
      {/* Background Grid - CSS only, lightweight */}
      <div className="holographic-grid"></div>

      {/* Holographic Badge - Desktop: right side, Mobile: above content */}
      <div className="holo-badge-wrapper desktop-only">
        <HoloBadge isLarge={true} />
      </div>

      {/* Main Content */}
      <div className="hero-content">
        <div className="hero-left">
          {/* Terminal Header */}
          <div className="terminal-header">
            <Terminal className="terminal-icon" />
            <span className="terminal-path">~/portfolio/init</span>
          </div>

          {/* Mobile Badge - centered, shows identity */}
          <div className="holo-badge-wrapper mobile-only">
            <HoloBadge isLarge={false} />
          </div>

          {/* Name Display - hidden on mobile (shown in badge) */}
          <div className="name-container desktop-only">
            <h1 className="hero-name">
              {displayText}
              <span className="cursor-blink">|</span>
            </h1>
          </div>

          {/* Role and Subtitle - hidden on mobile (shown in badge) */}
          <div className="role-container desktop-only">
            <div className="role-badge">
              <Cpu className="role-icon" />
              <span>{hero.role}</span>
            </div>
            <h2 className="hero-subtitle">{hero.subtitle}</h2>
          </div>

          {/* Tagline */}
          <p className="hero-tagline">{hero.tagline}</p>

          {/* Code snippet decoration for mobile - animated cycling */}
          <div className="mobile-code-decoration mobile-only">
            <div className="mobile-code-lines">
              <span className="code-snippet mobile-line-1">
                <span className="code-prop">skills</span><span className="code-operator">:</span> <span className="code-string">"∞"</span>
              </span>
              <span className="code-snippet mobile-line-2">
                <span className="code-prop">passion</span><span className="code-operator">:</span> <span className="code-bool">true</span>
              </span>
              <span className="code-snippet mobile-line-3">
                <span className="code-prop">coffee</span><span className="code-operator">:</span> <span className="code-number">999</span>
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hero-buttons">
            <button
              className="btn-primary robotic-hover"
              onClick={handleProjectsClick}
              type="button"
            >
              <span>Initialize Projects</span>
              <Zap className="btn-icon" />
            </button>
            <button
              className="btn-secondary robotic-hover"
              onClick={handleContactClick}
              type="button"
            >
              <span>Access Contact</span>
              <ArrowDown className="btn-icon" />
            </button>
          </div>

          {/* Status Indicators */}
          <div className="status-indicators">
            <div className="status-item">
              <div className="status-dot online"></div>
              <span>Available for Internships</span>
            </div>
            <div className="status-item">
              <div className="status-dot active"></div>
              <span>Open to Collaborations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-cube cube-1"></div>
        <div className="floating-cube cube-2"></div>
        <div className="floating-cube cube-3"></div>
      </div>
    </div>
  );
};

export default Hero;