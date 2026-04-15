import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const AdminAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchAttendance();
    }, [dateFilter]);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/attendance${dateFilter ? `?date=${dateFilter}` : ''}`);
            setAttendance(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load attendance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Company Attendance</h1>
                        <p className="text-slate-500">Monitor employee attendance records</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-500 font-medium">Filter by Date:</label>
                        <input 
                            type="date" 
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="input-field py-1.5 w-auto"
                        />
                        {dateFilter && (
                            <button onClick={() => setDateFilter('')} className="btn-secondary py-1.5 px-3 text-xs">Clear</button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="glass-card flex flex-col min-h-[400px]">
                    {loading ? (
                       <div className="flex-1 flex justify-center items-center">
                           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-electric"></div>
                       </div>
                    ) : attendance.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 flex-1 flex flex-col justify-center">
                            <p className="text-lg font-medium text-slate-800 mb-2">No records found for this date</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-500">
                                <thead className="text-xs uppercase bg-white text-slate-600 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Employee</th>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                        <th className="px-6 py-4 font-medium">Time Marked</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-navy-700/50">
                                    {attendance.map((record) => (
                                        <tr key={record._id} className="hover:bg-white/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-800">{record.employee?.fullName || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500">{record.employee?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year:'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(record.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`badge-${record.status} capitalize`}>
                                                    {record.status}
                                                </span>
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

export default AdminAttendance;
