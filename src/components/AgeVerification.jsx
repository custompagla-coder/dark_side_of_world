import { useState, useEffect } from 'react';
import './AgeVerification.css';

function AgeVerification({ children }) {
    const [isVerified, setIsVerified] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Check if user already verified
        const verified = localStorage.getItem('age_verified');
        if (verified === 'true') {
            setIsVerified(true);
        }
        setIsChecking(false);
    }, []);

    const handleVerify = () => {
        localStorage.setItem('age_verified', 'true');
        setIsVerified(true);
    };

    const handleExit = () => {
        window.location.href = 'https://google.com';
    };

    // Still checking localStorage
    if (isChecking) {
        return null;
    }

    // Not verified - show popup
    if (!isVerified) {
        return (
            <div className="age-verification-overlay">
                <div className="age-verification-modal">
                    <div className="warning-icon">⚠️</div>
                    <h1>সতর্কতা / Warning</h1>
                    <h2>১৮+ কন্টেন্ট</h2>

                    <div className="warning-text">
                        <p>
                            এই ওয়েবসাইটে প্রাপ্তবয়স্কদের জন্য কন্টেন্ট রয়েছে।
                            প্রবেশ করতে আপনাকে অবশ্যই ১৮ বছর বা তার বেশি বয়সী হতে হবে।
                        </p>
                        <p className="english-text">
                            This website contains adult content.
                            You must be 18 years or older to enter.
                        </p>
                    </div>

                    <div className="age-buttons">
                        <button className="btn-enter" onClick={handleVerify}>
                            আমার বয়স ১৮+
                            <span>I am 18+</span>
                        </button>
                        <button className="btn-exit" onClick={handleExit}>
                            বের হও
                            <span>Exit</span>
                        </button>
                    </div>

                    <p className="disclaimer">
                        এই সাইটে প্রবেশ করে আপনি নিশ্চিত করছেন যে আপনি প্রাপ্তবয়স্ক এবং
                        আপনার এলাকায় এই ধরনের কন্টেন্ট দেখা বৈধ।
                    </p>
                </div>
            </div>
        );
    }

    // Verified - show the app
    return children;
}

export default AgeVerification;
