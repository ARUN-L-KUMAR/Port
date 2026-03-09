import React, { useEffect, useState, useRef } from 'react';
import './TerminalOverlay.css';
import { useAudio, AUDIO_STATES } from './AudioManager';

// Matrix background effect component
const MatrixEffect = ({ color = '#00FF41' }) => {
  const canvasRef = useRef(null);

  const dropsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ'.split('');
    const fontSize = 22; // Larger font = fewer columns = less heavy
    const columns = Math.floor(width / fontSize);

    // Maintain drops across color changes using Ref
    if (dropsRef.current.length !== columns) {
      dropsRef.current = [];
      for (let x = 0; x < columns; x++) {
        // Randomly skip columns to reduce density further
        dropsRef.current[x] = Math.random() > 0.4 ? Math.random() * -100 : -1000;
      }
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; // Darker trail
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px "VT323", monospace`;

      for (let i = 0; i < dropsRef.current.length; i++) {
        if (dropsRef.current[i] < -500) continue; // Skip sparse columns

        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, dropsRef.current[i] * fontSize);

        if (dropsRef.current[i] * fontSize > height && Math.random() > 0.985) {
          dropsRef.current[i] = 0;
        }
        dropsRef.current[i] += 1; // Slower falling speed
      }
    };

    const interval = setInterval(draw, 80); // Slower update cycle

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [color]);

  return <canvas ref={canvasRef} className="matrix-canvas" />;
};

// Component to handle the decryption animation for a single line
const DecipherText = ({ text, speed = 30 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let iterations = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*[]<>';
    const totalIterations = text.length + 5;

    const interval = setInterval(() => {
      if (iterations >= totalIterations) {
        setDisplayText(text);
        setIsComplete(true);
        clearInterval(interval);
        return;
      }

      const scrambled = text.split('').map((char, index) => {
        if (index < iterations) {
          return text[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');

      setDisplayText(scrambled);
      iterations += 1 / 2; // Original slow reveal
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={`terminal-text ${isComplete ? 'completed' : 'decrypting'}`}>
      {displayText}
    </span>
  );
};

// SVG-based Network Topology Map - Refined for density
const NetworkMap = () => {
  const nodes = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
  }));

  return (
    <div className="hud-panel network-map">
      <div className="panel-title">NETWORK_TOPOLOGY_v4.0</div>
      <svg viewBox="0 0 100 100" className="topology-svg">
        {nodes.map((node, i) => (
          <React.Fragment key={i}>
            {nodes.slice(i + 1).map((target, j) => (
              (Math.abs(node.x - target.x) < 25 && Math.abs(node.y - target.y) < 25) && (
                <line
                  key={`${i}-${j}`}
                  x1={node.x} y1={node.y}
                  x2={target.x} y2={target.y}
                  className="topology-line"
                />
              )
            ))}
            <circle cx={node.x} cy={node.y} r="1.2" className="topology-node" />
            {(i % 3 === 0) && <circle cx={node.x} cy={node.y} r="2.5" className="node-pulse" />}
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};

// Rapidly flashing data matrix - Refined for density
const DecryptionMatrix = () => {
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newGrid = Array.from({ length: 80 }, () =>
        Math.random().toString(16).substring(2, 4).toUpperCase()
      );
      setGrid(newGrid);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hud-panel decryption-matrix">
      <div className="panel-title">DECRYPTION_BUFFER_LOAD</div>
      <div className="matrix-grid">
        {grid.map((cell, i) => (
          <span key={i} className={`matrix-cell ${Math.random() > 0.85 ? 'active' : ''}`}>
            {cell}
          </span>
        ))}
      </div>
    </div>
  );
};

// Circular Tactical Gauge
const TacticalGauge = ({ value, label }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  // Modern tactical colors: Red for low progress, Green for completion
  const gaugeColor = value < 50 ? '#ff1144' : '#11ff22';

  return (
    <div className="tactical-gauge">
      <svg viewBox="0 0 100 100" className="gauge-svg">
        <circle cx="50" cy="50" r={radius} className="gauge-track" />
        <circle
          cx="50" cy="50" r={radius}
          className="gauge-progress"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            stroke: gaugeColor,
            filter: `drop-shadow(0 0 5px ${gaugeColor})`
          }}
        />
        <text
          x="50" y="55"
          className="gauge-value"
          style={{ fill: gaugeColor, textShadow: `0 0 10px ${gaugeColor}` }}
        >
          {value}%
        </text>
      </svg>
      <div className="gauge-label" style={{ color: gaugeColor }}>{label}</div>
    </div>
  );
};

// Recreated Data Stream component for professional system-log appearance
const DataStream = () => {
  const [data, setData] = useState([
    '> TCP_ALLOW  192.168.1.42:443',
    '> SSL_SYNC   0xA3F2 :: 12847b',
    '> DNS_ROUTE  0xB8C1 :: 5312b',
    '> SSH_FILTER 10.0.0.1:22',
    '> UDP_BYPASS 0xD4E7 :: 8192b',
  ]);

  useEffect(() => {
    const protocols = ['TCP', 'UDP', 'HTTP', 'SSL', 'SSH', 'DNS'];
    const actions = ['ALLOW', 'REJECT', 'BYPASS', 'FILTER', 'ROUTE', 'SYNC'];
    const ips = ['192.168.1.', '10.0.0.', '172.16.0.'];

    const interval = setInterval(() => {
      const proto = protocols[Math.floor(Math.random() * protocols.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const hex = Math.random().toString(16).substring(2, 6).toUpperCase();
      const bytes = (Math.floor(Math.random() * 60) + 1) * 512;
      const ip = ips[Math.floor(Math.random() * ips.length)];
      const last = Math.floor(Math.random() * 254) + 1;

      const line = `> ${proto}_${action}  ${ip}${last} :: ${bytes}b`;
      setData(prev => [line, ...prev].slice(0, 7));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cyber-data-stream">
      {data.map((line, i) => (
        <div key={i} className="stream-line">
          {line}
        </div>
      ))}
    </div>
  );
};

// Modern Cyber Progress Bar
const CyberProgressBar = ({ label, duration = 2000 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const val = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(val);
      if (val >= 100) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div className="cyber-progress-container">
      <div className="progress-label">{label}</div>
      <div className="progress-track">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="progress-value">{progress}%</div>
    </div>
  );
};

// Decorative HUD elements
const ScanningHUD = () => (
  <div className="scanning-hud">
    <div className="hud-corner top-left"></div>
    <div className="hud-corner top-right"></div>
    <div className="hud-corner bottom-left"></div>
    <div className="hud-corner bottom-right"></div>
    <div className="hud-crosshair"></div>
    <div className="hud-scanline"></div>
  </div>
);

// --- Constants ---
// Boot sequence: ~4 seconds of text (after 2s lead-in animation)
// Each line: delay + 200ms = ~570ms per line × 7 = ~4s
const BOOT_SEQUENCE = [
  { text: '> $ INITIALIZING SYSTEM...[1]', delay: 370 },
  { text: '> Loading neural network...[2]', delay: 370 },
  { text: '> Establishing quantum link...[3]', delay: 370 },
  { text: '> Synchronizing data streams...[4]', delay: 370 },
  { text: '> Activating holographic interface...[5]', delay: 370 },
  { text: '> System check... [OK]', delay: 370 },
  { text: '> $ All systems operational$', delay: 370 },
];

// Final Success Screen Component
const SuccessScreen = () => {
  return (
    <div className="success-screen-container">
      <div className="success-card">
        <div className="success-header">SYSTEM_COMPROMISED</div>
        <div className="success-main-text" data-text="HACKED_SUCCESSFULLY">
          HACKED SUCCESSFULLY
        </div>
        <div className="success-sub-text pulse-text">
          PORTFOLIO ACCESS GRANTED
        </div>
        <div className="welcome-greeting">
          WELCOME TO MY PORTFOLIO
        </div>
        <div className="loading-dots">
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>
    </div>
  );
};

const TerminalOverlay = ({ isVisible, autoStart = false, onComplete }) => {
  const [lines, setLines] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [bootReady, setBootReady] = useState(false); // true after 1s lead-in
  const [isBooting, setIsBooting] = useState(autoStart);
  const [showHackedScreen, setShowHackedScreen] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { setAudioState } = useAudio();

  const terminalBodyRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleStart = () => {
    setIsInitialized(true);
    setAudioState(AUDIO_STATES.BOOT);
  };

  useEffect(() => {
    if (autoStart && isVisible && isInitialized) {
      let currentIndex = 0;

      // 1-second lead-in: empty terminal with opening animation
      timeoutRef.current = setTimeout(() => {
        setBootReady(true); // reveal terminal text after 1s

        const runBoot = () => {
          if (currentIndex < BOOT_SEQUENCE.length) {
            const line = BOOT_SEQUENCE[currentIndex];
            if (line) {
              setLines(prev => [...prev, line.text]);
              currentIndex++;
              timeoutRef.current = setTimeout(runBoot, line.delay + 200);
            }
          } else {
            timeoutRef.current = setTimeout(() => {
              // Show Tactical HUD (music continues from boot - no restart)
              setShowHackedScreen(true);

              // Tactical phase = 7 seconds: 100 increments × 70ms = 7000ms
              let p = 0;
              const pInterval = setInterval(() => {
                p += 1; // 1 per tick × 70ms = 7000ms for 100%
                if (p >= 100) {
                  p = 100;
                  clearInterval(pInterval);

                  // Transition to Success Screen
                  timeoutRef.current = setTimeout(() => {
                    // Show Success Screen (music continues - no restart)
                    setShowSuccessScreen(true);

                    // Success screen = 3 seconds before closing
                    timeoutRef.current = setTimeout(() => {
                      setIsBooting(false);
                      if (onComplete) onComplete();
                    }, 3000);
                  }, 800);
                }
                setProgress(p);
              }, 77); // 77ms × 100 steps = 7700ms (7.7s)
            }, 1000);
          }
        };

        runBoot();
      }, 2000); // 2 second empty lead-in

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [autoStart, isVisible, isInitialized, onComplete, setAudioState]);

  // Handle auto-scroll
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [lines]);

  if (!isVisible) return null;

  if (!isInitialized) {
    return (
      <div className="system-initializer-overlay">
        <MatrixEffect />
        <div className="scanning-hud">
          <div className="hud-corner top-left"></div>
          <div className="hud-corner top-right"></div>
          <div className="hud-corner bottom-left"></div>
          <div className="hud-corner bottom-right"></div>
          <div className="hud-scanline"></div>
        </div>
        <div className="init-panel">
          <div className="init-header">ROOT_ACCESS_LEVEL_10</div>
          <div className="init-warning">AUTH_REQUIRED :: ESTABLISH_ENCRYPTED_LINK</div>
          <button
            className="init-button"
            onClick={handleStart}
            aria-label="Initialize System"
          >
            INITIALIZE SYSTEM
          </button>
          <div className="init-footer">V4.0 // COMPLIANCE::QUANTUM_SECURE</div>

          {/* Decorative technical elements */}
          <div className="panel-decor-left">0101</div>
          <div className="panel-decor-right">R_10</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`terminal-overlay ${!isBooting ? 'fade-out' : ''} ${showHackedScreen ? 'hacked-state' : ''} ${showHackedScreen && progress < 50 ? 'tactical-red' : ''}`}>
      {/* Matrix color: Only red during Phase 2 (Tactical HUD) until 50% progress */}
      <MatrixEffect color={showHackedScreen && !showSuccessScreen && progress < 50 ? '#ff1144' : '#00FF41'} />



      {showSuccessScreen ? (
        <SuccessScreen />
      ) : !showHackedScreen ? (
        <div className={`terminal-container ${!bootReady ? 'boot-enter' : ''}`}>
          <div className="terminal-header">
            <div className="terminal-title">TERMINAL_ROOT_ACCESS</div>
            <div className="terminal-buttons">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
          </div>
          <div className="terminal-body" ref={terminalBodyRef}>
            {bootReady && lines.map((text, i) => (
              <div key={i} className="terminal-line">
                <DecipherText text={text} speed={20} />
              </div>
            ))}
            <div className="terminal-line">
              <span className="terminal-prompt">{'>'}</span><span className="terminal-cursor">_</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={`cyber-hud-layout ${progress < 50 ? 'theme-red' : 'theme-green'}`}>
          <ScanningHUD />

          <div className="hud-top-bar">
            <div className="hud-logo">TERMINAL_TAC_HUD v2.4</div>
            <div className="hud-alert-banner">CRYPTO_KEY_INTERCEPTED :: BREACH_IN_PROGRESS</div>
            <div className="hud-timer">SESSION_TIME: {new Date().toLocaleTimeString()}</div>
          </div>

          <div className="hud-main-grid">
            <div className="hud-left-panel">
              <NetworkMap />
              <div className="hud-panel system-health">
                <div className="panel-title">SYSTEM_HEALTH</div>
                <div className="health-stat">CPU: 88% <div className="stat-bar"><div style={{ width: '88%' }}></div></div></div>
                <div className="health-stat">RAM: 42% <div className="stat-bar"><div style={{ width: '42%' }}></div></div></div>
              </div>
            </div>

            <div className="hud-center-panel">
              <div className="main-breach-display">
                <div className="glitch-title" data-text="SYSTEM_BREACH">
                  SYSTEM_BREACH
                </div>
                <TacticalGauge value={progress} label="TOTAL_DECRYPTION_PROGRESS" />
                <div className="status-badge">
                  LEVEL_4_CLEARANCE_DETECTED
                </div>
              </div>
            </div>

            <div className="hud-right-panel">
              <DecryptionMatrix />
              <div className="hud-panel data-stream-container">
                <div className="panel-title">LIVE_DATA_FEED</div>
                <DataStream />
              </div>
            </div>
          </div>


          <div className="hud-footer">
            <div className="footer-line">ESTABLISHING_VPN_TUNNEL... [CONNECTED]</div>
            <div className="footer-line">BYPASSING_GATEWAY_302... [DONE]</div>
            <div className="footer-line">ROOT_ACCESS_LEVEL: 10</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminalOverlay;
