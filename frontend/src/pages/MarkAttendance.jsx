import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeAPI, attendanceAPI } from '../services/api';
import './MarkAttendance.css';

const MarkAttendance = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [apiError, setApiError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await employeeAPI.getAll();
                setEmployees(response.data);
            } catch (err) {
                setApiError('Failed to load employees');
            } finally {
                setLoadingEmployees(false);
            }
        };
        fetchEmployees();
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.employee_id) {
            newErrors.employee_id = 'Please select an employee';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            await attendanceAPI.mark(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/attendance');
            }, 1500);
        } catch (err) {
            setApiError(err.response?.data?.detail || 'Failed to mark attendance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mark-attendance fade-in">
            <div className="page-header">
                <h1>Mark Attendance</h1>
                <p className="text-muted">Record employee attendance for the day</p>
            </div>

            <div className="form-container">
                <div className="card">
                    {success && (
                        <div className="alert alert-success">
                            ✅ Attendance marked successfully! Redirecting...
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
                                Select Employee *
                            </label>
                            <select
                                id="employee_id"
                                name="employee_id"
                                className="form-select"
                                value={formData.employee_id}
                                onChange={handleChange}
                                disabled={loading || loadingEmployees}
                            >
                                <option value="">-- Select an employee --</option>
                                {employees.map((emp) => (
                                    <option key={emp.employee_id} value={emp.employee_id}>
                                        {emp.full_name} ({emp.employee_id})
                                    </option>
                                ))}
                            </select>
                            {errors.employee_id && (
                                <p className="form-error">{errors.employee_id}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="date" className="form-label">
                                Date *
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                className="form-input"
                                value={formData.date}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                disabled={loading}
                            />
                            {errors.date && (
                                <p className="form-error">{errors.date}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status *</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Present"
                                        checked={formData.status === 'Present'}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    <span className="radio-text">✅ Present</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Absent"
                                        checked={formData.status === 'Absent'}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    <span className="radio-text">❌ Absent</span>
                                </label>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => navigate('/attendance')}
                                className="btn btn-secondary"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading || loadingEmployees}
                            >
                                {loading ? 'Marking...' : 'Mark Attendance'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MarkAttendance;
