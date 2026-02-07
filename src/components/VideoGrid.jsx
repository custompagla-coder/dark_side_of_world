import VideoCard from './VideoCard';
import './VideoGrid.css';

function VideoGrid({ videos, loading }) {
    if (loading) {
        return (
            <div className="video-grid-loading">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading videos...</p>
                </div>
            </div>
        );
    }

    if (!videos || videos.length === 0) {
        return (
            <div className="video-grid-empty">
                <div className="empty-state">
                    <span className="empty-icon">📹</span>
                    <h3>No videos found</h3>
                    <p>Try a different search term or check your Drive configuration.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="video-grid">
            {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );
}

export default VideoGrid;
