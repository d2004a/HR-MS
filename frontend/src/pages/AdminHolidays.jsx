import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const AdminHolidays = () => {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', date: '', type: 'public' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchHolidays();
    }, []);

    const fetchHolidays = async () => {
        try {
            const res = await api.get('/holidays');
            setHolidays(res.data);
        } catch (error) {
            console.error('Failed to load holidays', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await api.post('/holidays', formData);
            setHolidays([...holidays, res.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
            setFormData({ name: '', date: '', type: 'public' });
            setShowForm(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create holiday');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this holiday?')) return;
        try {
            await api.delete(`/holidays/${id}`);
            setHolidays(holidays.filter(h => h._id !== id));
        } catch (error) {
            alert('Failed to delete holiday');
        }
    };

    const typeStyles = {
        public: 'bg-green-100 text-green-700 border-green-200',
        company: 'bg-electric/20 text-electric border-electric/30',
        optional: 'bg-amber-100 text-amber-700 border-amber-200'
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Company Holidays</h1>
                        <p className="text-slate-500 text-sm">Manage the official holiday calendar</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        {showForm ? 'Cancel' : 'Add Holiday'}
                    </button>
                </div>

                {showForm && (
                    <div className="glass-card p-6 mb-6 animate-slide-up">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-600 mb-1">Holiday Name *</label>
                                <input
                                    type="text" required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="input-field" placeholder="E.g., New Year's Day"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Date *</label>
                                <input
                                    type="date" required
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    className="input-field"
                                >
                                    <option value="public">Public</option>
                                    <option value="company">Company</option>
                                    <option value="optional">Optional</option>
                                </select>
                            </div>
                            <div className="md:col-span-4 mt-2">
                                <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
                                    {submitting ? 'Saving...' : 'Save Holiday'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric"></div>
                    </div>
                ) : holidays.length === 0 ? (
                    <div className="glass-card p-12 text-center text-slate-500">
                        No holidays added to the calendar.
                    </div>
                ) : (
                    <div className="glass-card overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Holiday Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {holidays.map((holiday) => {
                                    const dateObj = new Date(holiday.date);
                                    return (
                                    <tr key={holiday._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-medium">
                                            {dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {holiday.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${typeStyles[holiday.type]}`}>
                                                {holiday.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => handleDelete(holiday._id)}
                                                className="text-red-400 hover:text-red-900 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminHolidays;
