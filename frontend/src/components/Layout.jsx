import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
    const location = useLocation();

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
                            <span className="logo-text">HRMS Lite</span>
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
                    <p className="footer-text">© 2026 HRMS Lite. Built with ❤️ for efficient HR management.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
