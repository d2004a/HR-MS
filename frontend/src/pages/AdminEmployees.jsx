import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const AdminEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/admin/employees');
            setEmployees(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load employees');
        } finally {
            setLoading(false);
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
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Employee Directory</h1>
                    <p className="text-slate-500">View all registered employees in the system</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="glass-card overflow-hidden">
                    {employees.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <p className="text-lg font-medium text-slate-800 mb-2">No employees found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            {employees.map(employee => (
                                <div key={employee._id} className="bg-white/40 border border-slate-200/50 rounded-xl p-6 hover:border-electric/50 transition-colors">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full border-2 border-electric flex items-center justify-center bg-slate-50 text-slate-800 font-bold text-lg">
                                            {employee.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-slate-800 font-semibold text-lg">{employee.fullName}</h3>
                                            <span className="badge-approved inline-block mt-1 uppercase" style={{fontSize: '0.65rem'}}>Employee</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2 mt-4 pt-4 border-t border-slate-200/50 text-sm text-slate-500">
                                        <div className="flex items-center gap-2 mb-1 text-xs">
                                            <svg className="w-4 h-4 text-electric shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                            <span className="truncate">{employee.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1 text-xs">
                                            <svg className="w-4 h-4 text-electric shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            Joined {new Date(employee.dateOfJoining).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <svg className="w-4 h-4 text-electric shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            Leave Balance: <strong className="text-slate-800 ml-1">{employee.leaveBalance} days</strong>
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

export default AdminEmployees;
