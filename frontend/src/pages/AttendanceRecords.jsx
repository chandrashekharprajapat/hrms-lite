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
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [editModal, setEditModal] = useState({ show: false, record: null });
    const [deleteModal, setDeleteModal] = useState({ show: false, records: [] });
    const [processing, setProcessing] = useState(false);

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
        setSelectedRecords([]); // Clear selection when filters change
    }, [dateFilter]);

    const filteredRecords = records.filter(record => {
        if (employeeFilter && record.employee_id !== employeeFilter) return false;
        if (statusFilter && record.status !== statusFilter) return false;
        return true;
    });

    const uniqueEmployeeIds = [...new Set(records.map(r => r.employee_id))];

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRecords(filteredRecords.map(r => `${r.employee_id}-${r.date}`));
        } else {
            setSelectedRecords([]);
        }
    };

    const handleSelectRecord = (record) => {
        const key = `${record.employee_id}-${record.date}`;
        if (selectedRecords.includes(key)) {
            setSelectedRecords(selectedRecords.filter(k => k !== key));
        } else {
            setSelectedRecords([...selectedRecords, key]);
        }
    };

    const handleEditClick = (record) => {
        setEditModal({ show: true, record: { ...record } });
    };

    const handleEditSave = async () => {
        try {
            setProcessing(true);
            await attendanceAPI.update(
                editModal.record.employee_id,
                editModal.record.date,
                {
                    employee_id: editModal.record.employee_id,
                    date: editModal.record.date,
                    status: editModal.record.status
                }
            );
            await fetchData();
            setEditModal({ show: false, record: null });
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to update attendance');
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteSelected = () => {
        const recordsToDelete = filteredRecords.filter(r =>
            selectedRecords.includes(`${r.employee_id}-${r.date}`)
        );
        setDeleteModal({ show: true, records: recordsToDelete });
    };

    const handleDeleteConfirm = async () => {
        try {
            setProcessing(true);
            const recordsData = deleteModal.records.map(r => ({
                employee_id: r.employee_id,
                date: r.date
            }));
            await attendanceAPI.bulkDelete(recordsData);
            await fetchData();
            setSelectedRecords([]);
            setDeleteModal({ show: false, records: [] });
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to delete attendance records');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <LoadingSpinner message="Loading attendance records..." />;
    if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

    return (
        <div className="attendance-records fade-in">
            <div className="page-header">
                <div>
                    <h1>Attendance Records</h1>
                    <p className="text-muted">View and manage employee attendance history</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {selectedRecords.length > 0 && (
                        <button onClick={handleDeleteSelected} className="btn btn-danger">
                            🗑️ Delete Selected ({selectedRecords.length})
                        </button>
                    )}
                    <Link to="/attendance/mark" className="btn btn-primary">
                        📝 Mark Attendance
                    </Link>
                </div>
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
                                        <th style={{ width: '50px' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedRecords.length === filteredRecords.length && filteredRecords.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th>Date</th>
                                        <th>Employee ID</th>
                                        <th>Employee Name</th>
                                        <th>Department</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecords.map((record, index) => {
                                        const employee = employees[record.employee_id];
                                        const recordKey = `${record.employee_id}-${record.date}`;
                                        return (
                                            <tr key={`${record.employee_id}-${record.date}-${index}`}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRecords.includes(recordKey)}
                                                        onChange={() => handleSelectRecord(record)}
                                                    />
                                                </td>
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
                                                <td>
                                                    <button
                                                        onClick={() => handleEditClick(record)}
                                                        className="btn-edit"
                                                        title="Edit attendance"
                                                    >
                                                        ✏️
                                                    </button>
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
                            {selectedRecords.length > 0 && ` • ${selectedRecords.length} selected`}
                        </p>
                    </div>
                </>
            )}

            {/* Edit Modal */}
            {editModal.show && (
                <div className="modal-overlay" onClick={() => setEditModal({ show: false, record: null })}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Attendance</h2>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Employee</label>
                            <input
                                type="text"
                                className="form-input"
                                value={employees[editModal.record.employee_id]?.full_name || editModal.record.employee_id}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={editModal.record.date}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                value={editModal.record.status}
                                onChange={(e) => setEditModal({
                                    ...editModal,
                                    record: { ...editModal.record, status: e.target.value }
                                })}
                            >
                                <option value="Present">✅ Present</option>
                                <option value="Absent">❌ Absent</option>
                            </select>
                        </div>
                        <div className="modal-footer">
                            <button
                                onClick={() => setEditModal({ show: false, record: null })}
                                className="btn btn-secondary"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                className="btn btn-primary"
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="modal-overlay" onClick={() => setDeleteModal({ show: false, records: [] })}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Confirm Deletion</h2>
                        </div>
                        <p>
                            Are you sure you want to delete <strong>{deleteModal.records.length}</strong> attendance record(s)?
                        </p>
                        <p className="text-muted">
                            This action cannot be undone.
                        </p>
                        <div className="modal-footer">
                            <button
                                onClick={() => setDeleteModal({ show: false, records: [] })}
                                className="btn btn-secondary"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="btn btn-danger"
                                disabled={processing}
                            >
                                {processing ? 'Deleting...' : 'Delete Records'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceRecords;
