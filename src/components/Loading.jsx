import './Loading.css';

function Loading({ message = 'Loading...' }) {
    return (
        <div className="loading-screen">
            <div className="loading-content">
                <div className="loading-logo">🎬</div>
                <div className="loading-spinner-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <p className="loading-message">{message}</p>
            </div>
        </div>
    );
}

export default Loading;
