import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import './Toast.css';

// Toast Context for global access
const ToastContext = createContext(null);

// Toast types with icons
const TOAST_TYPES = {
    success: { icon: '✓', className: 'toast-success' },
    error: { icon: '✕', className: 'toast-error' },
    warning: { icon: '⚠', className: 'toast-warning' },
    info: { icon: 'ℹ', className: 'toast-info' },
};

// Individual Toast component
function ToastItem({ id, message, type = 'info', duration = 3000, onRemove }) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onRemove(id), 300); // Wait for exit animation
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onRemove]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(id), 300);
    };

    const { icon, className } = TOAST_TYPES[type] || TOAST_TYPES.info;

    return (
        <div className={`toast ${className} ${isExiting ? 'toast-exit' : 'toast-enter'}`}>
            <span className="toast-icon">{icon}</span>
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={handleClose} aria-label="Close">
                ✕
            </button>
        </div>
    );
}

// Toast Container - renders all toasts
function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} {...toast} onRemove={removeToast} />
            ))}
        </div>
    );
}

// Toast Provider component
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    // Helper methods for different toast types
    const toast = {
        success: (msg, duration) => addToast(msg, 'success', duration),
        error: (msg, duration) => addToast(msg, 'error', duration),
        warning: (msg, duration) => addToast(msg, 'warning', duration),
        info: (msg, duration) => addToast(msg, 'info', duration),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

// Custom hook to use toasts
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export default ToastProvider;
