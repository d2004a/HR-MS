import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const AdminLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/admin/leaves');
            setLeaves(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load leaves');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await api.put(`/admin/leaves/${id}`, { status });
            setLeaves(leaves.map(l => l._id === id ? { ...l, status: res.data.status } : l));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update leave status');
        }
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
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Leave Management</h1>
                    <p className="text-slate-500">Review and approve employee leave requests</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="glass-card overflow-hidden">
                    {leaves.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <p className="text-lg font-medium text-slate-800 mb-2">No leave requests found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-500">
                                <thead className="text-xs uppercase bg-white text-slate-600 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Employee</th>
                                        <th className="px-6 py-4 font-medium">Leave Type</th>
                                        <th className="px-6 py-4 font-medium">Duration</th>
                                        <th className="px-6 py-4 font-medium">Days</th>
                                        <th className="px-6 py-4 font-medium leading-none">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-navy-700/50">
                                    {leaves.map((leave) => (
                                        <tr key={leave._id} className="hover:bg-white/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-800">{leave.employee?.fullName || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500">{leave.employee?.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <span className="capitalize">{leave.leaveType}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                                                {new Date(leave.startDate).toLocaleDateString()} - <br/>{new Date(leave.endDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {leave.totalDays}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`badge-${leave.status} capitalize inline-block w-24 text-center`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {leave.status === 'pending' && (
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleUpdateStatus(leave._id, 'approved')}
                                                            className="text-success hover:text-green-300 font-medium px-3 py-1.5 bg-success/10 hover:bg-success/20 rounded transition-colors text-xs uppercase"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(leave._id, 'rejected')}
                                                            className="text-red-400 hover:text-red-300 font-medium px-3 py-1.5 bg-red-400/10 hover:bg-red-400/20 rounded transition-colors text-xs uppercase"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {leave.status !== 'pending' && (
                                                     <span className="text-gray-600 text-xs">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminLeaves;
