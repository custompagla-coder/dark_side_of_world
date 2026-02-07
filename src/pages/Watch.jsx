import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import Loading from '../components/Loading';
import driveService from '../services/driveService';
import { formatDate } from '../utils/helpers';
import './Watch.css';

function Watch() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const [video, setVideo] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadVideo = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all videos
                const videos = await driveService.fetchVideos();

                // Find the current video
                const currentVideo = videos.find(v => v.id === videoId);

                if (!currentVideo) {
                    setError('Video not found');
                    setLoading(false);
                    return;
                }

                setVideo(currentVideo);

                // Get related videos (exclude current video, take first 6)
                const related = videos.filter(v => v.id !== videoId).slice(0, 6);
                setRelatedVideos(related);

            } catch (err) {
                console.error('Error loading video:', err);
                setError(err.message || 'Failed to load video');
            } finally {
                setLoading(false);
            }
        };

        loadVideo();

        // Scroll to top when video changes
        window.scrollTo(0, 0);
    }, [videoId]);

    if (loading) {
        return <Loading message="Loading video..." />;
    }

    if (error || !video) {
        return (
            <div className="watch-page">
                <div className="error-container">
                    <div className="error-card">
                        <span className="error-icon">❌</span>
                        <h2>{error || 'Video not found'}</h2>
                        <button
                            className="back-button"
                            onClick={() => navigate('/')}
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="watch-page">
            <div className="watch-container">
                {/* Video Player Section */}
                <div className="player-section">
                    <VideoPlayer video={video} />

                    {/* Video Info */}
                    <div className="video-details">
                        <h1 className="video-title">{video.title}</h1>

                        <div className="video-metadata">
                            <div className="metadata-item">
                                <span className="metadata-icon">📦</span>
                                <span className="metadata-text">{video.size}</span>
                            </div>
                            {video.resolution && (
                                <div className="metadata-item">
                                    <span className="metadata-icon">📺</span>
                                    <span className="metadata-text">{video.resolution}</span>
                                </div>
                            )}
                            {video.duration && (
                                <div className="metadata-item">
                                    <span className="metadata-icon">⏱️</span>
                                    <span className="metadata-text">{video.duration}</span>
                                </div>
                            )}
                            {video.createdTime && (
                                <div className="metadata-item">
                                    <span className="metadata-icon">📅</span>
                                    <span className="metadata-text">{formatDate(video.createdTime)}</span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="video-actions">
                            <a
                                href={video.downloadUrl}
                                download
                                className="action-button download-button"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span>⬇️</span>
                                Download
                            </a>
                            <Link to="/" className="action-button back-home-button">
                                <span>🏠</span>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Related Videos Sidebar */}
                {relatedVideos.length > 0 && (
                    <div className="related-section">
                        <h2 className="related-title">More Videos</h2>
                        <div className="related-videos">
                            {relatedVideos.map((relatedVideo) => (
                                <Link
                                    key={relatedVideo.id}
                                    to={`/watch/${relatedVideo.id}`}
                                    className="related-video-card"
                                >
                                    <div className="related-thumbnail">
                                        <img
                                            src={relatedVideo.thumbnail}
                                            alt={relatedVideo.title}
                                            loading="lazy"
                                        />
                                        {relatedVideo.duration && (
                                            <div className="related-duration">{relatedVideo.duration}</div>
                                        )}
                                    </div>
                                    <div className="related-info">
                                        <h3 className="related-video-title" title={relatedVideo.title}>
                                            {relatedVideo.title}
                                        </h3>
                                        {relatedVideo.size && (
                                            <p className="related-meta">{relatedVideo.size}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Watch;
