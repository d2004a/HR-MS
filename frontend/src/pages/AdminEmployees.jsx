import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const AdminEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`}
                        fill="currentColor" viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
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
                    <p className="text-slate-500">Click on an employee to assign tasks and manage ratings</p>
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
                                <div
                                    key={employee._id}
                                    onClick={() => navigate(`/admin/employees/${employee._id}`)}
                                    className="bg-white/40 border border-slate-200/50 rounded-xl p-6 hover:border-electric/50 hover:shadow-lg hover:shadow-electric/5 transition-all cursor-pointer group hover:-translate-y-1 duration-300"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full border-2 border-electric flex items-center justify-center bg-slate-50 text-slate-800 font-bold text-lg overflow-hidden group-hover:border-violet transition-colors">
                                            {employee.profilePicture ? (
                                                <img src={employee.profilePicture} alt={employee.fullName} className="w-full h-full object-cover" />
                                            ) : (
                                                employee.fullName.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-slate-800 font-semibold text-lg group-hover:text-electric transition-colors">{employee.fullName}</h3>
                                            {renderStars(employee.rating || 0)}
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

                                    <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between">
                                        <span className="badge-approved inline-block uppercase" style={{fontSize: '0.65rem'}}>Employee</span>
                                        <span className="text-xs text-electric font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                            View Details <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </span>
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
