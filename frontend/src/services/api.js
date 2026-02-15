import axios from 'axios';

// Use environment variable for production, fallback to proxy for development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Employee API
export const employeeAPI = {
    getAll: () => api.get('/employees'),
    getById: (id) => api.get(`/employees/${id}`),
    create: (data) => api.post('/employees', data),
    delete: (id) => api.delete(`/employees/${id}`),
};

// Attendance API
export const attendanceAPI = {
    getAll: (dateFilter) => {
        const params = dateFilter ? { date_filter: dateFilter } : {};
        return api.get('/attendance', { params });
    },
    getByEmployeeId: (employeeId) => api.get(`/attendance/employee/${employeeId}`),
    mark: (data) => api.post('/attendance', data),
    update: (employeeId, date, data) => api.put(`/attendance/${employeeId}/${date}`, data),
    delete: (employeeId, date) => api.delete(`/attendance/${employeeId}/${date}`),
    bulkDelete: (records) => api.post('/attendance/bulk-delete', records),
};

export default api;
