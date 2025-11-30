import React, { useEffect, useRef } from 'react';
import './RoboticArm.css';

const RoboticArm = ({
  position = { x: 50, y: 50 },
  size = 200,
  speed = 1,
  interactive = true
}) => {
  const armRef = useRef(null);
  const jointsRef = useRef([]);

  useEffect(() => {
    const arm = armRef.current;
    if (!arm) return;

    // Create robotic arm segments
    const segments = ['base', 'shoulder', 'elbow', 'wrist', 'hand'];
    arm.innerHTML = '';

    segments.forEach((segment, index) => {
      const segmentEl = document.createElement('div');
      segmentEl.className = `robotic-segment ${segment}`;
      segmentEl.style.setProperty('--delay', `${index * 0.2}s`);
      segmentEl.style.setProperty('--speed', `${speed}s`);

      // Add mechanical details
      if (segment === 'hand') {
        // Add fingers/claw
        for (let i = 0; i < 3; i++) {
          const finger = document.createElement('div');
          finger.className = 'robotic-finger';
          finger.style.setProperty('--finger-delay', `${i * 0.1}s`);
          segmentEl.appendChild(finger);
        }
      }

      // Add glowing joints
      const joint = document.createElement('div');
      joint.className = 'robotic-joint';
      joint.style.setProperty('--joint-glow', index % 2 === 0 ? '#00FFD1' : '#00D4FF');
      segmentEl.appendChild(joint);

      arm.appendChild(segmentEl);
      jointsRef.current.push(segmentEl);
    });

    // Add energy flow
    const energyFlow = document.createElement('div');
    energyFlow.className = 'energy-flow';
    arm.appendChild(energyFlow);

    // Mouse interaction
    if (interactive) {
      const handleMouseMove = (e) => {
        const rect = arm.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        arm.style.transform = `rotate(${angle}rad)`;

        // Update segments based on mouse position
        jointsRef.current.forEach((joint, index) => {
          const delay = index * 0.1;
          setTimeout(() => {
            joint.style.transform = `rotate(${Math.sin(Date.now() * 0.001 + index) * 10}deg)`;
          }, delay * 1000);
        });
      };

      document.addEventListener('mousemove', handleMouseMove);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [interactive, speed]);

  return (
    <div
      ref={armRef}
      className="robotic-arm"
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${size}px`,
        height: `${size}px`,
        transformOrigin: 'bottom center'
      }}
    />
  );
};

export default RoboticArm;