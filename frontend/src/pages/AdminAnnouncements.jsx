import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', message: '', type: 'info' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/announcements');
            setAnnouncements(res.data);
        } catch (error) {
            console.error('Failed to load announcements', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await api.post('/announcements', formData);
            setAnnouncements([res.data, ...announcements]);
            setFormData({ title: '', message: '', type: 'info' });
            setShowForm(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create announcement');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;
        try {
            await api.delete(`/announcements/${id}`);
            setAnnouncements(announcements.filter(a => a._id !== id));
        } catch (error) {
            alert('Failed to delete announcement');
        }
    };

    const typeIcons = {
        info: <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        warning: <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
        success: <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        important: <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
    };

    const typeColors = {
        info: 'bg-blue-50 border-blue-200 text-blue-700',
        warning: 'bg-amber-50 border-amber-200 text-amber-700',
        success: 'bg-green-50 border-green-200 text-green-700',
        important: 'bg-red-50 border-red-200 text-red-700'
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Announcements</h1>
                        <p className="text-slate-500 text-sm">Manage company-wide announcements</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        {showForm ? 'Cancel' : 'New Announcement'}
                    </button>
                </div>

                {showForm && (
                    <div className="glass-card p-6 mb-6 animate-slide-up">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Title *</label>
                                    <input
                                        type="text" required
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="input-field" placeholder="E.g., Quarterly Townhall"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        className="input-field"
                                    >
                                        <option value="info">Info</option>
                                        <option value="warning">Warning</option>
                                        <option value="important">Important</option>
                                        <option value="success">Success</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-600 mb-1">Message *</label>
                                <textarea
                                    required rows="3"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    className="input-field max-h-40" placeholder="Type announcement message here..."
                                ></textarea>
                            </div>
                            <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
                                {submitting ? 'Broadcasting...' : 'Broadcast Announcement'}
                            </button>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric"></div>
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="glass-card p-12 text-center text-slate-500">
                        No announcements posted yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {announcements.map((ann) => (
                            <div key={ann._id} className={`p-5 rounded-xl border ${typeColors[ann.type] || 'bg-white border-slate-200'} transition-all hover:shadow-md`}>
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex gap-3">
                                        <div className="mt-1">{typeIcons[ann.type]}</div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{ann.title}</h3>
                                            <p className="text-sm mt-1 text-slate-700 whitespace-pre-wrap">{ann.message}</p>
                                            <div className="flex items-center gap-3 mt-3 text-xs opacity-70">
                                                <span>Posted on {new Date(ann.date).toLocaleDateString()}</span>
                                                {ann.createdBy && <span>by {ann.createdBy.fullName}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(ann._id)}
                                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                        title="Delete Announcement"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminAnnouncements;
