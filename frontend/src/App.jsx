import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';
import AttendanceRecords from './pages/AttendanceRecords';
import MarkAttendance from './pages/MarkAttendance';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/employees" element={<EmployeeList />} />
                    <Route path="/employees/add" element={<AddEmployee />} />
                    <Route path="/attendance" element={<AttendanceRecords />} />
                    <Route path="/attendance/mark" element={<MarkAttendance />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
