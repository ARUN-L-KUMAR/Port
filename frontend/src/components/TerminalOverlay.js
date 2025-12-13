import React, { useEffect, useState, useRef } from 'react';
import './TerminalOverlay.css';

// Component to handle the decryption animation for a single line
const DecipherText = ({ text, speed = 30, revealSpeed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let iterations = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*[]<>';
    const totalIterations = text.length + 5; // Run a bit longer than length

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
      iterations += 1 / 2; // Slow down the reveal slightly
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={`terminal-text ${isComplete ? 'completed' : 'decrypting'}`}>
      {displayText}
    </span>
  );
};

const TerminalOverlay = ({ isVisible, autoStart = false, onComplete }) => {
  const [lines, setLines] = useState([]);
  const [isBooting, setIsBooting] = useState(autoStart);
  const [showHackedScreen, setShowHackedScreen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Ref to scroll to bottom
  const terminalBodyRef = useRef(null);

  const bootSequence = [
    { text: '> $ INITIALIZING SYSTEM...[1]', delay: 400 },
    { text: '> Loading neural network...[2]', delay: 400 },
    { text: '> Establishing quantum link...[3]', delay: 400 },
    { text: '> Synchronizing data streams...[4]', delay: 400 },
    { text: '> Activating holographic interface...[5]', delay: 400 },
    { text: '> Calibrating sensors...[6]', delay: 400 },
    { text: '> System check... [OK]', delay: 500 },
    { text: '> $ All systems operational$', delay: 600 },
  ];

  useEffect(() => {
    if (autoStart && isVisible) {
      let currentIndex = 0;

      const runBootSequence = () => {
        if (currentIndex < bootSequence.length) {
          const line = bootSequence[currentIndex];

          setLines(prev => [...prev, line.text]);

          // Auto scroll
          if (terminalBodyRef.current) {
            terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
          }

          currentIndex++;
          // Wait for the delay defined in the sequence before showing the next line
          // The decryption animation runs independently within the component
          setTimeout(runBootSequence, line.delay + 200); // Add a small buffer for effect
        } else {
          // Boot sequence finished
          setTimeout(() => {
            setLines([]); // Clear screen visually
            setShowHackedScreen(true);

            // Sequence: HACKED -> ACCESS GRANTED -> WELCOME -> FINISH
            setTimeout(() => {
              setShowWelcome(true);

              setTimeout(() => {
                setIsBooting(false); // Triggers fade out
                if (onComplete) onComplete();
              }, 3000); // Time to see the Welcome message
            }, 2000); // Time to see Access Granted before Welcome
          }, 1000); // Pause before clearing
        }
      };

      // Start the sequence
      const initialDelay = setTimeout(runBootSequence, 500);
      return () => clearTimeout(initialDelay);
    }
  }, [autoStart, isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`terminal-overlay ${!isBooting ? 'fade-out' : ''}`}>
      <div className="terminal-container">
        <div className="terminal-header">
          <div className="terminal-title">TERMINAL_ROOT_ACCESS</div>
          <div className="terminal-buttons">
            <div className="terminal-button"></div>
            <div className="terminal-button"></div>
            <div className="terminal-button"></div>
          </div>
        </div>

        <div className="terminal-body" ref={terminalBodyRef}>
          {!showHackedScreen ? (
            // Standard Boot Sequence
            <>
              {lines.map((text, i) => (
                <div key={i} className="terminal-line boot-text">
                  <DecipherText text={text} speed={20} />
                </div>
              ))}
              <div className="terminal-line">
                <span className="terminal-prompt">{'>'}</span>
                <span className="terminal-cursor">_</span>
              </div>
            </>
          ) : (
            // HACKED Screen
            <div className="hacked-container">
              <div className="hacked-text" data-text="HACKED PORTFOLIO">
                HACKED PORTFOLIO
              </div>
              <div className="access-granted">
                ACCESS GRANTED
              </div>
              {showWelcome && (
                <div className="welcome-message">
                  WELCOME TO MY PORTFOLIO
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TerminalOverlay;
