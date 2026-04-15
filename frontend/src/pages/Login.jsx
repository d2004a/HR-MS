import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const navigate = useNavigate();
    const { login, user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await login(email, password);
            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/hrms_bg.png')" }}
        >
            <div className={`w-full max-w-md animate-slide-up transition-all duration-500`}>
                <div className="text-center mb-8">
                    <h1 className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isAdminLogin ? 'from-violet to-fuchsia-500' : 'from-electric to-violet'}`}>
                        {isAdminLogin ? "Admin Portal" : "HRMS"}
                    </h1>
                    <p className="text-slate-500 mt-2">
                        {isAdminLogin ? "Sign in to manage the system" : "Sign in to your account"}
                    </p>
                </div>
                
                <div className={`glass-card p-8 border-t-4 transition-colors duration-300 ${isAdminLogin ? 'border-violet' : 'border-transparent'}`}>
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">
                                {isAdminLogin ? "Admin Email" : "Email Address"}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`input-field ${isAdminLogin ? 'focus:border-violet focus:ring-violet/20' : ''}`}
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`input-field ${isAdminLogin ? 'focus:border-violet focus:ring-violet/20' : ''}`}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full flex justify-center items-center py-3 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ${
                                isAdminLogin 
                                ? 'bg-gradient-to-r from-violet to-fuchsia-600 hover:from-violet-dark hover:to-fuchsia-700 shadow-violet/30' 
                                : 'btn-primary'
                            }`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                isAdminLogin ? 'Admin Sign In' : 'Sign In'
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col items-center gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsAdminLogin(!isAdminLogin);
                                setError('');
                            }}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                                isAdminLogin 
                                ? 'bg-white border-slate-300 text-slate-600 hover:bg-navy-700 hover:text-slate-800' 
                                : 'bg-violet/10 border-violet/30 text-violet hover:bg-violet/20 hover:border-violet/50 shadow-[0_0_10px_rgba(139,92,246,0.15)]'
                            }`}
                        >
                            {isAdminLogin ? '← Back to Employee Login' : 'Switch to Admin Portal'}
                        </button>
                        
                        {!isAdminLogin && (
                            <div className="text-sm text-slate-500">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-electric hover:text-electric-dark font-medium transition-colors">
                                    Register here
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
