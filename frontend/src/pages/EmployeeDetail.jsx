import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const EmployeeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchEmployeeDetail();
    }, [id]);

    const fetchEmployeeDetail = async () => {
        try {
            const res = await api.get(`/admin/employees/${id}`);
            setEmployee(res.data.employee);
            setTasks(res.data.tasks);
            setRating(res.data.employee.rating || 0);
        } catch (err) {
            console.error('Failed to load employee', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRate = async (newRating) => {
        try {
            await api.put(`/admin/employees/${id}/rate`, { rating: newRating });
            setRating(newRating);
            setMessage('Rating updated!');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update rating');
        }
    };

    const handleAssignTask = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await api.post(`/admin/tasks/${id}`, taskForm);
            setTasks([res.data, ...tasks]);
            setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '' });
            setShowTaskForm(false);
            setMessage('Task assigned!');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to assign task');
        } finally {
            setSubmitting(false);
        }
    };

    const priorityColors = {
        low: 'bg-blue-100 text-blue-700 border-blue-200',
        medium: 'bg-amber-100 text-amber-700 border-amber-200',
        high: 'bg-red-100 text-red-700 border-red-200'
    };

    const statusColors = {
        'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
        'completed': 'bg-green-100 text-green-700 border-green-200'
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="p-8 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric"></div>
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="p-8 text-center text-slate-500">Employee not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <button onClick={() => navigate('/admin/employees')} className="text-electric hover:text-slate-800 flex items-center text-sm font-medium transition-colors mb-6">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Employees
                </button>

                {message && (
                    <div className="mb-4 p-3 rounded-lg bg-green-100 border border-green-200 text-green-700 text-sm animate-fade-in">{message}</div>
                )}

                {/* Employee Profile Card */}
                <div className="glass-card p-6 md:p-8 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="w-20 h-20 rounded-full border-3 border-electric flex items-center justify-center bg-gradient-to-br from-electric to-violet text-white font-bold text-2xl shadow-lg overflow-hidden">
                            {employee.profilePicture ? (
                                <img src={employee.profilePicture} alt={employee.fullName} className="w-full h-full object-cover" />
                            ) : (
                                employee.fullName.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-slate-800">{employee.fullName}</h1>
                            <p className="text-slate-500 text-sm">{employee.email}</p>
                            <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Joined {new Date(employee.dateOfJoining).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Leave Balance: <strong className="text-slate-800">{employee.leaveBalance} days</strong>
                                </span>
                            </div>
                        </div>

                        {/* Star Rating */}
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-2 font-medium">Performance Rating</p>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => handleRate(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="transition-transform hover:scale-125"
                                    >
                                        <svg
                                            className={`w-7 h-7 transition-colors ${
                                                star <= (hoverRating || rating) ? 'text-amber-400' : 'text-slate-200'
                                            }`}
                                            fill="currentColor" viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm font-semibold text-slate-700 mt-1">{rating}/5</p>
                        </div>
                    </div>
                </div>

                {/* Tasks Section */}
                <div className="glass-card p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Assigned Tasks</h2>
                        <button
                            onClick={() => setShowTaskForm(!showTaskForm)}
                            className="btn-primary flex items-center gap-2 text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            {showTaskForm ? 'Cancel' : 'Assign Task'}
                        </button>
                    </div>

                    {/* Task Form */}
                    {showTaskForm && (
                        <form onSubmit={handleAssignTask} className="mb-6 p-5 bg-slate-50 rounded-xl border border-slate-200 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Title *</label>
                                    <input
                                        type="text" required
                                        value={taskForm.title}
                                        onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                                        className="input-field" placeholder="Task title"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Priority</label>
                                        <select value={taskForm.priority} onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})} className="input-field">
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Due Date</label>
                                        <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})} className="input-field" />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                                <textarea rows="2" value={taskForm.description} onChange={(e) => setTaskForm({...taskForm, description: e.target.value})} className="input-field resize-none" placeholder="Task details..." />
                            </div>
                            <button type="submit" disabled={submitting} className="btn-primary text-sm">{submitting ? 'Assigning...' : 'Assign Task'}</button>
                        </form>
                    )}

                    {/* Task List */}
                    {tasks.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            <p className="text-lg font-medium text-slate-600 mb-1">No tasks assigned</p>
                            <p className="text-sm">Click "Assign Task" to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <div key={task._id} className="p-4 bg-white rounded-xl border border-slate-200 hover:border-electric/30 transition-colors">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-800">{task.title}</h4>
                                            {task.description && <p className="text-sm text-slate-500 mt-1">{task.description}</p>}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${priorityColors[task.priority]}`}>{task.priority}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[task.status]}`}>{task.status}</span>
                                                {task.dueDate && (
                                                    <span className="text-xs text-slate-400">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default EmployeeDetail;
