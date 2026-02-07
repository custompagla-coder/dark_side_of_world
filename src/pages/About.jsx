import { APP_CONFIG } from '../config/appConfig';
import './About.css';

function About() {
    return (
        <div className="about-page">
            <div className="about-container">
                <div className="about-hero">
                    <span className="about-logo">🎬</span>
                    <h1 className="about-title">{APP_CONFIG.name}</h1>
                    <p className="about-tagline">{APP_CONFIG.tagline}</p>
                </div>

                <div className="about-content">
                    <section className="about-section">
                        <h2>About This Platform</h2>
                        <p>{APP_CONFIG.description}</p>
                    </section>

                    <section className="features-section">
                        <h2>Features</h2>
                        <div className="features-grid">
                            {APP_CONFIG.features.map((feature, index) => (
                                <div key={index} className="feature-card">
                                    <span className="feature-icon">{feature.icon}</span>
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-description">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="tech-section">
                        <h2>Technology Stack</h2>
                        <div className="tech-grid">
                            <div className="tech-item">
                                <span className="tech-icon">⚛️</span>
                                <strong>React + Vite</strong>
                                <p>Modern frontend framework</p>
                            </div>
                            <div className="tech-item">
                                <span className="tech-icon">🎥</span>
                                <strong>Plyr.js</strong>
                                <p>Advanced video player</p>
                            </div>
                            <div className="tech-item">
                                <span className="tech-icon">☁️</span>
                                <strong>Google Drive API</strong>
                                <p>Cloud storage & streaming</p>
                            </div>
                            <div className="tech-item">
                                <span className="tech-icon">🎨</span>
                                <strong>CSS3</strong>
                                <p>Modern styling</p>
                            </div>
                        </div>
                    </section>

                    <section className="info-section">
                        <h2>Why DriveStream?</h2>
                        <div className="info-content">
                            <p>
                                <strong>No Backend Required:</strong> Everything runs in your browser. No need for
                                expensive servers or complex infrastructure.
                            </p>
                            <p>
                                <strong>Easy to Deploy:</strong> Build once, deploy anywhere. GitHub Pages, Netlify,
                                or Vercel - your choice!
                            </p>
                            <p>
                                <strong>Privacy Focused:</strong> No user tracking, no analytics, no cookies.
                                Your privacy is respected.
                            </p>
                            <p>
                                <strong>Open Source Ready:</strong> Clean, well-documented code that you can
                                customize to your needs.
                            </p>
                        </div>
                    </section>

                    <section className="cta-section">
                        <div className="cta-card">
                            <h2>Ready to Get Started?</h2>
                            <p>
                                Configure your Google Drive API credentials and start streaming your videos
                                in minutes!
                            </p>
                            <a href="/" className="cta-button">
                                Go to Home
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default About;
