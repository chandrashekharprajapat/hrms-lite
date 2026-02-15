import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { employeeAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import './EmployeeList.css';

const EmployeeList = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [deleteModal, setDeleteModal] = useState({ show: false, employees: [] });
    const [deleting, setDeleting] = useState(false);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await employeeAPI.getAll();
            setEmployees(response.data);
            setFilteredEmployees(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        const filtered = employees.filter(emp =>
            emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEmployees(filtered);
        setSelectedEmployees([]); // Clear selection when search changes
    }, [searchTerm, employees]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedEmployees(filteredEmployees.map(emp => emp.employee_id));
        } else {
            setSelectedEmployees([]);
        }
    };

    const handleSelectEmployee = (employeeId) => {
        if (selectedEmployees.includes(employeeId)) {
            setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
        } else {
            setSelectedEmployees([...selectedEmployees, employeeId]);
        }
    };

    const handleDeleteSelected = () => {
        const employeesToDelete = filteredEmployees.filter(emp =>
            selectedEmployees.includes(emp.employee_id)
        );
        setDeleteModal({ show: true, employees: employeesToDelete });
    };

    const handleDeleteConfirm = async () => {
        try {
            setDeleting(true);
            // Delete each selected employee
            for (const employee of deleteModal.employees) {
                await employeeAPI.delete(employee.employee_id);
            }
            await fetchEmployees();
            setSelectedEmployees([]);
            setDeleteModal({ show: false, employees: [] });
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to delete employees');
        } finally {
            setDeleting(false);
        }
    };

    const handleRowClick = (employeeId) => {
        navigate(`/attendance?employee=${employeeId}`);
    };

    if (loading) return <LoadingSpinner message="Loading employees..." />;
    if (error) return <ErrorMessage message={error} onRetry={fetchEmployees} />;

    return (
        <div className="employee-list fade-in">
            <div className="page-header">
                <div>
                    <h1>Employee List</h1>
                    <p className="text-muted">Manage your organization's employees</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {selectedEmployees.length > 0 && (
                        <button onClick={handleDeleteSelected} className="btn btn-danger">
                            🗑️ Delete Selected ({selectedEmployees.length})
                        </button>
                    )}
                    <Link to="/employees/add" className="btn btn-primary">
                        ➕ Add Employee
                    </Link>
                </div>
            </div>

            {employees.length === 0 ? (
                <EmptyState
                    icon="👥"
                    title="No Employees Found"
                    message="Start building your team by adding your first employee"
                    action={
                        <Link to="/employees/add" className="btn btn-primary">
                            Add First Employee
                        </Link>
                    }
                />
            ) : (
                <>
                    <div className="search-box">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="🔍 Search by name, ID, department, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {filteredEmployees.length === 0 ? (
                        <EmptyState
                            icon="🔍"
                            title="No Results Found"
                            message={`No employees match "${searchTerm}"`}
                        />
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '50px' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th>Employee ID</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Department</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map((employee) => (
                                        <tr
                                            key={employee.employee_id}
                                            className="clickable-row"
                                        >
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEmployees.includes(employee.employee_id)}
                                                    onChange={() => handleSelectEmployee(employee.employee_id)}
                                                />
                                            </td>
                                            <td onClick={() => handleRowClick(employee.employee_id)}>
                                                <strong>{employee.employee_id}</strong>
                                            </td>
                                            <td onClick={() => handleRowClick(employee.employee_id)}>
                                                {employee.full_name}
                                            </td>
                                            <td onClick={() => handleRowClick(employee.employee_id)}>
                                                {employee.email}
                                            </td>
                                            <td onClick={() => handleRowClick(employee.employee_id)}>
                                                <span className="department-badge">
                                                    {employee.department}
                                                </span>
                                            </td>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => navigate(`/attendance?employee=${employee.employee_id}`)}
                                                    className="btn-view-attendance"
                                                    title="View attendance records"
                                                >
                                                    📊
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="employee-summary">
                        <p className="text-muted">
                            Showing {filteredEmployees.length} of {employees.length} employees
                            {selectedEmployees.length > 0 && ` • ${selectedEmployees.length} selected`}
                        </p>
                    </div>
                </>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="modal-overlay" onClick={() => setDeleteModal({ show: false, employees: [] })}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>⚠️ Confirm Deletion</h2>
                        </div>
                        <p>
                            Are you sure you want to delete <strong>{deleteModal.employees.length}</strong> employee(s)?
                        </p>
                        <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                            {deleteModal.employees.map(emp => (
                                <div key={emp.employee_id} style={{ padding: '0.5rem', background: 'var(--bg-card)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                                    <strong>{emp.full_name}</strong> ({emp.employee_id})
                                </div>
                            ))}
                        </div>
                        <p className="text-muted" style={{ color: 'var(--accent-color)', fontWeight: '500' }}>
                            ⚠️ This action cannot be undone. All attendance records for {deleteModal.employees.length === 1 ? 'this employee' : 'these employees'} will also be permanently deleted.
                        </p>
                        <div className="modal-footer">
                            <button
                                onClick={() => setDeleteModal({ show: false, employees: [] })}
                                className="btn btn-secondary"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="btn btn-danger"
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : `Delete ${deleteModal.employees.length} Employee(s)`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
