import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { attendanceAPI, employeeAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import './AttendanceRecords.css';

const AttendanceRecords = () => {
    const [searchParams] = useSearchParams();
    const [records, setRecords] = useState([]);
    const [employees, setEmployees] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState(searchParams.get('date') || '');
    const [employeeFilter, setEmployeeFilter] = useState(searchParams.get('employee') || '');
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch attendance records
            const attendanceResponse = await attendanceAPI.getAll(dateFilter);
            setRecords(attendanceResponse.data);

            // Fetch employees to display names
            const employeesResponse = await employeeAPI.getAll();
            const employeeMap = {};
            employeesResponse.data.forEach(emp => {
                employeeMap[emp.employee_id] = emp;
            });
            setEmployees(employeeMap);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load attendance records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dateFilter]);

    const filteredRecords = records.filter(record => {
        if (employeeFilter && record.employee_id !== employeeFilter) return false;
        if (statusFilter && record.status !== statusFilter) return false;
        return true;
    });

    const uniqueEmployeeIds = [...new Set(records.map(r => r.employee_id))];

    if (loading) return <LoadingSpinner message="Loading attendance records..." />;
    if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

    return (
        <div className="attendance-records fade-in">
            <div className="page-header">
                <div>
                    <h1>Attendance Records</h1>
                    <p className="text-muted">View and filter employee attendance history</p>
                </div>
                <Link to="/attendance/mark" className="btn btn-primary">
                    📝 Mark Attendance
                </Link>
            </div>

            {records.length === 0 && !dateFilter ? (
                <EmptyState
                    icon="📊"
                    title="No Attendance Records"
                    message="Start tracking attendance by marking employee presence"
                    action={
                        <Link to="/attendance/mark" className="btn btn-primary">
                            Mark First Attendance
                        </Link>
                    }
                />
            ) : (
                <>
                    <div className="filters">
                        <div className="filter-group">
                            <label htmlFor="dateFilter" className="form-label">
                                Filter by Date
                            </label>
                            <input
                                type="date"
                                id="dateFilter"
                                className="form-input"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <label htmlFor="employeeFilter" className="form-label">
                                Filter by Employee
                            </label>
                            <select
                                id="employeeFilter"
                                className="form-select"
                                value={employeeFilter}
                                onChange={(e) => setEmployeeFilter(e.target.value)}
                            >
                                <option value="">All Employees</option>
                                {uniqueEmployeeIds.map(empId => (
                                    <option key={empId} value={empId}>
                                        {employees[empId]?.full_name || empId}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="statusFilter" className="form-label">
                                Filter by Status
                            </label>
                            <select
                                id="statusFilter"
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="Present">✅ Present</option>
                                <option value="Absent">❌ Absent</option>
                            </select>
                        </div>

                        {(dateFilter || employeeFilter || statusFilter) && (
                            <button
                                onClick={() => {
                                    setDateFilter('');
                                    setEmployeeFilter('');
                                    setStatusFilter('');
                                }}
                                className="btn btn-secondary clear-filters"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {filteredRecords.length === 0 ? (
                        <EmptyState
                            icon="🔍"
                            title="No Records Found"
                            message="No attendance records match your filters"
                        />
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Employee ID</th>
                                        <th>Employee Name</th>
                                        <th>Department</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecords.map((record, index) => {
                                        const employee = employees[record.employee_id];
                                        return (
                                            <tr key={`${record.employee_id}-${record.date}-${index}`}>
                                                <td>{new Date(record.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}</td>
                                                <td><strong>{record.employee_id}</strong></td>
                                                <td>{employee?.full_name || 'Unknown'}</td>
                                                <td>
                                                    <span className="department-badge">
                                                        {employee?.department || 'N/A'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${record.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                                                        {record.status === 'Present' ? '✅' : '❌'} {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="records-summary">
                        <p className="text-muted">
                            Showing {filteredRecords.length} of {records.length} records
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default AttendanceRecords;
