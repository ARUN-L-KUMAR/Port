import React from 'react';
import './FloatingCube.css';

const FloatingCube = ({ isLarge = false }) => {
  return (
    <div className={`floating-cube-container ${isLarge ? 'large-version' : ''}`}>
      {/* Data particles around the cube */}
      <div className="data-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="data-particle" style={{
            '--delay': `${i * 0.2}s`,
            '--x': `${Math.random() * 400 - 200}px`,
            '--y': `${Math.random() * 400 - 200}px`
          }}></div>
        ))}
      </div>

      {/* Grid overlay */}
      <div className="grid-overlay">
        <div className="grid-lines horizontal"></div>
        <div className="grid-lines vertical"></div>
      </div>

      {/* The 3D Cube */}
      <div className="cube-wrapper">
        <div className="holographic-cube">
          {/* Front Face - Name */}
          <div className="cube-face front">
            <div className="face-content">
              <span className="name-text">ARUN KUMAR L</span>
            </div>
          </div>

          {/* Back Face - Same as Front */}
          <div className="cube-face back">
            <div className="face-content">
              <span className="name-text">ARUN KUMAR L</span>
            </div>
          </div>

          {/* Right Face - AI-Augmented */}
          <div className="cube-face right">
            <div className="face-content">
              <span className="role-text">AI-Augmented</span>
            </div>
          </div>

          {/* Left Face - Same as Right */}
          <div className="cube-face left">
            <div className="face-content">
              <span className="role-text">AI-Augmented</span>
            </div>
          </div>

          {/* Top Face - Full Stack Developer */}
          <div className="cube-face top">
            <div className="face-content">
              <span className="title-text">Full Stack Developer</span>
            </div>
          </div>

          {/* Bottom Face - Same as Top */}
          <div className="cube-face bottom">
            <div className="face-content">
              <span className="title-text">Full Stack Developer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reflection effect */}
      <div className="cube-reflection"></div>
    </div>
  );
};

export default FloatingCube;