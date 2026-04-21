import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';

const ProfileSettings = () => {
    const { user } = useContext(AuthContext);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [previewPic, setPreviewPic] = useState(null);
    const [picMsg, setPicMsg] = useState({ text: '', type: '' });
    const [picLoading, setPicLoading] = useState(false);
    const fileRef = useRef(null);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMsg({ text: '', type: '' });

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordMsg({ text: 'New passwords do not match', type: 'error' });
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setPasswordMsg({ text: 'Password must be at least 6 characters', type: 'error' });
            return;
        }

        setPasswordLoading(true);
        try {
            await api.put('/auth/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setPasswordMsg({ text: 'Password updated successfully!', type: 'success' });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPasswordMsg({ text: err.response?.data?.message || 'Failed to update password', type: 'error' });
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setPicMsg({ text: 'Image must be less than 2MB', type: 'error' });
            return;
        }

        if (!file.type.startsWith('image/')) {
            setPicMsg({ text: 'Please select an image file', type: 'error' });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewPic(e.target.result);
            setProfilePic(e.target.result);
        };
        reader.readAsDataURL(file);
        setPicMsg({ text: '', type: '' });
    };

    const handleUploadPic = async () => {
        if (!profilePic) return;
        setPicLoading(true);
        setPicMsg({ text: '', type: '' });

        try {
            const res = await api.put('/auth/profile-picture', { profilePicture: profilePic });
            setPicMsg({ text: 'Profile picture updated!', type: 'success' });
            // Update local storage
            const storedUser = JSON.parse(localStorage.getItem('user'));
            storedUser.profilePicture = res.data.profilePicture;
            localStorage.setItem('user', JSON.stringify(storedUser));
            setProfilePic(null);
        } catch (err) {
            setPicMsg({ text: err.response?.data?.message || 'Failed to upload', type: 'error' });
        } finally {
            setPicLoading(false);
        }
    };

    const currentPic = previewPic || user?.profilePicture;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Profile Settings</h1>
                    <p className="text-slate-500">Manage your account and preferences</p>
                </div>

                {/* Profile Picture Section */}
                <div className="glass-card p-6 md:p-8 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-lg font-bold text-slate-800 mb-5">Profile Picture</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="w-28 h-28 rounded-full border-3 border-dashed border-slate-300 hover:border-electric flex items-center justify-center cursor-pointer transition-colors overflow-hidden bg-slate-100 group relative"
                        >
                            {currentPic ? (
                                <img src={currentPic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <svg className="w-8 h-8 text-slate-400 mx-auto group-hover:text-electric transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-xs text-slate-400 mt-1">Click to upload</p>
                                </div>
                            )}
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <p className="text-sm text-slate-600 font-medium">{user?.fullName}</p>
                            <p className="text-xs text-slate-400 mb-3">{user?.email}</p>
                            {profilePic && (
                                <button onClick={handleUploadPic} disabled={picLoading} className="btn-primary text-sm">
                                    {picLoading ? 'Uploading...' : 'Save Picture'}
                                </button>
                            )}
                            {picMsg.text && (
                                <p className={`text-xs mt-2 ${picMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{picMsg.text}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Change Password Section */}
                <div className="glass-card p-6 md:p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-lg font-bold text-slate-800 mb-5">Change Password</h2>

                    {passwordMsg.text && (
                        <div className={`mb-4 p-3 rounded-lg text-sm ${
                            passwordMsg.type === 'success'
                                ? 'bg-green-100 border border-green-200 text-green-700'
                                : 'bg-red-100 border border-red-200 text-red-600'
                        }`}>{passwordMsg.text}</div>
                    )}

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Current Password</label>
                            <input
                                type="password" required
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                className="input-field" placeholder="••••••••"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">New Password</label>
                                <input
                                    type="password" required
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                    className="input-field" placeholder="Min 6 characters"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Confirm New Password</label>
                                <input
                                    type="password" required
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                    className="input-field" placeholder="Re-enter password"
                                />
                            </div>
                        </div>
                        <div className="pt-2">
                            <button type="submit" disabled={passwordLoading} className="btn-primary text-sm">
                                {passwordLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ProfileSettings;
