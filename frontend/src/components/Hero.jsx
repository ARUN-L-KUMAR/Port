import React, { useEffect, useRef, useState } from 'react';
import { portfolioData } from '../data/mock';
import Spline from '@splinetool/react-spline';
import { ArrowDown, Terminal, Cpu, Zap } from 'lucide-react';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const heroRef = useRef(null);
  const cursorTrailRef = useRef(null);

  const { hero } = portfolioData;
  const fullText = hero.name;

  // Typewriter effect for name
  useEffect(() => {
    if (currentIndex < fullText.length && isTyping) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 150);
      return () => clearTimeout(timeout);
    } else if (currentIndex === fullText.length) {
      setIsTyping(false);
    }
  }, [currentIndex, isTyping, fullText]);

  // Glowing cursor trail effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorTrailRef.current) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        document.body.appendChild(trail);

        setTimeout(() => {
          if (document.body.contains(trail)) {
            document.body.removeChild(trail);
          }
        }, 1000);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scanning line animation
  useEffect(() => {
    const createScanLine = () => {
      const scanLine = document.createElement('div');
      scanLine.className = 'scanning-line';
      if (heroRef.current) {
        heroRef.current.appendChild(scanLine);
        setTimeout(() => {
          if (heroRef.current && heroRef.current.contains(scanLine)) {
            heroRef.current.removeChild(scanLine);
          }
        }, 3000);
      }
    };

    const interval = setInterval(createScanLine, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={heroRef} className="hero-container">
      {/* Background Grid */}
      <div className="holographic-grid"></div>
      
      {/* 3D Spline Animation */}
      <div className="spline-container">
        <Spline scene="https://prod.spline.design/NbVmy6DPLhY-5Lvg/scene.splinecode" />
      </div>

      {/* Main Content */}
      <div className="hero-content">
        <div className="hero-left">
          {/* Terminal Header */}
          <div className="terminal-header">
            <Terminal className="terminal-icon" />
            <span className="terminal-path">~/portfolio/init</span>
          </div>

          {/* Name Display */}
          <div className="name-container">
            <h1 className="hero-name">
              {displayText}
              <span className="cursor-blink">|</span>
            </h1>
          </div>

          {/* Role and Subtitle */}
          <div className="role-container">
            <div className="role-badge">
              <Cpu className="role-icon" />
              <span>{hero.role}</span>
            </div>
            <h2 className="hero-subtitle">{hero.subtitle}</h2>
          </div>

          {/* Tagline */}
          <p className="hero-tagline">{hero.tagline}</p>

          {/* CTA Buttons */}
          <div className="hero-buttons">
            <button className="btn-primary robotic-hover">
              <span>Initialize Projects</span>
              <Zap className="btn-icon" />
            </button>
            <button className="btn-secondary robotic-hover">
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