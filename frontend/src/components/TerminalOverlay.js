import React, { useState, useEffect, useRef } from 'react';
import './TerminalOverlay.css';

const TerminalOverlay = ({
  isVisible = false,
  commands = [],
  autoStart = false,
  onComplete = () => {}
}) => {
  const [currentCommand, setCurrentCommand] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const terminalRef = useRef(null);

  const defaultCommands = [
    { text: 'Initializing neural network...', delay: 200 },
    { text: 'Loading system protocols...', delay: 200 },
    { text: 'System ready for deployment', delay: 200 }
  ];

  const activeCommands = commands.length > 0 ? commands : defaultCommands;

  useEffect(() => {
    if (!isVisible || !autoStart) return;

    const startSequence = () => {
      setCurrentCommand(0);
      setDisplayedText('');
      setIsTyping(true);
    };

    const timer = setTimeout(startSequence, 300); // Reduced from 1000ms
    return () => clearTimeout(timer);
  }, [isVisible, autoStart]);

  useEffect(() => {
    if (!isTyping || currentCommand >= activeCommands.length) return;

    const command = activeCommands[currentCommand];
    const text = command.text;
    let charIndex = 0;

    const typeChar = () => {
      if (charIndex < text.length) {
        setDisplayedText(prev => prev + text[charIndex]);
        charIndex++;
        setTimeout(typeChar, 15); // Faster typing - 15ms instead of 50ms
      } else {
        // Command complete, move to next
        setTimeout(() => {
          if (currentCommand < activeCommands.length - 1) {
            setCurrentCommand(prev => prev + 1);
            setDisplayedText('');
          } else {
            setIsTyping(false);
            onComplete();
          }
        }, command.delay);
      }
    };

    typeChar();
  }, [currentCommand, isTyping, activeCommands.length, onComplete]);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="terminal-overlay">
      <div className="terminal-window" ref={terminalRef}>
        <div className="terminal-header">
          <div className="terminal-controls">
            <div className="control-dot red"></div>
            <div className="control-dot yellow"></div>
            <div className="control-dot green"></div>
          </div>
          <span className="terminal-title">AI Terminal - System Boot</span>
        </div>

        <div className="terminal-content">
          <div className="terminal-line">
            <span className="prompt">{'>'}</span>
            <span className="command">system.init()</span>
          </div>

          {currentCommand > 0 && (
            <>
              {Array.from({ length: currentCommand }, (_, i) => (
                <div key={i} className="terminal-line completed">
                  <span className="prompt">{'>'}</span>
                  <span className="command">{activeCommands[i].text}</span>
                  <span className="output success">OK</span>
                </div>
              ))}
            </>
          )}

          {isTyping && (
            <div className="terminal-line active">
              <span className="prompt">{'>'}</span>
              <span className="command">{displayedText}</span>
              <span className={`cursor ${showCursor ? 'visible' : ''}`}>|</span>
            </div>
          )}

          {!isTyping && currentCommand >= activeCommands.length && (
            <div className="terminal-line success">
              <span className="prompt">{'>'}</span>
              <span className="command">All systems operational</span>
              <span className="output success">READY</span>
            </div>
          )}
        </div>

        <div className="terminal-footer">
          <div className="system-status">
            <span className="status-indicator active"></span>
            <span>Neural Network Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalOverlay;