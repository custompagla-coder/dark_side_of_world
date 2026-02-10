// Application Configuration

export const APP_CONFIG = {
    // App name
    name: 'DarkStream',

    // App tagline
    tagline: 'Stream Your Videos, Your Way',

    // Description for About page
    description: 'A modern, lightweight video streaming platform powered by Google Drive. No backend, no complexity - just your videos, beautifully presented.',

    // Features list for About page
    features: [
        {
            title: 'Simple & Fast',
            description: 'No server required. All videos stream directly from Google Drive.',
            icon: '⚡'
        },
        {
            title: 'Fully Responsive',
            description: 'Beautiful experience on desktop, tablet, and mobile devices.',
            icon: '📱'
        },
        {
            title: 'Modern Player',
            description: 'Advanced controls, keyboard shortcuts, and playback speed options.',
            icon: '🎬'
        },
        {
            title: 'Easy Management',
            description: 'Add or remove videos by simply updating your Google Drive folder.',
            icon: '📂'
        }
    ],

    // Enable/disable features
    enableSearch: true,
    enableAboutPage: true,

    // Categories for filtering videos (customize this list)
    categories: [
        'All',
        'New',
        'পারিবারিক',
        'বাচ্চাদের সেক্স',
        'অন্যান্য',
        "রেপ",
    ],

    // Videos per page (for future pagination)
    videosPerPage: 12,

    // Cache duration in milliseconds (5 minutes)
    cacheDuration: 5 * 60 * 1000,
};
