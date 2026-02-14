import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Oops! Something went wrong</h3>
            <p className="error-message">{message || 'An unexpected error occurred'}</p>
            {onRetry && (
                <button onClick={onRetry} className="btn btn-primary mt-2">
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
