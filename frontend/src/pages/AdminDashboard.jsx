import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        pendingLeaves: 0,
        employeesPresentToday: 0,
        totalEmployees: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [leavesRes, attendanceRes, employeesRes] = await Promise.all([
                    api.get('/admin/leaves'),
                    api.get(`/admin/attendance?date=${new Date().toISOString().split('T')[0]}`),
                    api.get('/admin/employees')
                ]);

                const pendingCount = leavesRes.data.filter(l => l.status === 'pending').length;
                const presentCount = attendanceRes.data.filter(a => a.status === 'present').length;

                setStats({
                    pendingLeaves: pendingCount,
                    employeesPresentToday: presentCount,
                    totalEmployees: employeesRes.data.length
                });
            } catch (error) {
                console.error('Failed to load dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
                    <p className="text-slate-500">Overview of company leaves and attendance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 border-l-4 border-l-violet animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium mb-1">Pending Leaves</p>
                                <h3 className="text-4xl font-bold text-slate-800 mb-2">{stats.pendingLeaves}</h3>
                            </div>
                            <div className="bg-violet/20 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <Link to="/admin/leaves" className="text-sm text-electric hover:text-slate-800 transition-colors flex items-center gap-1 font-medium">
                                Review requests <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </Link>
                        </div>
                    </div>

                    <div className="glass-card p-6 border-l-4 border-l-success animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium mb-1">Present Today</p>
                                <h3 className="text-4xl font-bold text-slate-800 mb-2">{stats.employeesPresentToday} <span className="text-xl font-medium text-gray-500">/ {stats.totalEmployees}</span></h3>
                            </div>
                            <div className="bg-success/20 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <Link to="/admin/attendance" className="text-sm text-electric hover:text-slate-800 transition-colors flex items-center gap-1 font-medium">
                                View attendance <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </Link>
                        </div>
                    </div>

                    <div className="glass-card p-6 border-l-4 border-l-electric animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium mb-1">Total Employees</p>
                                <h3 className="text-4xl font-bold text-slate-800 mb-2">{stats.totalEmployees}</h3>
                            </div>
                            <div className="bg-electric/20 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <Link to="/admin/employees" className="text-sm text-electric hover:text-slate-800 transition-colors flex items-center gap-1 font-medium">
                                View directory <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
