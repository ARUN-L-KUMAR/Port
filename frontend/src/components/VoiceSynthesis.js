import { useEffect, useRef } from 'react';

const VoiceSynthesis = ({
  text = '',
  autoPlay = false,
  voice = 'female',
  rate = 1,
  pitch = 1,
  volume = 0.8
}) => {
  const synthRef = useRef(null);
  const voicesRef = useRef([]);

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      // Load voices
      const loadVoices = () => {
        voicesRef.current = synthRef.current.getVoices();
      };

      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = async (speechText) => {
    if (!synthRef.current) {
      console.warn('Speech synthesis not available');
      return;
    }

    try {
      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(speechText);

      // Configure voice
      const availableVoices = voicesRef.current;
      let selectedVoice = null;

      if (voice === 'female') {
        selectedVoice = availableVoices.find(v =>
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('woman') ||
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('samantha')
        );
      } else if (voice === 'male') {
        selectedVoice = availableVoices.find(v =>
          v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('man') ||
          v.name.toLowerCase().includes('david') ||
          v.name.toLowerCase().includes('alex')
        );
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Configure speech parameters
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      // Add cyberpunk-style speech effects
      utterance.onstart = () => {
        console.log('AI Voice: Speaking...');
      };

      utterance.onend = () => {
        console.log('AI Voice: Speech complete');
      };

      utterance.onerror = (event) => {
        console.warn('AI Voice Error (non-critical):', event.error);
        // Don't throw error, just log it
      };

      synthRef.current.speak(utterance);
    } catch (error) {
      console.warn('Speech synthesis failed (non-critical):', error);
    }
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const pause = () => {
    if (synthRef.current) {
      synthRef.current.pause();
    }
  };

  const resume = () => {
    if (synthRef.current) {
      synthRef.current.resume();
    }
  };

  // Auto-play if enabled
  useEffect(() => {
    if (autoPlay && text) {
      speak(text);
    }
  }, [autoPlay, text]);

  // Expose methods for external control
  useEffect(() => {
    if (window.cyberVoice) {
      window.cyberVoice.speak = speak;
      window.cyberVoice.stop = stop;
      window.cyberVoice.pause = pause;
      window.cyberVoice.resume = resume;
    } else {
      window.cyberVoice = { speak, stop, pause, resume };
    }
  }, []);

  return null; // This component doesn't render anything
};

export default VoiceSynthesis;