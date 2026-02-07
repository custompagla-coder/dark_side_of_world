import { Link, useLocation } from 'react-router-dom';
import { APP_CONFIG } from '../config/appConfig';
import './Navbar.css';

function Navbar() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">🎬</span>
                    <span className="brand-name">{APP_CONFIG.name}</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/" className={`nav-link ${isActive('/')}`}>
                        <span className="nav-icon">🏠</span>
                        <span className="nav-text">Home</span>
                    </Link>
                    {APP_CONFIG.enableAboutPage && (
                        <Link to="/about" className={`nav-link ${isActive('/about')}`}>
                            <span className="nav-icon">ℹ️</span>
                            <span className="nav-text">About</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
