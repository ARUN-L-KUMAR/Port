import React, { useEffect, useRef, useState, createContext, useContext, useCallback, useMemo } from 'react';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AUDIO_STATES = {
    BOOT: 'BOOT',
    HUD: 'HUD',
    SUCCESS: 'SUCCESS',
    HOME: 'HOME',
    OFF: 'OFF'
};

const AUDIO_FILES = {
    [AUDIO_STATES.BOOT]: '/audio/terminal_bg.mp3',
    [AUDIO_STATES.HUD]: '/audio/terminal_bg.mp3',    // same track
    [AUDIO_STATES.SUCCESS]: '/audio/terminal_bg.mp3', // same track
    [AUDIO_STATES.HOME]: '/audio/home_bg.mp3'
};

// Max volumes per state: home_bg is quieter
const AUDIO_VOLUMES = {
    [AUDIO_STATES.BOOT]: 0.45,
    [AUDIO_STATES.HUD]: 0.45,
    [AUDIO_STATES.SUCCESS]: 0.45,
    [AUDIO_STATES.HOME]: 0.22, // Lower volume for home bg
};

export const AudioManager = ({ children }) => {
    const [audioState, setAudioState] = useState(AUDIO_STATES.OFF);
    const [isPlaying, setIsPlaying] = useState(true); // Track play/pause state
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const playAudio = async () => {
            if (audioState === AUDIO_STATES.OFF) {
                audioRef.current.pause();
                return;
            }

            const source = AUDIO_FILES[audioState];
            if (!source) return;

            const maxVolume = AUDIO_VOLUMES[audioState] || 0.45;
            const shouldLoop = audioState === AUDIO_STATES.HOME; // Only home loops

            const startPlaying = () => {
                audioRef.current.src = source;
                audioRef.current.loop = shouldLoop;
                audioRef.current.volume = 0; // Start silent for fade-in

                audioRef.current.play().catch(err => {
                    console.warn("Audio play blocked.", err);
                });

                // Fade in to the correct max volume
                let fadeInInterval = setInterval(() => {
                    if (audioRef.current.volume < maxVolume - 0.05 && isPlaying) {
                        audioRef.current.volume = Math.min(audioRef.current.volume + 0.05, maxVolume);
                    } else {
                        audioRef.current.volume = maxVolume;
                        clearInterval(fadeInInterval);
                    }
                }, 80);
            };

            try {
                // If same source is already playing, don't restart
                if (audioRef.current.src.endsWith(source) && !audioRef.current.paused) {
                    return;
                }
                // If nothing is playing, start immediately (no fade-out needed)
                if (audioRef.current.paused || !audioRef.current.src) {
                    startPlaying();
                } else {
                    // Fade out current audio then switch
                    let fadeOutInterval = setInterval(() => {
                        if (audioRef.current.volume > 0.1) {
                            audioRef.current.volume -= 0.1;
                        } else {
                            clearInterval(fadeOutInterval);
                            audioRef.current.pause();
                            startPlaying();
                        }
                    }, 50);
                }
            } catch (error) {
                console.error("AudioManager Error:", error);
            }
        };

        playAudio();
    }, [audioState]);

    // Toggle: pause/resume — does NOT restart from beginning
    const togglePlayPause = useCallback(() => {
        setIsPlaying(prev => {
            const next = !prev;
            if (next) {
                // Resume from where it stopped
                audioRef.current.play().catch(err => console.warn("Play blocked:", err));
            } else {
                // Pause (keeps position)
                audioRef.current.pause();
            }
            return next;
        });
    }, []);

    const value = useMemo(() => ({
        setAudioState,
        togglePlayPause,
        isPlaying,
        audioState
    }), [audioState, isPlaying, togglePlayPause]);

    return (
        <AudioContext.Provider value={value}>
            {children}
            {/* Play/Pause Toggle UI */}
            <div className="audio-controls" style={{
                position: 'fixed',
                bottom: '20px',
                right: '25px',
                zIndex: 100000,
                cursor: 'pointer',
                background: 'rgba(0,0,0,0.6)',
                padding: '10px',
                borderRadius: '50%',
                border: '1px solid #00FF41',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                color: '#00FF41',
                boxShadow: '0 0 15px rgba(0,255,65,0.4)',
                transition: 'all 0.3s ease'
            }} onClick={togglePlayPause}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 25px #00FF41'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,65,0.4)'}>
                {isPlaying ? '🔊' : '🔇'}
            </div>
        </AudioContext.Provider>
    );
};
