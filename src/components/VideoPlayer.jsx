import { useEffect, useRef, useState } from 'react';
import './VideoPlayer.css';

function VideoPlayer({ video }) {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const progressRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [showSkipIndicator, setShowSkipIndicator] = useState(null);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const lastTapRef = useRef(0);
    const controlsTimeoutRef = useRef(null);

    // Format time to MM:SS
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Play/Pause toggle
    const togglePlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    // Skip forward/backward
    const skip = (seconds) => {
        if (!videoRef.current) return;
        videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    };

    // Handle progress bar click
    const handleProgressClick = (e) => {
        if (!progressRef.current || !videoRef.current) return;
        const rect = progressRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = pos * duration;
    };

    // Handle touch on progress bar
    const handleProgressTouch = (e) => {
        if (!progressRef.current || !videoRef.current) return;
        e.preventDefault();
        const rect = progressRef.current.getBoundingClientRect();
        const touch = e.touches[0] || e.changedTouches[0];
        const pos = (touch.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = Math.max(0, Math.min(duration, pos * duration));
    };

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen?.() || containerRef.current.webkitRequestFullscreen?.();
        } else {
            document.exitFullscreen?.() || document.webkitExitFullscreen?.();
        }
    };

    // Toggle mute
    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(!isMuted);
    };

    // Change playback speed
    const changeSpeed = (rate) => {
        if (!videoRef.current) return;
        videoRef.current.playbackRate = rate;
        setPlaybackRate(rate);
        setShowSpeedMenu(false);
    };

    // Show controls temporarily
    const showControlsTemporarily = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        // On mobile, always keep controls visible
        if (window.innerWidth <= 768) return;

        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            }
        }, 3000);
    };

    // Handle tap/click on video area
    const singleTapTimeoutRef = useRef(null);
    const tapCountRef = useRef(0);

    const handleVideoClick = (e) => {
        // Don't trigger if clicking on controls
        if (e.target.closest('.video-controls') || e.target.closest('.speed-menu')) {
            return;
        }

        tapCountRef.current++;

        if (tapCountRef.current === 1) {
            // First tap - wait to see if there's a second tap
            singleTapTimeoutRef.current = setTimeout(() => {
                if (tapCountRef.current === 1) {
                    // Single tap confirmed - toggle play
                    togglePlay();
                }
                tapCountRef.current = 0;
            }, 300);
        } else if (tapCountRef.current === 2) {
            // Double tap - toggle fullscreen
            clearTimeout(singleTapTimeoutRef.current);
            singleTapTimeoutRef.current = null;
            tapCountRef.current = 0;
            e.preventDefault();
            toggleFullscreen();
        }

        showControlsTemporarily();
    };

    // Handle touch for mobile
    const handleTouchEnd = (e) => {
        if (e.target.closest('.video-controls') || e.target.closest('.speed-menu') || e.target.closest('.center-play-btn')) {
            return;
        }
        e.preventDefault();
        handleVideoClick(e);
    };

    // Video event listeners
    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleTimeUpdate = () => setCurrentTime(videoEl.currentTime);
        const handleLoadedMetadata = () => setDuration(videoEl.duration);
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);

        videoEl.addEventListener('play', handlePlay);
        videoEl.addEventListener('pause', handlePause);
        videoEl.addEventListener('timeupdate', handleTimeUpdate);
        videoEl.addEventListener('loadedmetadata', handleLoadedMetadata);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            videoEl.removeEventListener('play', handlePlay);
            videoEl.removeEventListener('pause', handlePause);
            videoEl.removeEventListener('timeupdate', handleTimeUpdate);
            videoEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [video]);

    if (!video) {
        return (
            <div className="video-player-container">
                <div className="video-player-error">
                    <p>Video not found</p>
                </div>
            </div>
        );
    }

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div
            className={`video-player-container ${isFullscreen ? 'fullscreen' : ''}`}
            ref={containerRef}
            onMouseMove={showControlsTemporarily}
            onTouchStart={showControlsTemporarily}
        >
            {/* Video Element */}
            <div className="video-wrapper" onClick={handleVideoClick} onTouchEnd={handleTouchEnd}>
                <video
                    ref={videoRef}
                    src={video.streamUrl}
                    playsInline
                    preload="metadata"
                />

                {/* Center Play Button - Shows when paused */}
                {!isPlaying && (
                    <div
                        className="center-play-btn"
                        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                        onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); togglePlay(); }}
                    >
                        <svg viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                )}

                {/* Skip Indicators */}
                {showSkipIndicator && (
                    <div className={`skip-indicator skip-${showSkipIndicator}`}>
                        <div className="skip-icon">
                            {showSkipIndicator === 'backward' ? (
                                <><span>❮❮</span><span>10</span></>
                            ) : (
                                <><span>10</span><span>❯❯</span></>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Controls Bar */}
            <div className={`video-controls ${showControls || !isPlaying ? 'visible' : ''}`}>
                {/* Progress Bar */}
                <div
                    className="progress-bar"
                    ref={progressRef}
                    onClick={handleProgressClick}
                    onTouchMove={handleProgressTouch}
                >
                    <div className="progress-buffered"></div>
                    <div className="progress-played" style={{ width: `${progress}%` }}></div>
                    <div className="progress-handle" style={{ left: `${progress}%` }}></div>
                </div>

                {/* Controls Row */}
                <div className="controls-row">
                    {/* Play/Pause */}
                    <button className="control-btn" onClick={togglePlay}>
                        {isPlaying ? (
                            <svg viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                        )}
                    </button>

                    {/* Skip Backward */}
                    <button className="control-btn" onClick={() => skip(-10)}>
                        <svg viewBox="0 0 24 24" fill="white"><path d="M12.5 3C17.15 3 21.08 6.03 22.47 10.22L20.1 11C19.05 7.81 16.04 5.5 12.5 5.5C10.54 5.5 8.77 6.22 7.38 7.38L10 10H3V3L5.6 5.6C7.45 4 9.85 3 12.5 3M10 12V22H8V14H6V12H10M18 14V20C18 21.1 17.1 22 16 22H14C12.9 22 12 21.1 12 20V14C12 12.9 12.9 12 14 12H16C17.1 12 18 12.9 18 14M14 14V20H16V14H14Z" /></svg>
                    </button>

                    {/* Skip Forward */}
                    <button className="control-btn" onClick={() => skip(10)}>
                        <svg viewBox="0 0 24 24" fill="white"><path d="M11.5 3C6.85 3 2.92 6.03 1.53 10.22L3.9 11C4.95 7.81 7.96 5.5 11.5 5.5C13.46 5.5 15.23 6.22 16.62 7.38L14 10H21V3L18.4 5.6C16.55 4 14.15 3 11.5 3M10 12V22H8V14H6V12H10M18 14V20C18 21.1 17.1 22 16 22H14C12.9 22 12 21.1 12 20V14C12 12.9 12.9 12 14 12H16C17.1 12 18 12.9 18 14M14 14V20H16V14H14Z" /></svg>
                    </button>

                    {/* Time Display */}
                    <span className="time-display">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    {/* Spacer */}
                    <div className="controls-spacer"></div>

                    {/* Speed */}
                    <div className="speed-control">
                        <button className="control-btn speed-btn" onClick={() => setShowSpeedMenu(!showSpeedMenu)}>
                            {playbackRate}x
                        </button>
                        {showSpeedMenu && (
                            <div className="speed-menu">
                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                                    <button key={rate} className={playbackRate === rate ? 'active' : ''} onClick={() => changeSpeed(rate)}>
                                        {rate}x
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Mute */}
                    <button className="control-btn" onClick={toggleMute}>
                        {isMuted ? (
                            <svg viewBox="0 0 24 24" fill="white"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="white"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                        )}
                    </button>

                    {/* Fullscreen */}
                    <button className="control-btn" onClick={toggleFullscreen}>
                        {isFullscreen ? (
                            <svg viewBox="0 0 24 24" fill="white"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" /></svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="white"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" /></svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer;
