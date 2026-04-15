import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeeDashboard from './pages/EmployeeDashboard';
import LeaveHistory from './pages/LeaveHistory';
import ApplyLeave from './pages/ApplyLeave';
import Attendance from './pages/Attendance';
import AdminDashboard from './pages/AdminDashboard';
import AdminLeaves from './pages/AdminLeaves';
import AdminAttendance from './pages/AdminAttendance';
import AdminEmployees from './pages/AdminEmployees';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
        <Route path="/leaves" element={<ProtectedRoute><LeaveHistory /></ProtectedRoute>} />
        <Route path="/leaves/apply" element={<ProtectedRoute><ApplyLeave /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
        
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/leaves" element={<ProtectedRoute adminOnly><AdminLeaves /></ProtectedRoute>} />
        <Route path="/admin/attendance" element={<ProtectedRoute adminOnly><AdminAttendance /></ProtectedRoute>} />
        <Route path="/admin/employees" element={<ProtectedRoute adminOnly><AdminEmployees /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
