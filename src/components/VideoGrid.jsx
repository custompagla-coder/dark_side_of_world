import VideoCard from './VideoCard';
import { SkeletonGrid } from './SkeletonCard';
import './VideoGrid.css';

function VideoGrid({ videos, loading, onWatchLaterChange }) {
    if (loading) {
        return <SkeletonGrid count={8} />;
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
                <VideoCard
                    key={video.id}
                    video={video}
                    onWatchLaterChange={onWatchLaterChange}
                />
            ))}
        </div>
    );
}

export default VideoGrid;

