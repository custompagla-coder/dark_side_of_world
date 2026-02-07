import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/helpers';
import './VideoCard.css';

function VideoCard({ video }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/watch/${video.id}`);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
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
                    src={video.thumbnail}
                    alt={video.title}
                    className="video-thumbnail"
                    loading="lazy"
                />
                <div className="video-overlay">
                    <div className="play-button">
                        <span className="play-icon">▶</span>
                    </div>
                </div>
                {video.duration && (
                    <div className="video-duration">{video.duration}</div>
                )}
                {video.resolution && (
                    <div className="video-resolution">{video.resolution}</div>
                )}
            </div>

            <div className="video-info">
                <h3 className="video-title" title={video.title}>
                    {video.title}
                </h3>
                <div className="video-meta">
                    {video.size && (
                        <span className="video-size">📦 {video.size}</span>
                    )}
                    {video.createdTime && (
                        <span className="video-date">📅 {formatDate(video.createdTime)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
