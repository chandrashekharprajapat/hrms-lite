import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { employeeAPI, attendanceAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        presentToday: 0,
        absentToday: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch employees
            const employeesResponse = await employeeAPI.getAll();
            const totalEmployees = employeesResponse.data.length;

            // Fetch today's attendance
            const today = new Date().toISOString().split('T')[0];
            const attendanceResponse = await attendanceAPI.getAll(today);
            const todayAttendance = attendanceResponse.data;

            const presentToday = todayAttendance.filter(a => a.status === 'Present').length;
            const absentToday = todayAttendance.filter(a => a.status === 'Absent').length;

            setStats({ totalEmployees, presentToday, absentToday });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) return <LoadingSpinner message="Loading dashboard..." />;
    if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

    return (
        <div className="dashboard fade-in">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p className="text-muted">Welcome to HRMS Lite - Your HR Management Hub</p>
            </div>

            <div className="stats-grid">
                <Link to="/employees" className="stat-card stat-primary">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3 className="stat-value">{stats.totalEmployees}</h3>
                        <p className="stat-label">Total Employees</p>
                    </div>
                </Link>

                <div
                    className="stat-card stat-success clickable"
                    onClick={() => navigate('/attendance?status=Present')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <h3 className="stat-value">{stats.presentToday}</h3>
                        <p className="stat-label">Present Today</p>
                    </div>
                </div>

                <div
                    className="stat-card stat-danger clickable"
                    onClick={() => navigate('/attendance?status=Absent')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="stat-icon">❌</div>
                    <div className="stat-content">
                        <h3 className="stat-value">{stats.absentToday}</h3>
                        <p className="stat-label">Absent Today</p>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/employees/add" className="action-card">
                        <div className="action-icon">➕</div>
                        <h3>Add Employee</h3>
                        <p>Register a new employee in the system</p>
                    </Link>

                    <Link to="/attendance/mark" className="action-card">
                        <div className="action-icon">📝</div>
                        <h3>Mark Attendance</h3>
                        <p>Record employee attendance for today</p>
                    </Link>

                    <Link to="/employees" className="action-card">
                        <div className="action-icon">📋</div>
                        <h3>View Employees</h3>
                        <p>Browse and manage employee records</p>
                    </Link>

                    <Link to="/attendance" className="action-card">
                        <div className="action-icon">📊</div>
                        <h3>Attendance Records</h3>
                        <p>View and filter attendance history</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
