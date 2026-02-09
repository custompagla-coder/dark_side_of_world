import { MANUAL_VIDEOS, MANUAL_CONFIG } from '../config/videoList';
import Fuse from 'fuse.js';

/**
 * Video Service
 * Handles video list and formatting
 */

class DriveService {
    constructor() {
        this.cache = null;
        this.cacheTimestamp = null;
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Fetch all videos from the configured source
     * @returns {Promise<Array>} Array of video objects
     */
    async fetchVideos() {
        // Manual mode - use video list from config
        if (MANUAL_CONFIG.ENABLED && MANUAL_VIDEOS.length > 0) {
            console.log('📹 MANUAL MODE - Using video list from config');
            console.log(`Found ${MANUAL_VIDEOS.length} videos in manual list`);
            return this.formatManualVideos(MANUAL_VIDEOS);
        }

        // Check cache first
        if (this.cache && this.cacheTimestamp && Date.now() - this.cacheTimestamp < this.cacheDuration) {
            console.log('Returning cached video data');
            return this.cache;
        }

        // No videos configured
        console.warn('⚠️ No videos found. Add videos to src/config/videoList.js');
        return [];
    }

    /**
     * Format manual video list entries
     * @param {Array} videos - Manual video list
     * @returns {Array} Formatted video objects
     */
    formatManualVideos(videos) {
        return videos.map((video, index) => {
            // Parse duration if provided
            let durationSeconds = null;
            if (video.duration) {
                const parts = video.duration.split(':').map(Number);
                if (parts.length === 2) {
                    durationSeconds = parts[0] * 60 + parts[1]; // MM:SS
                } else if (parts.length === 3) {
                    durationSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
                }
            }

            // Generate gradient thumbnail if not provided
            const gradients = [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            ];

            const defaultThumbnail = video.thumbnail || this.generateThumbnailDataUri(
                video.title || `Video ${index + 1}`,
                gradients[index % gradients.length]
            );

            return {
                id: video.id || `manual-${index + 1}`,
                title: video.title || `Video ${index + 1}`,
                fileName: video.title || `video-${index + 1}.mp4`,
                thumbnail: defaultThumbnail,
                streamUrl: video.url,
                downloadUrl: video.url,
                mimeType: 'video/mp4',
                size: video.size || 'Unknown',
                sizeBytes: 0,
                duration: video.duration || null,
                durationSeconds: durationSeconds,
                width: null,
                height: null,
                resolution: video.resolution || null,
                resolution: video.resolution || null,
                category: Array.isArray(video.category) ? video.category : (video.category ? [video.category] : ['Uncategorized']),
                featured: video.featured || false,
                createdTime: new Date(),
                modifiedTime: new Date(),
                fileExtension: 'mp4',
            };
        });
    }

    /**
     * Generate thumbnail data URI with gradient
     * @param {string} title - Video title
     * @param {string} gradient - CSS gradient
     * @returns {string} Data URI
     */
    generateThumbnailDataUri(title, gradient) {
        // Create SVG thumbnail - escape title for safety
        const safeTitle = title.substring(0, 20).replace(/[<>&"']/g, '');
        const svg = `
            <svg width="720" height="405" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="720" height="405" fill="url(#grad)"/>
                <circle cx="360" cy="202.5" r="40" fill="rgba(230, 57, 70, 0.9)"/>
                <polygon points="350,185 350,220 380,202.5" fill="white"/>
                <text x="360" y="300" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.9)" text-anchor="middle">${safeTitle}</text>
            </svg>
        `;
        // Use encodeURIComponent for Unicode support instead of btoa
        return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }

    /**
     * Clean video title (remove file extension)
     * @param {string} fileName - Original file name
     * @returns {string} Cleaned title
     */
    cleanTitle(fileName) {
        return fileName.replace(/\.(mp4|webm|mov|mkv)$/i, '');
    }

    /**
     * Format file size to human-readable format
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted size
     */
    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Format duration from milliseconds to readable format
     * @param {number} milliseconds - Duration in milliseconds
     * @returns {string} Formatted duration (e.g., "1:23:45" or "12:34")
     */
    formatDuration(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }

    /**
     * Search/filter videos by query
     * @param {Array} videos - Array of video objects
     * @param {string} query - Search query
     * @returns {Array} Filtered videos
     */
    searchVideos(videos, query) {
        if (!query || query.trim() === '') {
            return videos;
        }

        const options = {
            keys: ['title', 'fileName'],
            threshold: 0.4,
            distance: 100,
            minMatchCharLength: 2,
            shouldSort: true
        };

        const fuse = new Fuse(videos, options);
        return fuse.search(query).map(result => result.item);
    }

    /**
     * Sort videos by different criteria
     * @param {Array} videos - Array of video objects
     * @param {string} sortBy - Sort criteria (newest, oldest, title, size)
     * @returns {Array} Sorted videos
     */
    sortVideos(videos, sortBy = 'newest') {
        const sorted = [...videos];

        switch (sortBy) {
            case 'newest':
                return sorted.sort((a, b) => b.createdTime - a.createdTime);
            case 'oldest':
                return sorted.sort((a, b) => a.createdTime - b.createdTime);
            case 'title':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'size':
                return sorted.sort((a, b) => b.sizeBytes - a.sizeBytes);
            default:
                return sorted;
        }
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache = null;
        this.cacheTimestamp = null;
    }

    // --- User Preferences (LocalStorage) ---

    /**
     * Get Watch Later list
     * @returns {Array} Array of video IDs
     */
    getWatchLater() {
        try {
            return JSON.parse(localStorage.getItem('drivestream_watch_later')) || [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Toggle Watch Later status
     * @param {string} videoId 
     * @returns {boolean} New status (true = added, false = removed)
     */
    toggleWatchLater(videoId) {
        const list = this.getWatchLater();
        const index = list.indexOf(videoId);
        let added = false;

        if (index === -1) {
            list.push(videoId);
            added = true;
        } else {
            list.splice(index, 1);
        }

        localStorage.setItem('drivestream_watch_later', JSON.stringify(list));
        return added;
    }

    /**
     * Check if video is in Watch Later
     * @param {string} videoId 
     * @returns {boolean}
     */
    isInWatchLater(videoId) {
        const list = this.getWatchLater();
        return list.includes(videoId);
    }

    /**
     * Save playback progress
     * @param {string} videoId 
     * @param {number} time (seconds)
     */
    saveProgress(videoId, time) {
        try {
            const history = JSON.parse(localStorage.getItem('drivestream_history')) || {};
            history[videoId] = {
                time,
                updatedAt: Date.now()
            };
            localStorage.setItem('drivestream_history', JSON.stringify(history));
        } catch (e) { }
    }

    /**
     * Get saved progress
     * @param {string} videoId 
     * @returns {number} Time in seconds or 0
     */
    getProgress(videoId) {
        try {
            const history = JSON.parse(localStorage.getItem('drivestream_history')) || {};
            return history[videoId]?.time || 0;
        } catch (e) {
            return 0;
        }
    }
}

// Export singleton instance
export default new DriveService();
