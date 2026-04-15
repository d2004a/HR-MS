import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = user.role === 'admin';

    const navLinks = isAdmin ? [
        { name: 'Dashboard', path: '/admin' },
        { name: 'Leaves', path: '/admin/leaves' },
        { name: 'Attendance', path: '/admin/attendance' },
        { name: 'Employees', path: '/admin/employees' },
    ] : [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Leaves', path: '/leaves' },
        { name: 'Attendance', path: '/attendance' },
    ];

    return (
        <nav className="bg-slate-50 border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-electric to-violet flex items-center justify-center font-bold text-white shadow-lg">
                                H
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric to-violet">
                                HRMS <span className="text-xs text-electric uppercase ml-1">({user.role})</span>
                            </span>
                        </Link>
                        
                        <div className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                                            location.pathname === link.path || location.pathname.startsWith(link.path + '/') && link.path !== '/admin' && link.path !== '/dashboard'
                                                ? 'bg-white text-electric border-b-2 border-electric'
                                                : 'text-slate-600 hover:bg-white hover:text-slate-800'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="hidden md:block">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end mr-4">
                                <span className="text-sm font-medium text-slate-800">{user.fullName}</span>
                                <span className="text-xs text-slate-500">{user.email}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn-secondary text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Simple Mobile Menu (Placeholder) */}
            <div className="md:hidden border-t border-slate-200 overflow-x-auto">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex gap-2 w-max">
                    {navLinks.map((link) => (
                         <Link
                         key={link.name}
                         to={link.path}
                         className={`block px-3 py-2 rounded-md text-base font-medium ${
                             location.pathname === link.path
                                 ? 'bg-white text-electric'
                                 : 'text-slate-600 hover:bg-white'
                         }`}
                     >
                         {link.name}
                     </Link>
                    ))}
                    <button onClick={handleLogout} className="block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-white w-full text-left">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
