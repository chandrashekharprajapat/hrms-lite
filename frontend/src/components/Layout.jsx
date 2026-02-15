import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
    const location = useLocation();
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="layout">
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <Link to="/" className="logo">
                            <span className="logo-icon">👥</span>
                            <span className="logo-text">HRMS</span>
                        </Link>
                        <nav className="nav">
                            <Link to="/" className={`nav-link ${isActive('/')}`}>
                                Dashboard
                            </Link>
                            <Link to="/employees" className={`nav-link ${isActive('/employees')}`}>
                                Employees
                            </Link>
                            <Link to="/attendance" className={`nav-link ${isActive('/attendance')}`}>
                                Attendance
                            </Link>
                        </nav>
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle"
                            aria-label="Toggle theme"
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                    </div>
                </div>
            </header>
            <main className="main">
                <div className="container">
                    {children}
                </div>
            </main>
            <footer className="footer">
                <div className="container">
                    <p className="footer-text">© 2026 HRMS. Built with ❤️ for efficient HR management.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
