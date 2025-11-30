import React, { useEffect, useRef, useState } from 'react';
import { portfolioData } from '../data/mock';
import { ArrowDown, Terminal, Cpu, Zap, Activity, Power } from 'lucide-react';

const Hero = () => {
  const [bootPhase, setBootPhase] = useState('initializing'); // initializing, loading, complete
  const [displayText, setDisplayText] = useState('');
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [systemLogs, setSystemLogs] = useState([]);
  const [nameVisible, setNameVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    coreTemp: 'Cold',
    neuralNet: 0,
    portfolio: 'Offline',
    aiKernel: 'Loading'
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const heroRef = useRef(null);
  const neuralCoreRef = useRef(null);

  const { hero } = portfolioData;

  const bootSequence = [
    { text: '> Initializing Neural Core...', delay: 0 },
    { text: '> Calibrating Cognitive Modules...', delay: 800 },
    { text: '> Loading Identity: ARUN KUMAR L', delay: 1600 },
    { text: '> Neural Net Integrity: 99.8%', delay: 2400 },
    { text: '> Portfolio Engine Online', delay: 3200 },
    { text: '> System Boot Complete', delay: 4000 }
  ];

  // Boot sequence controller
  useEffect(() => {
    const runBootSequence = async () => {
      setBootPhase('initializing');
      
      // Phase 1: Boot sequence logs
      for (let i = 0; i < bootSequence.length; i++) {
        setTimeout(() => {
          setSystemLogs(prev => [...prev, bootSequence[i]]);
          setCurrentLogIndex(i);
        }, bootSequence[i].delay);
      }

      // Phase 2: Dynamic system status updates
      setTimeout(() => {
        setSystemStatus(prev => ({ ...prev, coreTemp: 'Warming', neuralNet: 25.4 }));
      }, 1000);

      setTimeout(() => {
        setSystemStatus(prev => ({ ...prev, neuralNet: 67.8, portfolio: 'Initializing' }));
      }, 2000);

      setTimeout(() => {
        setSystemStatus(prev => ({ ...prev, neuralNet: 89.2, aiKernel: 'Calibrating' }));
      }, 3000);

      // Phase 3: Show name after boot sequence
      setTimeout(() => {
        setBootPhase('loading');
        setNameVisible(true);
        setSystemStatus(prev => ({ 
          ...prev, 
          coreTemp: 'Stable', 
          neuralNet: 99.8, 
          portfolio: 'Online',
          aiKernel: 'OK' 
        }));
        
        // Typewriter effect for name
        const nameText = hero.name;
        let nameIndex = 0;
        const nameInterval = setInterval(() => {
          if (nameIndex <= nameText.length) {
            setDisplayText(nameText.slice(0, nameIndex));
            nameIndex++;
          } else {
            clearInterval(nameInterval);
            // Show subtitle after name is complete
            setTimeout(() => {
              setSubtitleVisible(true);
              setBootPhase('complete');
              
              // Show status confirmation
              setTimeout(() => {
                setShowStatusConfirmation(true);
              }, 800);
            }, 500);
          }
        }, 100);
      }, 4500);
    };

    runBootSequence();
  }, []);

  // Real-time clock update
  useEffect(() => {
    if (bootPhase === 'complete') {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [bootPhase]);

  // Periodic status flicker to make it feel alive
  useEffect(() => {
    if (bootPhase === 'complete') {
      const flicker = setInterval(() => {
        setSystemStatus(prev => ({
          ...prev,
          neuralNet: prev.neuralNet + (Math.random() - 0.5) * 0.6
        }));
        
        setTimeout(() => {
          setSystemStatus(prev => ({ ...prev, neuralNet: 99.8 }));
        }, 300);
      }, 8000 + Math.random() * 7000);
      
      return () => clearInterval(flicker);
    }
  }, [bootPhase]);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x: x * 20, y: y * 20 });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Neural core hover effect
  const handleNeuralCoreHover = () => {
    if (neuralCoreRef.current) {
      neuralCoreRef.current.classList.add('core-ripple');
      setTimeout(() => {
        neuralCoreRef.current?.classList.remove('core-ripple');
      }, 1000);
    }
  };

  // Button interaction feedback
  const handleButtonHover = (type) => {
    if (neuralCoreRef.current) {
      neuralCoreRef.current.classList.add(`spark-${type}`);
      setTimeout(() => {
        neuralCoreRef.current?.classList.remove(`spark-${type}`);
      }, 800);
    }
  };

  return (
    <div ref={heroRef} className="neural-hero-container">
      {/* Scanline Effect */}
      <div className="scanline-overlay"></div>
      
      {/* Neural Grid Background */}
      <div className="neural-grid"></div>
      
      {/* Energy Particles */}
      <div className="energy-particles">
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>

      {/* Circuit Flow Lines */}
      <div className="circuit-flows">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className={`circuit-flow flow-${i + 1}`}></div>
        ))}
      </div>

      {/* System Boot Console */}
      <div className={`boot-console ${bootPhase === 'initializing' ? 'active' : 'fade-out'}`}>
        <div className="console-header">
          <Terminal className="console-icon" />
          <span>NEURAL CORE SYSTEM</span>
        </div>
        <div className="console-logs">
          {systemLogs.map((log, index) => (
            <div key={index} className={`log-line ${index === currentLogIndex ? 'typing' : ''}`}>
              {log.text}
            </div>
          ))}
        </div>
      </div>

      {/* Main Neural Interface */}
      <div className={`neural-interface ${bootPhase === 'complete' ? 'active' : ''}`}>
        {/* Neural Core Orb */}
        <div 
          ref={neuralCoreRef}
          className={`neural-core ${bootPhase === 'complete' ? 'breathing' : ''}`}
          onMouseEnter={handleNeuralCoreHover}
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
          }}
        >
          <div className="core-inner">
            <div className="core-pulse"></div>
            <div className="core-ring ring-1"></div>
            <div className="core-ring ring-2"></div>
            <div className="core-ring ring-3"></div>
            <div className="core-ring ring-4"></div>
            
            {/* Scanning arcs */}
            <div className="scanning-arc arc-1"></div>
            <div className="scanning-arc arc-2"></div>
            
            <Cpu className="core-icon" />
          </div>
        </div>

        {/* Identity Display */}
        <div className={`identity-display ${nameVisible ? 'visible' : ''}`}>
          <h1 className="neural-name">
            {displayText}
            <span className="name-cursor">|</span>
          </h1>
          <div className={`neural-subtitle ${subtitleVisible ? 'visible' : ''}`}>
            <div className="subtitle-glitch" data-text={hero.subtitle}>
              {hero.subtitle}
            </div>
          </div>
        </div>

        {/* System Status Panel */}
        <div className={`status-panel ${bootPhase === 'complete' ? 'active' : ''}`}>
          <div className="status-header">
            <Activity className="status-icon" />
            <span>SYSTEM STATUS</span>
          </div>
          <div className="status-items">
            <div className="status-row">
              <span className="status-label">Core Temp:</span>
              <span className={`status-value ${bootPhase === 'complete' ? 'stable' : 'loading'}`}>
                {systemStatus.coreTemp}
              </span>
            </div>
            <div className="status-row">
              <span className="status-label">Neural Net:</span>
              <span className="status-value online flickering">
                {typeof systemStatus.neuralNet === 'number' ? `${systemStatus.neuralNet.toFixed(1)}%` : systemStatus.neuralNet}
              </span>
            </div>
            <div className="status-row">
              <span className="status-label">Portfolio:</span>
              <span className={`status-value ${bootPhase === 'complete' ? 'active' : 'loading'}`}>
                {systemStatus.portfolio}
              </span>
            </div>
            <div className="status-row">
              <span className="status-label">AI Kernel:</span>
              <span className={`status-value ${bootPhase === 'complete' ? 'stable' : 'loading'}`}>
                {systemStatus.aiKernel}
              </span>
            </div>
          </div>
        </div>

        {/* Live Clock */}
        <div className={`system-clock ${bootPhase === 'complete' ? 'active' : ''}`}>
          <div className="clock-label">System Time</div>
          <div className="clock-display">
            {currentTime.toLocaleTimeString('en-US', { 
              hour12: false, 
              timeZone: 'UTC' 
            })} UTC
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`neural-actions ${bootPhase === 'complete' ? 'active' : ''}`}>
          <button 
            className="neural-btn primary" 
            onMouseEnter={() => handleButtonHover('projects')}
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>INITIALIZE PROJECTS</span>
            <Zap className="btn-icon" />
          </button>
          <button 
            className="neural-btn secondary" 
            onMouseEnter={() => handleButtonHover('contact')}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>ESTABLISH CONTACT</span>
            <ArrowDown className="btn-icon" />
          </button>
        </div>
      </div>

      {/* Background Circuits */}
      <div className="circuit-overlay">
        <svg className="circuit-svg" viewBox="0 0 1200 800">
          <defs>
            <linearGradient id="circuitGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFD1" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#00D4FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00FFD1" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          {/* Circuit Paths */}
          <path d="M100,100 L300,100 L300,200 L500,200" stroke="url(#circuitGlow)" strokeWidth="2" fill="none" className="circuit-path" />
          <path d="M600,300 L800,300 L800,150 L1000,150" stroke="url(#circuitGlow)" strokeWidth="2" fill="none" className="circuit-path" />
          <path d="M200,400 L400,400 L400,600 L700,600" stroke="url(#circuitGlow)" strokeWidth="2" fill="none" className="circuit-path" />
          
          {/* Circuit Nodes */}
          <circle cx="300" cy="100" r="4" fill="#00FFF0" className="circuit-node" />
          <circle cx="500" cy="200" r="4" fill="#A800FF" className="circuit-node" />
          <circle cx="800" cy="300" r="4" fill="#00FFF0" className="circuit-node" />
          <circle cx="400" cy="400" r="4" fill="#A800FF" className="circuit-node" />
        </svg>
      </div>

      {/* Status Confirmation */}
      {showStatusConfirmation && (
        <div className="status-confirmation">
          <div className="confirmation-line">Neural Interface Initialized ✅</div>
          <div className="confirmation-line">System: Online</div>
          <div className="confirmation-line">Ready for Commands</div>
        </div>
      )}
    </div>
  );
};

export default Hero;