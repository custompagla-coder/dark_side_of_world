import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/helpers';
import { useToast } from './Toast';
import driveService from '../services/driveService';
import './VideoCard.css';

function VideoCard({ video, onWatchLaterChange }) {
    const navigate = useNavigate();
    const toast = useToast();
    const [thumbnailUrl, setThumbnailUrl] = useState(video.thumbnail);
    const [duration, setDuration] = useState(video.duration);
    const [isWatchLater, setIsWatchLater] = useState(false);

    useEffect(() => {
        setIsWatchLater(driveService.isInWatchLater(video.id));
    }, [video.id]);

    // Auto-generate thumbnail if missing or default
    useEffect(() => {
        // Only attempt if we have a URL and the current thumbnail is a data URI (gradient) or missing
        const isGradient = video.thumbnail && video.thumbnail.startsWith('data:image/svg+xml');
        if (video.url && (!video.thumbnail || isGradient)) {
            const videoElement = document.createElement('video');
            videoElement.src = video.url;
            videoElement.crossOrigin = 'anonymous'; // Attempt to bypass CORS for capture
            videoElement.currentTime = 5; // Capture at 5 seconds

            const onLoadedData = () => {
                // Video loaded, wait for seek
            };

            const onSeeked = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = videoElement.videoWidth;
                    canvas.height = videoElement.videoHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/jpeg');
                    setThumbnailUrl(dataUrl);

                    // Also try to get duration if missing
                    if (!duration && videoElement.duration) {
                        const mins = Math.floor(videoElement.duration / 60);
                        const secs = Math.floor(videoElement.duration % 60);
                        setDuration(`${mins}:${secs.toString().padStart(2, '0')}`);
                    }
                } catch (e) {
                    console.warn('Failed to capture thumbnail (likely CORS):', e);
                } finally {
                    // Cleanup
                    videoElement.remove();
                }
            };

            const onError = (e) => {
                console.warn('Error loading video for thumbnail:', e);
                videoElement.remove();
            };

            videoElement.addEventListener('loadeddata', onLoadedData);
            videoElement.addEventListener('seeked', onSeeked);
            videoElement.addEventListener('error', onError);

            // Trigger load (must be in document for some browsers, but often works detached)
            videoElement.preload = 'metadata';
        } else {
            setThumbnailUrl(video.thumbnail);
        }
    }, [video.url, video.thumbnail]);

    const handleClick = () => {
        navigate(`/watch/${video.id}`);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    const toggleWatchLater = (e) => {
        e.stopPropagation();
        const added = driveService.toggleWatchLater(video.id);
        setIsWatchLater(added);

        // Show toast notification
        if (added) {
            toast.success(`"${video.title}" added to Watch Later`);
        } else {
            toast.info(`"${video.title}" removed from Watch Later`);
        }

        if (onWatchLaterChange) {
            onWatchLaterChange(video.id, added);
        }
    };

    return (
        <div
            className="video-card"
            onClick={handleClick}
            onKeyPress={handleKeyPress}
            tabIndex={0}
            role="button"
            aria-label={`Play ${video.title}`}
        >
            <div className="video-thumbnail-wrapper">
                <img
                    src={thumbnailUrl || video.thumbnail}
                    alt={video.title}
                    className="video-thumbnail"
                    loading="lazy"
                    onError={(e) => {
                        // Fallback to gradient if image fails
                        if (video.thumbnail && video.thumbnail.startsWith('data:image/svg+xml')) {
                            e.target.src = video.thumbnail;
                        }
                    }}
                />

                <button
                    className={`watch-later-btn ${isWatchLater ? 'active' : ''}`}
                    onClick={toggleWatchLater}
                    title={isWatchLater ? "Remove from Watch Later" : "Watch Later"}
                    aria-label={isWatchLater ? "Remove from Watch Later" : "Watch Later"}
                >
                    {isWatchLater ? '✅' : '➕'}
                </button>

                <div className="video-overlay">
                    <div className="play-button">
                        <span className="play-icon">▶</span>
                    </div>
                </div>
                {duration && (
                    <div className="video-duration">{duration}</div>
                )}
                {video.resolution && (
                    <div className="video-resolution">{video.resolution}</div>
                )}
                {video.size && (
                    <div className="video-size-badge">{video.size}</div>
                )}
            </div>

            <div className="video-info">
                <h3 className="video-title" title={video.title}>
                    {video.title}
                </h3>
                <div className="video-meta">
                    {video.createdTime && (
                        <span className="video-date">📅 {formatDate(video.createdTime)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
