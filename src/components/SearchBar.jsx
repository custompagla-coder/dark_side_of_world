import { useState, useEffect } from 'react';
import { debounce } from '../utils/helpers';
import './SearchBar.css';

function SearchBar({ onSearch, placeholder = 'Search videos...' }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Debounced search
    useEffect(() => {
        const debouncedSearch = debounce(() => {
            onSearch(searchTerm);
        }, 300);

        debouncedSearch();
    }, [searchTerm, onSearch]);

    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <div className="search-bar">
            <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    className="search-input"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button className="search-clear" onClick={handleClear} aria-label="Clear search">
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
