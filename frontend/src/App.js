import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import AnalyticsTracker from './components/AnalyticsTracker';
import './components/MobileStyles.css';
import { AudioManager, useAudio, AUDIO_STATES } from './components/AudioManager';

// Lazy load background effects for better initial performance
const TerminalOverlay = lazy(() => import('./components/TerminalOverlay'));
const TerminalBackground = lazy(() => import('./components/TerminalBackground'));
const AdminAnalytics = lazy(() => import('./components/admin/AdminAnalytics'));

// Detect device capabilities
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Portfolio = () => {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [dockMinimized, setDockMinimized] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dockRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuExpanded &&
        dockRef.current &&
        !dockRef.current.contains(event.target) &&
        !event.target.closest('.ai-orb-logo')) {
        setMenuExpanded(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [menuExpanded]);

  // Smart dock behavior on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 200) {
        if (currentScrollY > lastScrollY && !dockMinimized) {
          setDockMinimized(true);
        }
      } else {
        if (dockMinimized) {
          setDockMinimized(false);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, dockMinimized]);

  // Handle AI orb click
  const handleOrbClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuExpanded(prev => !prev);
  };

  // Smooth scroll with menu close
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMenuExpanded(false);

    if (targetId === '#hero' || targetId === '#home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <div className="portfolio-container">
      {/* Floating Holographic Navigation Dock */}
      <nav className={`holo-dock ${dockMinimized ? 'minimized' : ''}`} ref={dockRef}>
        <div className="dock-container">
          {/* Central AI Orb Logo */}
          <button
            className="ai-orb-logo"
            onClick={handleOrbClick}
            type="button"
            aria-label="Toggle navigation menu"
          >
            <div className="orb-core">
              <div className="neural-ring ring-1"></div>
              <div className="neural-ring ring-2"></div>
              <div className="neural-ring ring-3"></div>
              <div className="ai-center">
                <span className="ai-text">MENU</span>
              </div>
            </div>
            <div className="orb-glow"></div>
          </button>

          {/* Floating Navigation Items */}
          <div className={`nav-orbit ${menuExpanded ? 'expanded' : ''}`}>
            <a href="#hero" className="orbit-item" data-label="Home"
              onClick={(e) => handleNavClick(e, '#hero')}>
              <div className="orbit-icon">🏠</div>
              <div className="orbit-trail"></div>
            </a>
            <a href="#about" className="orbit-item" data-label="About"
              onClick={(e) => handleNavClick(e, '#about')}>
              <div className="orbit-icon">👤</div>
              <div className="orbit-trail"></div>
            </a>
            <a href="#projects" className="orbit-item" data-label="Projects"
              onClick={(e) => handleNavClick(e, '#projects')}>
              <div className="orbit-icon">⚡</div>
              <div className="orbit-trail"></div>
            </a>
            <a href="#skills" className="orbit-item" data-label="Skills"
              onClick={(e) => handleNavClick(e, '#skills')}>
              <div className="orbit-icon">🧬</div>
              <div className="orbit-trail"></div>
            </a>
            <a href="#contact" className="orbit-item" data-label="Contact"
              onClick={(e) => handleNavClick(e, '#contact')}>
              <div className="orbit-icon">📡</div>
              <div className="orbit-trail"></div>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-grid">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="grid-cell"></div>
            ))}
          </div>
          <div className="footer-content">
            <p>&copy; 2024 Arun Kumar L. All systems operational.</p>
            <div className="footer-status">
              <span>Status: Online</span>
              <div className="status-indicator active"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AppContent = () => {
  const [showTerminal, setShowTerminal] = useState(!isMobile && !prefersReducedMotion);
  const [terminalComplete, setTerminalComplete] = useState(false);
  const { setAudioState } = useAudio();

  useEffect(() => {
    if (terminalComplete) {
      setAudioState(AUDIO_STATES.HOME);
    }
  }, [terminalComplete, setAudioState]);

  const handleTerminalComplete = React.useCallback(() => {
    setTimeout(() => {
      setTerminalComplete(true);
    }, 100); // Shorter duration for smoother swap
  }, []);

  return (
    <div className="App">
      {/* Terminal Background */}
      {!isMobile && !prefersReducedMotion && (
        <Suspense fallback={null}>
          <TerminalBackground opacity={0.05} speed={0.05} />
        </Suspense>
      )}

      {/* Terminal Boot Overlay */}
      {showTerminal && !terminalComplete && (
        <Suspense fallback={null}>
          <TerminalOverlay
            isVisible={showTerminal}
            autoStart={true}
            onComplete={handleTerminalComplete}
          />
        </Suspense>
      )}

      {/* Main Portfolio Content */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            terminalComplete || !showTerminal ? (
              <>
                <AnalyticsTracker />
                <Portfolio />
              </>
            ) : null
          } />
          <Route path="/admin-analytics" element={
            <Suspense fallback={<div style={{ background: '#0a0a0f', minHeight: '100vh' }}></div>}>
              <AdminAnalytics />
            </Suspense>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const App = () => {
  return (
    <AudioManager>
      <AppContent />
    </AudioManager>
  );
};

export default App;
