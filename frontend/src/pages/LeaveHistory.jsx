import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const LeaveHistory = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/leaves');
            setLeaves(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load leaves');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelLeave = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this leave request?')) return;
        
        try {
            await api.delete(`/leaves/${id}`);
            // Remove from state without re-fetching
            setLeaves(leaves.filter(l => l._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel leave');
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Leave History</h1>
                        <p className="text-slate-500">View and manage your leave requests</p>
                    </div>
                    <Link to="/leaves/apply" className="btn-primary whitespace-nowrap hidden sm:flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Apply for Leave
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="glass-card overflow-hidden">
                    {leaves.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <p className="text-lg font-medium text-slate-800 mb-2">No leave requests found</p>
                            <p className="mb-6 text-sm">You haven't made any leave requests yet.</p>
                            <Link to="/leaves/apply" className="btn-primary inline-flex sm:hidden items-center">
                                Apply for Leave
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-500">
                                <thead className="text-xs uppercase bg-white text-slate-600">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Type</th>
                                        <th className="px-6 py-4 font-medium">Duration</th>
                                        <th className="px-6 py-4 font-medium">Days</th>
                                        <th className="px-6 py-4 font-medium leading-none">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves.map((leave) => (
                                        <tr key={leave._id} className="border-b border-slate-200/50 hover:bg-white/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className={`w-2 h-2 rounded-full mr-2 ${
                                                        leave.leaveType === 'casual' ? 'bg-electric' : 
                                                        leave.leaveType === 'sick' ? 'bg-red-400' : 'bg-success'
                                                    }`}></div>
                                                    <span className="font-medium text-slate-800 capitalize">{leave.leaveType}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                                                {new Date(leave.startDate).toLocaleDateString()} <br />- {new Date(leave.endDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-800">
                                                {leave.totalDays} day{leave.totalDays > 1 ? 's' : ''}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`badge-${leave.status} capitalize inline-block w-24 text-center`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {leave.status === 'pending' ? (
                                                    <button 
                                                        onClick={() => handleCancelLeave(leave._id)}
                                                        className="text-red-400 hover:text-red-300 hover:underline font-medium px-3 py-1 bg-red-400/10 hover:bg-red-400/20 rounded transition-colors text-xs uppercase cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                ) : (
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

export default LeaveHistory;
