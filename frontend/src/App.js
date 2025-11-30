import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import './components/MobileStyles.css'; // Mobile-optimized styles

// Lazy load heavy components to improve initial load
const TerminalOverlay = lazy(() => import('./components/TerminalOverlay'));
const TerminalBackground = lazy(() => import('./components/TerminalBackground'));

// Detect if user prefers reduced motion or is on mobile
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isSlowConnection = navigator.connection?.effectiveType === '2g' || navigator.connection?.effectiveType === 'slow-2g';

// Skip heavy animations on mobile/slow devices
const shouldSkipAnimations = prefersReducedMotion || isMobile || isSlowConnection;

const App = () => {
  const [isLoading, setIsLoading] = useState(!shouldSkipAnimations);
  const [showTerminal, setShowTerminal] = useState(false);
  const [enableEffects, setEnableEffects] = useState(!shouldSkipAnimations);

  // Fast initialization - no backend dependency
  useEffect(() => {
    if (shouldSkipAnimations) {
      // Skip loading for mobile/slow devices - show content immediately
      setIsLoading(false);
      setShowTerminal(false);
      return;
    }

    // Quick loading sequence for desktop
    setShowTerminal(true);
    const timer = setTimeout(() => setIsLoading(false), 1500); // Reduced from 4000ms to 1500ms
    
    return () => clearTimeout(timer);
  }, []);

  const LoadingScreen = () => {
    const [currentLine, setCurrentLine] = useState(0);

    const lines = [
      "Initializing system...",
      "Loading interface...",
      "System ready"
    ];

    useEffect(() => {
      if (currentLine < lines.length) {
        const timer = setTimeout(() => {
          setCurrentLine(prev => prev + 1);
        }, 300); // Faster - 300ms instead of 800ms
        return () => clearTimeout(timer);
      }
    }, [currentLine, lines.length]);

    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="loading-logo">
            <div className="logo-grid">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="logo-cell" style={{ '--delay': `${i * 50}ms` }}></div>
              ))}
            </div>
          </div>
          <div className="loading-text">
            <span className="loading-label">Loading...</span>
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
          </div>
          <div className="loading-status">
            <div className="status-lines">
              {lines.map((line, index) => (
                <div
                  key={index}
                  className={`status-line ${index < currentLine ? 'visible' : ''}`}
                >
                  {'>'} {line} {index < currentLine ? 'OK' : ''}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Portfolio = () => {
    const [menuExpanded, setMenuExpanded] = useState(false);
    const [dockMinimized, setDockMinimized] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const dockRef = useRef(null);
    
    // Close menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        // Check if click is outside dock and menu is expanded
        if (menuExpanded && 
            dockRef.current && 
            !dockRef.current.contains(event.target) &&
            !event.target.closest('.ai-orb-logo')) {
          console.log('Clicking outside, closing menu'); // Debug log
          setMenuExpanded(false);
        }
      };
      
      // Add a small delay to prevent immediate closure when opening
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
          // User scrolled down significantly - minimize dock
          if (currentScrollY > lastScrollY && !dockMinimized) {
            setDockMinimized(true);
            // Don't auto-close menu when minimizing, let user control it
          }
        } else {
          // User is near top - show full dock
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
      console.log('Orb clicked, current state:', menuExpanded); // Debug log
      setMenuExpanded(prev => {
        console.log('Setting menu expanded to:', !prev); // Debug log
        return !prev;
      });
    };
    
    // Smooth scroll with menu close
    const handleNavClick = (e, targetId) => {
      e.preventDefault();
      setMenuExpanded(false);
      
      if (targetId === '#hero' || targetId === '#home') {
        // Scroll to top for home
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

  const handleTerminalComplete = () => {
    setShowTerminal(false);
  };

  return (
    <div className="App">
      {/* Terminal Background - only on desktop with effects enabled */}
      {enableEffects && (
        <Suspense fallback={null}>
          <TerminalBackground
            opacity={0.05}
            speed={0.05}
          />
        </Suspense>
      )}

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Portfolio />} />
          </Routes>
        </BrowserRouter>
      )}

      {/* Terminal Overlay - only on desktop */}
      {enableEffects && showTerminal && (
        <Suspense fallback={null}>
          <TerminalOverlay
            isVisible={showTerminal}
            autoStart={true}
            onComplete={handleTerminalComplete}
          />
        </Suspense>
      )}

      {/* Voice and Sound effects removed for performance */}
    </div>
  );
};

export default App;