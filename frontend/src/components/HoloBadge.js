import React from 'react';
import './HoloBadge.css';

// A lightweight holographic badge
// Desktop: shows code snippet | Mobile: shows name & role
const HoloBadge = ({ isLarge = false, variant = 'code' }) => {
  return (
    <div className={`holo-badge-container ${isLarge ? 'large-version' : ''} ${variant === 'identity' ? 'identity-mode' : 'code-mode'}`}>
      {/* Outer rotating ring */}
      <div className="outer-ring">
        <div className="ring-segment seg-1"></div>
        <div className="ring-segment seg-2"></div>
        <div className="ring-segment seg-3"></div>
        <div className="ring-segment seg-4"></div>
      </div>

      {/* Inner content */}
      <div className="badge-core">
        <div className="core-glow"></div>
        <div className="badge-content">
          
          {/* Identity content - for mobile */}
          <div className="identity-content">
            <span className="identity-name">ARUN KUMAR K</span>
            <div className="identity-divider"></div>
            <span className="identity-role">Full Stack Developer</span>
            <span className="identity-sub">AI-Augmented</span>
          </div>

          {/* Code snippet - for desktop - static display */}
          <div className="code-content">
            <div className="code-block">
              <span className="code-line">
                <span className="code-keyword">const</span> <span className="code-var">dev</span> <span className="code-operator">=</span> <span className="code-brace">{"{"}</span>
              </span>
              <span className="code-line indent">
                <span className="code-prop">skills</span><span className="code-operator">:</span> <span className="code-string">"∞"</span><span className="code-comma">,</span>
              </span>
              <span className="code-line indent">
                <span className="code-prop">passion</span><span className="code-operator">:</span> <span className="code-bool">true</span><span className="code-comma">,</span>
              </span>
              <span className="code-line indent">
                <span className="code-prop">coffee</span><span className="code-operator">:</span> <span className="code-number">999</span>
              </span>
              <span className="code-line">
                <span className="code-brace">{"}"}</span><span className="code-semicolon">;</span>
              </span>
            </div>
            <div className="status-bar">
              <span className="status-dot"></span>
              <span className="status-text">Ready to Build</span>
            </div>
          </div>

        </div>
      </div>

      {/* Orbiting dots */}
      <div className="badge-orbit-path">
        <div className="badge-orbit-dot dot-1"></div>
        <div className="badge-orbit-dot dot-2"></div>
        <div className="badge-orbit-dot dot-3"></div>
      </div>

      {/* Simple scan line */}
      <div className="scan-line"></div>
    </div>
  );
};

export default HoloBadge;
