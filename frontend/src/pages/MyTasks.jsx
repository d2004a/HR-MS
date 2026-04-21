import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks/my');
            setTasks(res.data);
        } catch (err) {
            console.error('Failed to load tasks', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const res = await api.put(`/tasks/${taskId}/status`, { status: newStatus });
            setTasks(tasks.map(t => t._id === taskId ? res.data : t));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
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

    const statusOptions = ['pending', 'in-progress', 'completed'];

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

    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">My Tasks</h1>
                    <p className="text-slate-500">Track and update your assigned tasks</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="glass-card p-4 text-center border-t-4 border-t-yellow-400">
                        <p className="text-2xl font-bold text-slate-800">{pendingTasks.length}</p>
                        <p className="text-xs text-slate-500 mt-1">Pending</p>
                    </div>
                    <div className="glass-card p-4 text-center border-t-4 border-t-blue-400">
                        <p className="text-2xl font-bold text-slate-800">{inProgressTasks.length}</p>
                        <p className="text-xs text-slate-500 mt-1">In Progress</p>
                    </div>
                    <div className="glass-card p-4 text-center border-t-4 border-t-green-400">
                        <p className="text-2xl font-bold text-slate-800">{completedTasks.length}</p>
                        <p className="text-xs text-slate-500 mt-1">Completed</p>
                    </div>
                </div>

                {tasks.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-lg font-medium text-slate-700 mb-1">No tasks assigned</p>
                        <p className="text-sm text-slate-400">Tasks will appear here when your admin assigns them</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div key={task._id} className="glass-card p-5 hover:shadow-lg transition-shadow">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                            <h3 className="font-semibold text-slate-800 text-lg">{task.title}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${priorityColors[task.priority]}`}>{task.priority}</span>
                                        </div>
                                        {task.description && <p className="text-sm text-slate-500 mb-3">{task.description}</p>}
                                        <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                                            {task.assignedBy && (
                                                <span>Assigned by: <strong className="text-slate-600">{task.assignedBy.fullName}</strong></span>
                                            )}
                                            {task.dueDate && (
                                                <span className={`${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-500 font-semibold' : ''}`}>
                                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            )}
                                            <span>Assigned: {new Date(task.assignedDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${statusColors[task.status]}`}
                                        >
                                            {statusOptions.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyTasks;
