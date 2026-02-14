import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../services/api';
import './AddEmployee.css';

const AddEmployee = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [success, setSuccess] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.employee_id.trim()) {
            newErrors.employee_id = 'Employee ID is required';
        }

        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.department.trim()) {
            newErrors.department = 'Department is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setApiError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);
            setApiError(null);
            await employeeAPI.create(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/employees');
            }, 1500);
        } catch (err) {
            setApiError(err.response?.data?.detail || 'Failed to create employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-employee fade-in">
            <div className="page-header">
                <h1>Add New Employee</h1>
                <p className="text-muted">Register a new employee in the system</p>
            </div>

            <div className="form-container">
                <div className="card">
                    {success && (
                        <div className="alert alert-success">
                            ✅ Employee created successfully! Redirecting...
                        </div>
                    )}

                    {apiError && (
                        <div className="alert alert-error">
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="employee_id" className="form-label">
                                Employee ID *
                            </label>
                            <input
                                type="text"
                                id="employee_id"
                                name="employee_id"
                                className="form-input"
                                value={formData.employee_id}
                                onChange={handleChange}
                                placeholder="e.g., EMP001"
                                disabled={loading}
                            />
                            {errors.employee_id && (
                                <p className="form-error">{errors.employee_id}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="full_name" className="form-label">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                className="form-input"
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="e.g., John Doe"
                                disabled={loading}
                            />
                            {errors.full_name && (
                                <p className="form-error">{errors.full_name}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="e.g., john.doe@company.com"
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="form-error">{errors.email}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="department" className="form-label">
                                Department *
                            </label>
                            <input
                                type="text"
                                id="department"
                                name="department"
                                className="form-input"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="e.g., Engineering"
                                disabled={loading}
                            />
                            {errors.department && (
                                <p className="form-error">{errors.department}</p>
                            )}
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => navigate('/employees')}
                                className="btn btn-secondary"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Employee'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;
