import { useState } from 'react';
import { useToast } from '../components/Toast';
import { DEVELOPER_CONFIG } from '../config/developerConfig';
import './About.css';

function About() {
    const toast = useToast();
    const [copiedField, setCopiedField] = useState(null);
    const [imageError, setImageError] = useState(false);

    const { name, role, bio, profilePicture, social, payments, footerText } = DEVELOPER_CONFIG;

    // Filter out empty social links
    const activeSocials = Object.entries(social).filter(([_, url]) => url);

    const socialIcons = {
        github: '🐙',
        facebook: '📘',
        email: '📧',
        twitter: '🐦',
        linkedin: '💼',
    };

    const copyToClipboard = async (text, name) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(name);
            toast.success(`${name} number copied!`);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            toast.error('Failed to copy');
        }
    };

    return (
        <div className="about-page">
            <div className="about-container">

                {/* Developer Section */}
                <section className="developer-section">
                    <div className="developer-avatar">
                        {profilePicture && !imageError ? (
                            <img
                                src={profilePicture}
                                alt={name}
                                className="avatar-image"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <span className="avatar-emoji">👨‍💻</span>
                        )}
                    </div>
                    <h1 className="developer-name">{name}</h1>
                    <p className="developer-role">{role}</p>
                    <p className="developer-bio">{bio}</p>

                    {activeSocials.length > 0 && (
                        <div className="social-links">
                            {activeSocials.map(([platform, url]) => (
                                <a
                                    key={platform}
                                    href={url}
                                    className="social-link"
                                    title={platform}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>{socialIcons[platform] || '🔗'}</span>
                                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                </a>
                            ))}
                        </div>
                    )}
                </section>

                {/* Buy Me a Coffee Section */}
                {payments.length > 0 && (
                    <section className="coffee-section">
                        <div className="coffee-header">
                            <span className="coffee-icon">☕</span>
                            <h2>Buy Us a Coffee</h2>
                            <p>If you enjoy using DarkStream, consider supporting the developer!</p>
                        </div>

                        <div className="payment-methods">
                            {payments.map((method) => (
                                <div
                                    key={method.name}
                                    className="payment-card"
                                    style={{ '--accent-color': method.color }}
                                >
                                    <div className="payment-header">
                                        <span className="payment-icon">{method.icon}</span>
                                        <span className="payment-name">{method.name}</span>
                                    </div>
                                    <div className="payment-number-wrapper">
                                        <span className="payment-number">{method.number}</span>
                                        <button
                                            className={`copy-btn ${copiedField === method.name ? 'copied' : ''}`}
                                            onClick={() => copyToClipboard(method.number, method.name)}
                                        >
                                            {copiedField === method.name ? '✓ Copied' : '📋 Copy'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="coffee-note">
                            💝 Every contribution helps keep this project running and improving!
                        </p>
                    </section>
                )}

                {/* Footer */}
                <div className="about-footer">
                    <p>{footerText}</p>
                </div>
            </div>
        </div>
    );
}

export default About;
