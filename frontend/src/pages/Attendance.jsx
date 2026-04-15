import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const res = await api.get('/attendance');
            setAttendance(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load attendance');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async () => {
        try {
            const res = await api.post('/attendance', {
                date: new Date(),
                status: 'present'
            });
            // Add new record to top of list
            setAttendance([res.data, ...attendance]);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to mark attendance');
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

    const today = new Date();
    today.setHours(0,0,0,0);
    const markedToday = attendance.some(record => {
        const d = new Date(record.date);
        d.setHours(0,0,0,0);
        return d.getTime() === today.getTime();
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">My Attendance</h1>
                        <p className="text-slate-500">View your daily attendance records</p>
                    </div>
                    {!markedToday && (
                        <button 
                            onClick={handleMarkAttendance}
                            className="btn-success whitespace-nowrap flex items-center shadow-[0_4px_15px_rgba(0,201,167,0.4)]"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Mark Present Today
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="glass-card overflow-hidden">
                    {attendance.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <p className="text-lg font-medium text-slate-800 mb-2">No attendance records</p>
                            <p className="text-sm">You haven't marked attendance yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 divide-y divide-navy-700/50">
                            {attendance.map((record) => (
                                <div key={record._id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-white/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                            record.status === 'present' ? 'bg-success/20 text-success' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            <span className="font-bold text-lg">{new Date(record.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', year: 'numeric' })}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Recorded at {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <span className={`badge-${record.status} capitalize min-w-[5rem] text-center`}>
                                        {record.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Attendance;
