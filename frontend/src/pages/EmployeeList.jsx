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
    const [deleteModal, setDeleteModal] = useState({ show: false, employee: null });
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
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEmployees(filtered);
    }, [searchTerm, employees]);

    const handleDeleteClick = (employee) => {
        setDeleteModal({ show: true, employee });
    };

    const handleDeleteConfirm = async () => {
        try {
            setDeleting(true);
            await employeeAPI.delete(deleteModal.employee.employee_id);
            setEmployees(prev => prev.filter(e => e.employee_id !== deleteModal.employee.employee_id));
            setDeleteModal({ show: false, employee: null });
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to delete employee');
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ show: false, employee: null });
    };

    if (loading) return <LoadingSpinner message="Loading employees..." />;
    if (error) return <ErrorMessage message={error} onRetry={fetchEmployees} />;

    return (
        <div className="employee-list fade-in">
            <div className="page-header">
                <div>
                    <h1>Employee Management</h1>
                    <p className="text-muted">View and manage all employee records</p>
                </div>
                <Link to="/employees/add" className="btn btn-primary">
                    ➕ Add Employee
                </Link>
            </div>

            {employees.length === 0 ? (
                <EmptyState
                    icon="👥"
                    title="No Employees Yet"
                    message="Get started by adding your first employee to the system"
                    action={
                        <Link to="/employees/add" className="btn btn-primary">
                            Add First Employee
                        </Link>
                    }
                />
            ) : (
                <>
                    <div className="search-bar">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="🔍 Search by name, ID, email, or department..."
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
                                            onClick={() => navigate(`/attendance?employee=${employee.employee_id}`)}
                                            style={{ cursor: 'pointer' }}
                                            className="clickable-row"
                                        >
                                            <td><strong>{employee.employee_id}</strong></td>
                                            <td>{employee.full_name}</td>
                                            <td>{employee.email}</td>
                                            <td>
                                                <span className="department-badge">{employee.department}</span>
                                            </td>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => navigate(`/attendance?employee=${employee.employee_id}`)}
                                                    className="btn-view"
                                                    title="View attendance"
                                                    style={{ marginRight: '8px' }}
                                                >
                                                    📊
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(employee)}
                                                    className="btn-delete"
                                                    title="Delete employee"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {deleteModal.show && (
                <div className="modal-overlay" onClick={handleDeleteCancel}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Confirm Deletion</h2>
                        </div>
                        <p>
                            Are you sure you want to delete employee <strong>{deleteModal.employee?.full_name}</strong> (ID: {deleteModal.employee?.employee_id})?
                        </p>
                        <p className="text-muted">
                            This will also delete all attendance records for this employee. This action cannot be undone.
                        </p>
                        <div className="modal-footer">
                            <button
                                onClick={handleDeleteCancel}
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
                                {deleting ? 'Deleting...' : 'Delete Employee'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
