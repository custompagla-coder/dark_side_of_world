import { useState } from 'react';
import SEO from '../components/SEO';
import './Stories.css';

function Stories() {
    const [stories] = useState([
        // Add your stories here - example format:
        // { id: 1, title: 'Story Title', thumbnail: 'url', duration: '2:30' }
    ]);

    return (
        <div className="stories-page">
            <SEO
                title="Stories - DarkStream"
                description="Watch short video stories on DarkStream"
            />

            <div className="stories-header">
                <h1>📖 ১৮+ গল্প</h1>
                <p>Short video stories - Coming Soon!</p>
            </div>

            {stories.length === 0 ? (
                <div className="stories-empty">
                    <div className="empty-icon">🎬</div>
                    <h2>Wait is not over yet</h2>
                    <p>The page is under construction.</p>
                    <p className="hint">Coming soon...</p>
                </div>
            ) : (
                <div className="stories-grid">
                    {stories.map((story) => (
                        <div key={story.id} className="story-card">
                            <img src={story.thumbnail} alt={story.title} />
                            <div className="story-info">
                                <span className="story-duration">{story.duration}</span>
                                <h3>{story.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Stories;
