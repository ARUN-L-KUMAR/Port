import { useEffect, useRef } from 'react';

const CyberSounds = ({
  enableAmbient = true,
  enableInteractions = true,
  volume = 0.3
}) => {
  const audioContextRef = useRef(null);
  const ambientSoundRef = useRef(null);
  const interactionSoundsRef = useRef({});

  useEffect(() => {
    // Initialize Web Audio API
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
        return;
      }
    }

    const audioContext = audioContextRef.current;

    // Create ambient cyber sound
    const createAmbientSound = () => {
      if (!enableAmbient) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      // Configure ambient drone
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 2);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, audioContext.currentTime);
      filter.Q.setValueAtTime(1, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.1, audioContext.currentTime + 1);

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      ambientSoundRef.current = { oscillator, gainNode, filter };
    };

    // Create interaction sound effects
    const createInteractionSounds = () => {
      if (!enableInteractions) return;

      // Hover sound
      interactionSoundsRef.current.hover = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      };

      // Click sound
      interactionSoundsRef.current.click = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.05);

        gainNode.gain.setValueAtTime(volume * 0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
      };

      // Navigation sound
      interactionSoundsRef.current.navigate = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.05);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(volume * 0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      };

      // Matrix rain sound (subtle)
      interactionSoundsRef.current.matrix = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.frequency.setValueAtTime(2000 + Math.random() * 1000, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.02);

        gainNode.gain.setValueAtTime(volume * 0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.02);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.02);
      };
    };

    // Start audio context on user interaction
    const startAudio = async () => {
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      createAmbientSound();
      createInteractionSounds();

      // Attach event listeners for interactions
      if (enableInteractions) {
        const handleHover = (e) => {
          if (e.target.closest('.orbit-item, .btn-primary, .btn-secondary, .project-card, .stat-card')) {
            interactionSoundsRef.current.hover?.();
          }
        };

        const handleClick = (e) => {
          if (e.target.closest('.orbit-item, .btn-primary, .btn-secondary, .action-btn')) {
            interactionSoundsRef.current.click?.();
          }
        };

        const handleNavigate = () => {
          interactionSoundsRef.current.navigate?.();
        };

        document.addEventListener('mouseover', handleHover);
        document.addEventListener('click', handleClick);
        window.addEventListener('hashchange', handleNavigate);

        // Store cleanup functions
        window.cyberSoundsCleanup = () => {
          document.removeEventListener('mouseover', handleHover);
          document.removeEventListener('click', handleClick);
          window.removeEventListener('hashchange', handleNavigate);
        };
      }
    };

    // Auto-start or wait for user interaction
    const handleUserInteraction = () => {
      startAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    // Cleanup
    return () => {
      if (ambientSoundRef.current) {
        ambientSoundRef.current.oscillator?.stop();
        ambientSoundRef.current.gainNode?.disconnect();
      }

      if (window.cyberSoundsCleanup) {
        window.cyberSoundsCleanup();
      }

      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [enableAmbient, enableInteractions, volume]);

  // Expose sound control methods
  useEffect(() => {
    window.cyberSounds = {
      playHover: () => interactionSoundsRef.current.hover?.(),
      playClick: () => interactionSoundsRef.current.click?.(),
      playNavigate: () => interactionSoundsRef.current.navigate?.(),
      playMatrix: () => interactionSoundsRef.current.matrix?.(),
      setVolume: (newVolume) => {
        if (ambientSoundRef.current) {
          ambientSoundRef.current.gainNode.gain.setValueAtTime(
            newVolume * 0.1,
            audioContextRef.current.currentTime
          );
        }
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default CyberSounds;