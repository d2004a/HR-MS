import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeeDashboard from './pages/EmployeeDashboard';
import LeaveHistory from './pages/LeaveHistory';
import ApplyLeave from './pages/ApplyLeave';
import Attendance from './pages/Attendance';
import MyTasks from './pages/MyTasks';
import ProfileSettings from './pages/ProfileSettings';
import EmployeeHolidays from './pages/EmployeeHolidays';

import AdminDashboard from './pages/AdminDashboard';
import AdminLeaves from './pages/AdminLeaves';
import AdminAttendance from './pages/AdminAttendance';
import AdminEmployees from './pages/AdminEmployees';
import AdminTasks from './pages/AdminTasks';
import EmployeeDetail from './pages/EmployeeDetail';
import AdminAnnouncements from './pages/AdminAnnouncements';
import AdminHolidays from './pages/AdminHolidays';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
        <Route path="/leaves" element={<ProtectedRoute><LeaveHistory /></ProtectedRoute>} />
        <Route path="/leaves/apply" element={<ProtectedRoute><ApplyLeave /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
        <Route path="/my-tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
        <Route path="/holidays" element={<ProtectedRoute><EmployeeHolidays /></ProtectedRoute>} />
        
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/leaves" element={<ProtectedRoute adminOnly><AdminLeaves /></ProtectedRoute>} />
        <Route path="/admin/attendance" element={<ProtectedRoute adminOnly><AdminAttendance /></ProtectedRoute>} />
        <Route path="/admin/employees" element={<ProtectedRoute adminOnly><AdminEmployees /></ProtectedRoute>} />
        <Route path="/admin/employees/:id" element={<ProtectedRoute adminOnly><EmployeeDetail /></ProtectedRoute>} />
        <Route path="/admin/tasks" element={<ProtectedRoute adminOnly><AdminTasks /></ProtectedRoute>} />
        <Route path="/admin/announcements" element={<ProtectedRoute adminOnly><AdminAnnouncements /></ProtectedRoute>} />
        <Route path="/admin/holidays" element={<ProtectedRoute adminOnly><AdminHolidays /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
