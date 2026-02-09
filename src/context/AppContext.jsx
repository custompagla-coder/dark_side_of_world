import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import driveService from '../services/driveService';

// Create context
const AppContext = createContext(null);

/**
 * Global App State Provider
 * Centralizes video data, user preferences, and loading states
 */
export function AppProvider({ children }) {
    // Video state
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // User preferences
    const [watchLaterIds, setWatchLaterIds] = useState(() => driveService.getWatchLater());
    const [theme, setTheme] = useState(() => localStorage.getItem('drivestream_theme') || 'dark');

    // Fetch videos on mount
    useEffect(() => {
        fetchVideos();
    }, []);

    // Sync watch later with localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            setWatchLaterIds(driveService.getWatchLater());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Fetch all videos
    const fetchVideos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedVideos = await driveService.fetchVideos();
            setVideos(fetchedVideos);
        } catch (err) {
            console.error('Error fetching videos:', err);
            setError(err.message || 'Failed to load videos');
        } finally {
            setLoading(false);
        }
    }, []);

    // Toggle watch later
    const toggleWatchLater = useCallback((videoId) => {
        const added = driveService.toggleWatchLater(videoId);
        setWatchLaterIds(driveService.getWatchLater());
        return added;
    }, []);

    // Check if video is in watch later
    const isInWatchLater = useCallback((videoId) => {
        return watchLaterIds.includes(videoId);
    }, [watchLaterIds]);

    // Get video by ID
    const getVideoById = useCallback((videoId) => {
        return videos.find(v => v.id === videoId);
    }, [videos]);

    // Get featured videos
    const getFeaturedVideos = useCallback(() => {
        return videos.filter(v => v.featured);
    }, [videos]);

    // Get watch later videos
    const getWatchLaterVideos = useCallback(() => {
        return videos.filter(v => watchLaterIds.includes(v.id));
    }, [videos, watchLaterIds]);

    // Filter videos by category
    const filterByCategory = useCallback((category) => {
        if (category === 'All') return videos;
        return videos.filter(v => {
            const cats = Array.isArray(v.category) ? v.category : [v.category];
            return cats.includes(category);
        });
    }, [videos]);

    // Search videos
    const searchVideos = useCallback((query) => {
        return driveService.searchVideos(videos, query);
    }, [videos]);

    // Toggle theme
    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('drivestream_theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }, [theme]);

    // Context value
    const value = {
        // State
        videos,
        loading,
        error,
        watchLaterIds,
        theme,

        // Actions
        fetchVideos,
        toggleWatchLater,
        isInWatchLater,
        getVideoById,
        getFeaturedVideos,
        getWatchLaterVideos,
        filterByCategory,
        searchVideos,
        toggleTheme,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

/**
 * Custom hook to use app context
 * @returns {Object} App context value
 */
export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

export default AppContext;
