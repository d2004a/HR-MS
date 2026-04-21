import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        balance: 0,
        recentLeaves: [],
        attendanceToday: null,
        leaveStats: null,
        announcements: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [profileRes, leavesRes, attendanceRes, leaveStatsRes, announcementsRes] = await Promise.all([
                    api.get('/auth/profile'),
                    api.get('/leaves'),
                    api.get('/attendance'),
                    api.get('/leaves/stats'),
                    api.get('/announcements')
                ]);
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const todayRecord = attendanceRes.data.find(record => {
                    const recordDate = new Date(record.date);
                    recordDate.setHours(0,0,0,0);
                    return recordDate.getTime() === today.getTime();
                });

                setStats({
                    balance: profileRes.data.leaveBalance,
                    recentLeaves: leavesRes.data.slice(0, 3),
                    attendanceToday: todayRecord ? todayRecord.status : null,
                    leaveStats: leaveStatsRes.data,
                    announcements: announcementsRes.data.slice(0, 5)
                });
            } catch (error) {
                console.error('Failed to load dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const handleMarkAttendance = async (type = 'present') => {
        try {
            await api.post('/attendance', {
                date: new Date(),
                status: type
            });
            setStats(prev => ({ ...prev, attendanceToday: type }));
        } catch (error) {
            alert(error.response?.data?.message || 'Error marking attendance');
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

    const ls = stats.leaveStats;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {user?.fullName}!</h1>
                    <p className="text-slate-500">Here's what's happening with your attendance and leaves.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Leave Balance Card */}
                    <div className="glass-card p-6 border-l-4 border-l-electric animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium mb-1">Available Leave Balance</p>
                                <h3 className="text-4xl font-bold text-slate-800 mb-2">{stats.balance} <span className="text-xl font-medium text-gray-500">Days</span></h3>
                            </div>
                            <div className="bg-electric/20 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                        </div>
                        
                        {/* Monthly Leave Info */}
                        {ls && (
                            <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">This month</span>
                                    <span className={`font-semibold ${ls.canApplyThisMonth ? 'text-success' : 'text-amber-600'}`}>
                                        {ls.leavesUsedThisMonth}/{ls.maxPerMonth} used
                                    </span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all ${ls.canApplyThisMonth ? 'bg-success' : 'bg-amber-500'}`}
                                        style={{ width: `${(ls.leavesUsedThisMonth / ls.maxPerMonth) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-slate-400">
                                    {ls.canApplyThisMonth 
                                        ? '✓ You can apply for 1 leave this month' 
                                        : '✗ Monthly leave already used — rolls over next month'}
                                </p>
                                <p className="text-xs text-slate-400">
                                    Year total: {ls.leavesUsedThisYear} leave(s) used in {ls.leaveYear}
                                </p>
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <Link to="/leaves/apply" className="text-sm text-electric hover:text-slate-800 transition-colors flex items-center gap-1 font-medium">
                                Apply for leave <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </Link>
                        </div>
                    </div>

                    {/* Attendance Card */}
                    <div className="glass-card p-6 border-l-4 border-l-success animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium mb-1">Today's Attendance</p>
                                <div className="mt-2 mb-4">
                                    {stats.attendanceToday ? (
                                        <span className={`badge-${stats.attendanceToday} capitalize px-4 py-2 text-sm`}>
                                            {stats.attendanceToday === 'half-day' ? 'Half Day' : stats.attendanceToday}
                                        </span>
                                    ) : (
                                        <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-800 text-slate-500 border border-gray-700">Not Marked</span>
                                    )}
                                </div>
                            </div>
                            <div className="bg-success/20 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            {!stats.attendanceToday ? (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleMarkAttendance('present')}
                                        className="text-sm flex-1 py-2 bg-success text-white rounded-lg hover:bg-green-500 transition-colors font-medium shadow-[0_0_15px_rgba(0,201,167,0.3)]"
                                    >
                                        Full Day
                                    </button>
                                    <button 
                                        onClick={() => handleMarkAttendance('half-day')}
                                        className="text-sm flex-1 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                                    >
                                        Half Day
                                    </button>
                                </div>
                            ) : (
                                <Link to="/attendance" className="text-sm text-success hover:text-slate-800 transition-colors flex items-center gap-1 font-medium">
                                    View attendance history <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </Link>
                            )}
                        </div>
                    </div>

                     {/* Recent Leaves Summary */}
                     <div className="glass-card p-6 border-l-4 border-l-violet animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <p className="text-slate-500 text-sm font-medium mb-3">Recent Leave Requests</p>
                        
                        {stats.recentLeaves.length > 0 ? (
                            <ul className="space-y-3">
                                {stats.recentLeaves.map(leave => (
                                    <li key={leave._id} className="flex justify-between items-center bg-slate-50/50 p-2 rounded border border-slate-200/50">
                                        <div>
                                            <p className="text-sm text-slate-800 capitalize">{leave.leaveType} Leave</p>
                                            <p className="text-xs text-slate-500">{new Date(leave.startDate).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`badge-${leave.status} capitalize`}>{leave.status}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="h-24 flex items-center justify-center border border-dashed border-slate-300 rounded-lg bg-white/30">
                                <p className="text-sm text-gray-500">No recent requests</p>
                            </div>
                        )}
                        
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <Link to="/leaves" className="text-sm text-violet-light hover:text-slate-800 transition-colors flex items-center gap-1 font-medium">
                                View all requests <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content Area = Announcements */}
                <div className="glass-card p-6 md:p-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Company Announcements</h2>
                            <p className="text-sm text-slate-500 mt-1">Stay updated with the latest news</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg hidden sm:block">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                        </div>
                    </div>

                    {stats.announcements && stats.announcements.length > 0 ? (
                        <div className="space-y-4">
                            {stats.announcements.map((ann) => {
                                const typeColors = {
                                    info: 'border-l-blue-500 bg-blue-50/50',
                                    warning: 'border-l-amber-500 bg-amber-50/50',
                                    success: 'border-l-green-500 bg-green-50/50',
                                    important: 'border-l-red-500 bg-red-50/50'
                                };
                                return (
                                    <div key={ann._id} className={`p-5 rounded-r-xl border-y border-r border-slate-200 border-l-4 ${typeColors[ann.type] || typeColors.info}`}>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-slate-800 text-lg">{ann.title}</h3>
                                            <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                                                {new Date(ann.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 mt-2 whitespace-pre-wrap text-sm">{ann.message}</p>
                                        <div className="mt-3 text-xs text-slate-400 font-medium">
                                            Posted by {ann.createdBy?.fullName || 'Admin'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                            <p className="text-slate-500 font-medium">No active announcements</p>
                            <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default EmployeeDashboard;
