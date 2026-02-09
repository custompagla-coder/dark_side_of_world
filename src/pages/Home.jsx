import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import VideoGrid from '../components/VideoGrid';
import Loading from '../components/Loading';
import SEO from '../components/SEO';
import driveService from '../services/driveService';
import { APP_CONFIG } from '../config/appConfig';
import './Home.css';

function Home() {
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [featuredVideos, setFeaturedVideos] = useState([]);
    const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
    const categoryScrollRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeTab, setActiveTab] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;

    const categories = APP_CONFIG.categories || ['All'];

    // Fetch videos on mount
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                setError(null);
                const fetchedVideos = await driveService.fetchVideos();
                setVideos(fetchedVideos);
                setFilteredVideos(fetchedVideos);

                // Select featured videos
                const manualFeatured = fetchedVideos.filter(v => v.featured);

                if (manualFeatured.length > 0) {
                    setFeaturedVideos(manualFeatured);
                } else if (fetchedVideos.length > 0) {
                    // Fallback to random if no manual featured videos
                    const shuffled = [...fetchedVideos].sort(() => 0.5 - Math.random());
                    setFeaturedVideos(shuffled.slice(0, 5));
                }
            } catch (err) {
                console.error('Error loading videos:', err);
                setError(err.message || 'Failed to load videos');
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    // Auto-rotate featured videos every 5 seconds
    useEffect(() => {
        if (featuredVideos.length <= 1) return;

        const autoRotate = setInterval(() => {
            setCurrentFeaturedIndex((prev) => (prev + 1) % featuredVideos.length);
        }, 5000); // 5 seconds

        return () => clearInterval(autoRotate);
    }, [featuredVideos.length]);

    // Featured Navigation
    const nextFeatured = () => {
        setCurrentFeaturedIndex((prev) => (prev + 1) % featuredVideos.length);
    };

    const prevFeatured = () => {
        setCurrentFeaturedIndex((prev) => (prev - 1 + featuredVideos.length) % featuredVideos.length);
    };

    // Category Scroll
    const scrollCategories = (direction) => {
        if (categoryScrollRef.current) {
            const scrollAmount = 200;
            categoryScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Filter Logic
    useEffect(() => {
        let result = videos;

        // 1. Filter by Tab (Saved/All)
        if (activeTab === 'saved') {
            const savedIds = driveService.getWatchLater();
            result = result.filter(v => savedIds.includes(v.id));
        }

        // 2. Filter by Search
        if (searchQuery) {
            result = driveService.searchVideos(result, searchQuery);
        }

        // 3. Filter by Category (Only if not in 'saved' tab and category is not 'All')
        if (activeTab === 'all' && selectedCategory !== 'All') {
            result = result.filter(v => Array.isArray(v.category) ? v.category.includes(selectedCategory) : v.category === selectedCategory);
        }

        setFilteredVideos(result);
        setCurrentPage(1); // Reset to page 1 on filter change
    }, [videos, activeTab, searchQuery, selectedCategory]);

    // Handle search
    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'saved') setSelectedCategory('All');
    };

    // Handle category change
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    // Pagination Logic
    const indexOfLastVideo = currentPage * itemsPerPage;
    const indexOfFirstVideo = indexOfLastVideo - itemsPerPage;
    const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Watch Later Handler
    const handleWatchLaterChange = (videoId, added) => {
        if (activeTab === 'saved' && !added) {
            // Trigger re-filter via dependency update (simplified)
            // Actually, we need to update the filtered list directly or trigger effect
            const savedIds = driveService.getWatchLater();
            // Force update or let effect handle it? Effect depends on videos, not directly on local storage.
            // Let's manually update filteredVideos for immediate feedback
            setFilteredVideos(prev => prev.filter(v => v.id !== videoId));
        }
    };

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
        return <Loading message="Loading videos..." />;
    }

    // Render videos
    return (
        <div className="home-page">
            <SEO
                title={activeTab === 'saved' ? 'Watch Later' : 'Home'}
                description={APP_CONFIG.description}
            />
            {/* Hero Section - Only show on 'All' category and no search */}
            {selectedCategory === 'All' && !searchQuery && (
                <div className="hero-section">
                    {featuredVideos.length > 0 ? (
                        <>
                            <div className="hero-backdrop">
                                <img
                                    src={featuredVideos[currentFeaturedIndex].thumbnail}
                                    alt={featuredVideos[currentFeaturedIndex].title}
                                    key={featuredVideos[currentFeaturedIndex].id} // Force re-render for animation
                                />
                                <div className="hero-overlay"></div>
                            </div>
                            <div className="hero-content">
                                <span className="hero-badge">Featured</span>
                                <h1 className="hero-title">{featuredVideos[currentFeaturedIndex].title}</h1>
                                <p className="hero-subtitle">
                                    {featuredVideos[currentFeaturedIndex].description || APP_CONFIG.tagline}
                                </p>
                                <div className="hero-buttons">
                                    <button
                                        className="btn-primary"
                                        onClick={() => navigate(`/watch/${featuredVideos[currentFeaturedIndex].id}`)}
                                    >
                                        ▶ Watch Now
                                    </button>
                                    {featuredVideos[currentFeaturedIndex].duration && (
                                        <span className="hero-info-badge">⏱️ {featuredVideos[currentFeaturedIndex].duration}</span>
                                    )}
                                </div>
                            </div>

                            {/* Carousel Controls */}
                            <button className="carousel-btn prev" onClick={prevFeatured}>❮</button>
                            <button className="carousel-btn next" onClick={nextFeatured}>❯</button>

                            {/* Carousel Indicators */}
                            <div className="carousel-indicators">
                                {featuredVideos.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`indicator ${index === currentFeaturedIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentFeaturedIndex(index)}
                                    ></span>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="hero-content center">
                            <h1 className="hero-title center">{APP_CONFIG.name}</h1>
                            <p className="hero-subtitle">{APP_CONFIG.tagline}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="home-content container">

                {/* Search Bar */}
                {APP_CONFIG.enableSearch && videos.length > 0 && (
                    <div className="main-search-container" style={{ marginBottom: '2rem' }}>
                        <SearchBar onSearch={handleSearch} />
                    </div>
                )}

                {/* Category Filter */}
                <div className="category-scroll-wrapper">
                    <button className="category-scroll-btn left" onClick={() => scrollCategories('left')}>❮</button>
                    <div className="category-filter" ref={categoryScrollRef}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <button className="category-scroll-btn right" onClick={() => scrollCategories('right')}>❯</button>
                </div>

                {searchQuery && (
                    <div className="search-results-info">
                        <p>
                            Found <strong>{filteredVideos.length}</strong> video{filteredVideos.length !== 1 ? 's' : ''}
                            {searchQuery && ` for "${searchQuery}"`}
                        </p>
                    </div>
                )}

                {filteredVideos.length === 0 && selectedCategory === 'Saved' && !searchQuery && (
                    <div className="empty-state">
                        <span className="empty-icon">📂</span>
                        <h3>No saved videos yet</h3>
                        <p>Videos you add to Watch Later will appear here.</p>
                        <button className="btn-secondary" onClick={() => handleCategoryChange('All')}>
                            Browse Videos
                        </button>
                    </div>
                )}

                <VideoGrid videos={currentVideos} loading={false} onWatchLaterChange={handleWatchLaterChange} />

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="page-btn"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &lt; Prev
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => paginate(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="page-btn"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next &gt;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
