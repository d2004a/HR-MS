import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const ApplyLeave = () => {
    const [formData, setFormData] = useState({
        leaveType: 'casual',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [leaveStats, setLeaveStats] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/leaves/stats');
                setLeaveStats(res.data);
            } catch (err) {
                console.error('Failed to fetch leave stats');
            }
        };
        fetchStats();
    }, []);

    const calculateDays = () => {
        if (!formData.startDate || !formData.endDate) return 0;
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (start > end) return 0;
        const diff = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diff / (1000 * 3600 * 24)) + 1;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            setError('End date must be after start date');
            return;
        }

        setIsLoading(true);

        try {
            await api.post('/leaves', formData);
            navigate('/leaves');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit leave request');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="mb-6">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="text-electric hover:text-slate-800 flex items-center text-sm font-medium transition-colors"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800 mt-4">Apply for Leave</h1>
                </div>

                {/* Leave Policy Info */}
                {leaveStats && (
                    <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
                        leaveStats.canApplyThisMonth 
                            ? 'bg-electric/5 border-electric/20' 
                            : 'bg-amber-50 border-amber-200'
                    }`}>
                        <svg className={`w-5 h-5 shrink-0 mt-0.5 ${leaveStats.canApplyThisMonth ? 'text-electric' : 'text-amber-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm">
                            <p className={`font-semibold mb-1 ${leaveStats.canApplyThisMonth ? 'text-slate-700' : 'text-amber-700'}`}>
                                {leaveStats.canApplyThisMonth ? 'Monthly Leave Available' : 'Monthly Leave Already Used'}
                            </p>
                            <p className={`${leaveStats.canApplyThisMonth ? 'text-slate-500' : 'text-amber-600'}`}>
                                {leaveStats.canApplyThisMonth 
                                    ? `You can take 1 leave this month. Balance: ${leaveStats.leaveBalance} day(s). Unused leaves roll over to the next month.`
                                    : `You've already used your leave for this month. Your remaining ${leaveStats.leaveBalance} day(s) will roll over. All leaves lapse at year-end.`
                                }
                            </p>
                        </div>
                    </div>
                )}

                <div className="glass-card p-6 md:p-8 animate-slide-up">
                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm flex items-start gap-3">
                            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">Leave Type</label>
                            <select 
                                value={formData.leaveType}
                                onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                                className="input-field appearance-none"
                            >
                                <option value="casual">Casual Leave</option>
                                <option value="sick">Sick Leave</option>
                                <option value="paid">Paid Leave</option>
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">Start Date</label>
                                <input 
                                    type="date" 
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    className="input-field"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">End Date</label>
                                <input 
                                    type="date" 
                                    required
                                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {formData.startDate && formData.endDate && (
                            <div className="bg-white/50 border border-electric/30 rounded-lg p-4 flex justify-between items-center">
                                <span className="text-slate-600">Total days requested:</span>
                                <span className="text-xl font-bold text-electric">{calculateDays()} Days</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">Reason (Optional)</label>
                            <textarea 
                                rows="4"
                                value={formData.reason}
                                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                className="input-field resize-none"
                                placeholder="I need leave because..."
                            ></textarea>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button 
                                type="button" 
                                onClick={() => navigate('/dashboard')}
                                className="btn-secondary mr-4"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isLoading || calculateDays() === 0}
                                className="btn-primary flex items-center px-8"
                            >
                                {isLoading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ApplyLeave;
