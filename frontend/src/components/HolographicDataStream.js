import React, { useEffect, useRef } from 'react';
import './HolographicDataStream.css';

const HolographicDataStream = ({
  streamCount = 5,
  speed = 2,
  colors = ['#00FFD1', '#00D4FF', '#FF6B9D'],
  opacity = 0.8
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing streams
    container.innerHTML = '';

    // Create data streams
    for (let i = 0; i < streamCount; i++) {
      const stream = document.createElement('div');
      stream.className = 'data-stream';
      stream.style.setProperty('--delay', `${i * 0.5}s`);
      stream.style.setProperty('--speed', `${speed}s`);
      stream.style.setProperty('--color', colors[i % colors.length]);

      // Create stream particles
      for (let j = 0; j < 20; j++) {
        const particle = document.createElement('div');
        particle.className = 'stream-particle';
        particle.style.setProperty('--particle-delay', `${j * 0.1}s`);
        particle.style.setProperty('--particle-opacity', Math.random() * 0.8 + 0.2);
        stream.appendChild(particle);
      }

      // Add data bits
      for (let k = 0; k < 15; k++) {
        const bit = document.createElement('div');
        bit.className = 'data-bit';
        bit.textContent = Math.random() > 0.5 ? '1' : '0';
        bit.style.setProperty('--bit-delay', `${k * 0.2}s`);
        bit.style.setProperty('--bit-position', `${Math.random() * 100}%`);
        stream.appendChild(bit);
      }

      container.appendChild(stream);
    }

    // Cleanup function
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [streamCount, speed, colors]);

  return (
    <div
      ref={containerRef}
      className="holographic-data-streams"
      style={{ opacity }}
    />
  );
};

export default HolographicDataStream;