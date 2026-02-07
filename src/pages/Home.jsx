import { useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import VideoGrid from '../components/VideoGrid';
import Loading from '../components/Loading';
import driveService from '../services/driveService';
import { APP_CONFIG } from '../config/appConfig';
import './Home.css';

function Home() {
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch videos on mount
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                setError(null);
                const fetchedVideos = await driveService.fetchVideos();
                setVideos(fetchedVideos);
                setFilteredVideos(fetchedVideos);
            } catch (err) {
                console.error('Error loading videos:', err);
                setError(err.message || 'Failed to load videos');
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    // Handle search
    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
        const filtered = driveService.searchVideos(videos, query);
        setFilteredVideos(filtered);
    }, [videos]);

    // Render error
    if (error) {
        return (
            <div className="home-page">
                <div className="error-container">
                    <div className="error-card">
                        <span className="error-icon">❌</span>
                        <h2>Error Loading Videos</h2>
                        <p>{error}</p>
                        <button
                            className="retry-button"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Render loading state
    if (loading) {
        return <Loading message="Loading videos from Google Drive..." />;
    }

    // Render videos
    return (
        <div className="home-page">
            <div className="hero-section">
                <h1 className="hero-title">{APP_CONFIG.name}</h1>
                <p className="hero-subtitle">{APP_CONFIG.tagline}</p>
            </div>

            <div className="home-content">
                {APP_CONFIG.enableSearch && videos.length > 0 && (
                    <SearchBar onSearch={handleSearch} />
                )}

                {searchQuery && (
                    <div className="search-results-info">
                        <p>
                            Found <strong>{filteredVideos.length}</strong> video{filteredVideos.length !== 1 ? 's' : ''}
                            {searchQuery && ` for "${searchQuery}"`}
                        </p>
                    </div>
                )}

                <VideoGrid videos={filteredVideos} loading={false} />
            </div>
        </div>
    );
}

export default Home;
