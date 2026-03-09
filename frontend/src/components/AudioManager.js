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

export const AudioManager = ({ children }) => {
    const [audioState, setAudioState] = useState(AUDIO_STATES.OFF);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const playAudio = async () => {
            if (audioState === AUDIO_STATES.OFF) {
                audioRef.current.pause();
                return;
            }

            const source = AUDIO_FILES[audioState];
            if (!source) return;

            // If same source is already playing, don't restart
            if (audioRef.current.src.endsWith(source) && !audioRef.current.paused) {
                return;
            }

            const startPlaying = () => {
                audioRef.current.src = source;
                audioRef.current.loop = false; // play once only
                audioRef.current.volume = isMuted ? 0 : 0;

                audioRef.current.play().catch(err => {
                    console.warn("Audio play blocked.", err);
                });

                // Fade in
                let fadeInInterval = setInterval(() => {
                    if (audioRef.current.volume < 0.45 && !isMuted) {
                        audioRef.current.volume += 0.05;
                    } else {
                        clearInterval(fadeInInterval);
                    }
                }, 80);
            };

            try {
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

        return () => {
            audioRef.current.pause();
        };
    }, [audioState, isMuted]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const next = !prev;
            audioRef.current.volume = next ? 0 : 0.5;
            return next;
        });
    }, []);

    const value = useMemo(() => ({
        setAudioState,
        toggleMute,
        isMuted,
        audioState
    }), [audioState, isMuted, toggleMute]);

    return (
        <AudioContext.Provider value={value}>
            {children}
            {/* Mute Toggle UI Placeholder */}
            <div className="audio-controls" style={{
                position: 'fixed',
                bottom: '20px',
                right: '25px', // Adjusted position
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
            }} onClick={toggleMute}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 25px #00FF41'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,65,0.4)'}>
                {isMuted ? '🔇' : '🔊'}
            </div>
        </AudioContext.Provider>
    );
};
