import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const EmployeeHolidays = () => {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const typeStyles = {
        public: 'bg-green-100 text-green-700 border-green-200',
        company: 'bg-electric/20 text-electric border-electric/30',
        optional: 'bg-amber-100 text-amber-700 border-amber-200'
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Company Holidays</h1>
                    <p className="text-slate-500 text-sm">Official holiday calendar</p>
                </div>

                {holidays.length === 0 ? (
                    <div className="glass-card p-12 text-center text-slate-500">
                        No holidays are currently scheduled.
                    </div>
                ) : (
                    <div className="glass-card overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Holiday Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
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
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${typeStyles[holiday.type] || typeStyles.public}`}>
                                                {holiday.type}
                                            </span>
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

export default EmployeeHolidays;
