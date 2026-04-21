import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const AdminTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ status: '', priority: '' });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/admin/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error('Failed to load tasks', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = tasks.filter(t => {
        if (filter.status && t.status !== filter.status) return false;
        if (filter.priority && t.priority !== filter.priority) return false;
        return true;
    });

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

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">All Tasks</h1>
                    <p className="text-slate-500">View and manage tasks assigned to employees</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <select
                        value={filter.status}
                        onChange={(e) => setFilter({...filter, status: e.target.value})}
                        className="input-field w-auto text-sm"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select
                        value={filter.priority}
                        onChange={(e) => setFilter({...filter, priority: e.target.value})}
                        className="input-field w-auto text-sm"
                    >
                        <option value="">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <span className="text-sm text-slate-400 self-center ml-2">
                        {filteredTasks.length} task(s)
                    </span>
                </div>

                <div className="glass-card overflow-hidden">
                    {filteredTasks.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <p className="text-lg font-medium text-slate-800 mb-2">No tasks found</p>
                            <p className="text-sm">Assign tasks from the Employee Directory</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredTasks.map((task) => (
                                <div key={task._id} className="p-4 sm:p-6 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-semibold text-slate-800">{task.title}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${priorityColors[task.priority]}`}>{task.priority}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[task.status]}`}>{task.status}</span>
                                            </div>
                                            {task.description && <p className="text-sm text-slate-500 mb-2">{task.description}</p>}
                                            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                    {task.employee?.fullName || 'Unknown'}
                                                </span>
                                                {task.dueDate && (
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                                <span>Assigned: {new Date(task.assignedDate).toLocaleDateString()}</span>
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

export default AdminTasks;
