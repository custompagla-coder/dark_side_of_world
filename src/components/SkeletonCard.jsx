import './SkeletonCard.css';

/**
 * Skeleton loading placeholder for video cards
 * Shows a pulsating animation while content loads
 */
function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-thumbnail">
                <div className="skeleton-play"></div>
            </div>
            <div className="skeleton-info">
                <div className="skeleton-title"></div>
                <div className="skeleton-meta"></div>
            </div>
        </div>
    );
}

/**
 * Grid of skeleton cards for loading state
 */
export function SkeletonGrid({ count = 8 }) {
    return (
        <div className="skeleton-grid">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
}

export default SkeletonCard;
