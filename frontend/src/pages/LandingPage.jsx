import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        }
    }, [user, navigate]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Smart Leave Management',
            desc: 'Monthly accrual system with automatic rollover. Apply, track, and manage leaves effortlessly.',
            color: 'from-blue-500 to-indigo-600',
        },
        {
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Attendance Tracking',
            desc: 'Full-day & half-day attendance with real-time tracking. Never miss a clock-in again.',
            color: 'from-emerald-500 to-teal-600',
        },
        {
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
            title: 'Task Management',
            desc: 'Assign tasks, set priorities, and track progress. Keep your team aligned and productive.',
            color: 'from-violet-500 to-purple-600',
        },
        {
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
            ),
            title: 'Announcements Hub',
            desc: 'Company-wide announcements with priority levels. Stay informed on what matters most.',
            color: 'from-amber-500 to-orange-600',
        },
        {
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
            title: 'Performance Ratings',
            desc: 'Rate employee performance with a 5-star system. Data-driven reviews made simple.',
            color: 'from-pink-500 to-rose-600',
        },
        {
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Holiday Calendar',
            desc: 'Visual holiday calendar with national and company holidays. Plan your year ahead.',
            color: 'from-cyan-500 to-blue-600',
        },
    ];

    const stats = [
        { value: '99.9%', label: 'Uptime Guarantee' },
        { value: '500+', label: 'Companies Trust Us' },
        { value: '50K+', label: 'Employees Managed' },
        { value: '4.9★', label: 'Average Rating' },
    ];

    const testimonials = [
        {
            name: 'Priya Sharma',
            role: 'HR Director, TechCorp',
            text: 'HRMS transformed how we manage our workforce. Leave tracking and attendance are now seamless.',
            avatar: 'PS',
        },
        {
            name: 'Rajesh Kumar',
            role: 'CEO, InnovateLabs',
            text: 'The task management and performance rating features have boosted our team productivity by 40%.',
            avatar: 'RK',
        },
        {
            name: 'Anita Desai',
            role: 'Operations Head, CloudSync',
            text: 'Beautiful UI, intuitive design, and the holiday calendar is a game-changer for planning.',
            avatar: 'AD',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden">
            {/* ─── Navbar ─── */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-md' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-electric to-violet flex items-center justify-center font-bold text-white shadow-lg shadow-electric/30">
                                H
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric to-violet">
                                HRMS
                            </span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-3">
                            <a href="#features" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-electric transition-colors">Features</a>
                            <a href="#stats" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-electric transition-colors">Why Us</a>
                            <a href="#testimonials" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-electric transition-colors">Testimonials</a>
                            <Link to="/login" className="px-5 py-2 text-sm font-semibold text-electric border border-electric/30 rounded-lg hover:bg-electric/5 transition-all">
                                Login
                            </Link>
                            <Link to="/signup" className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-electric to-violet rounded-lg hover:shadow-lg hover:shadow-electric/30 hover:-translate-y-0.5 transition-all">
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-white/50"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            id="landing-mobile-menu-btn"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-white/95 backdrop-blur-lg rounded-xl shadow-xl p-4 mb-4 animate-fade-in border border-slate-200">
                            <a href="#features" className="block px-4 py-3 text-sm font-medium text-slate-600 hover:text-electric rounded-lg hover:bg-slate-50 transition-colors">Features</a>
                            <a href="#stats" className="block px-4 py-3 text-sm font-medium text-slate-600 hover:text-electric rounded-lg hover:bg-slate-50 transition-colors">Why Us</a>
                            <a href="#testimonials" className="block px-4 py-3 text-sm font-medium text-slate-600 hover:text-electric rounded-lg hover:bg-slate-50 transition-colors">Testimonials</a>
                            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
                                <Link to="/login" className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-electric border border-electric/30 rounded-lg">Login</Link>
                                <Link to="/signup" className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-electric to-violet rounded-lg">Register</Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* ─── Hero Section ─── */}
            <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="landing-blob landing-blob-1"></div>
                    <div className="landing-blob landing-blob-2"></div>
                    <div className="landing-blob landing-blob-3"></div>
                    <div className="landing-grid-bg"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="landing-fade-up" style={{ animationDelay: '0.1s' }}>
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-electric/10 text-electric border border-electric/20 mb-6">
                                <span className="w-2 h-2 rounded-full bg-electric animate-pulse"></span>
                                Next-Gen Human Resource Management
                            </span>
                        </div>

                        <h1 className="landing-fade-up text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6" style={{ animationDelay: '0.2s' }}>
                            Manage Your
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric via-violet to-purple-600"> Workforce </span>
                            Like Never Before
                        </h1>

                        <p className="landing-fade-up text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ animationDelay: '0.3s' }}>
                            Streamline attendance, automate leave management, assign tasks, and empower your team — all from one beautiful, intelligent platform.
                        </p>

                        <div className="landing-fade-up flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: '0.4s' }}>
                            <Link
                                to="/signup"
                                id="hero-get-started-btn"
                                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-electric to-violet rounded-xl hover:shadow-xl hover:shadow-electric/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Get Started Free
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </Link>
                            <Link
                                to="/login"
                                id="hero-login-btn"
                                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-electric hover:text-electric hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                                Employee Login
                            </Link>
                        </div>

                        {/* Admin Portal Link */}
                        <div className="landing-fade-up mt-6" style={{ animationDelay: '0.5s' }}>
                            <Link
                                to="/login"
                                id="hero-admin-btn"
                                className="inline-flex items-center gap-2 text-sm text-violet hover:text-violet-light transition-colors font-medium"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Admin Portal Access
                            </Link>
                        </div>
                    </div>

                    {/* Dashboard Preview Mockup */}
                    <div className="landing-fade-up mt-16 max-w-5xl mx-auto" style={{ animationDelay: '0.6s' }}>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-electric/20 via-violet/20 to-purple-500/20 rounded-2xl blur-2xl"></div>
                            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden">
                                {/* Browser bar */}
                                <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="flex-1 text-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-1 bg-white rounded-md text-xs text-slate-400 border border-slate-200">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                            hrms-app.vercel.app/dashboard
                                        </div>
                                    </div>
                                </div>
                                {/* Dashboard Preview Content */}
                                <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-white">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                                            <p className="text-xs text-slate-400 font-medium mb-1">Leave Balance</p>
                                            <p className="text-3xl font-bold text-slate-800">12 <span className="text-sm font-normal text-slate-400">days</span></p>
                                            <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full w-3/5 bg-gradient-to-r from-electric to-violet rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                                            <p className="text-xs text-slate-400 font-medium mb-1">Today's Status</p>
                                            <p className="text-3xl font-bold text-emerald-600">Present</p>
                                            <p className="text-xs text-slate-400 mt-3">Checked in at 9:02 AM</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                                            <p className="text-xs text-slate-400 font-medium mb-1">Active Tasks</p>
                                            <p className="text-3xl font-bold text-violet">5</p>
                                            <p className="text-xs text-slate-400 mt-3">2 due this week</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Features Section ─── */}
            <section id="features" className="py-20 sm:py-28 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-sm font-semibold text-electric uppercase tracking-wider">Features</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-4">
                            Everything you need to manage your team
                        </h2>
                        <p className="text-slate-500 text-lg">
                            A comprehensive suite of tools designed to simplify HR operations and boost productivity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="landing-fade-up group bg-white rounded-2xl p-7 border border-slate-200 hover:border-electric/30 hover:shadow-xl hover:shadow-electric/5 transition-all duration-500 hover:-translate-y-1"
                                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Stats Section ─── */}
            <section id="stats" className="py-20 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-electric to-violet opacity-[0.03]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="bg-gradient-to-r from-electric to-violet rounded-3xl p-10 sm:p-16 shadow-2xl shadow-electric/20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Trusted by Teams Worldwide</h2>
                            <p className="text-white/70 text-lg">Join hundreds of companies already using HRMS</p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{stat.value}</p>
                                    <p className="text-sm text-white/70 font-medium">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Testimonials Section ─── */}
            <section id="testimonials" className="py-20 sm:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-sm font-semibold text-electric uppercase tracking-wider">Testimonials</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-4">
                            Loved by HR Teams Everywhere
                        </h2>
                        <p className="text-slate-500 text-lg">
                            See what our customers have to say about their experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, index) => (
                            <div
                                key={index}
                                className="landing-fade-up bg-white rounded-2xl p-7 border border-slate-200 hover:shadow-xl hover:shadow-electric/5 transition-all duration-500"
                                style={{ animationDelay: `${0.15 * (index + 1)}s` }}
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric to-violet flex items-center justify-center text-white font-bold text-sm">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                                        <p className="text-xs text-slate-400">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA Section ─── */}
            <section className="py-20 sm:py-28">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="landing-fade-up">
                        <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-6">
                            Ready to Transform Your
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric to-violet"> HR Operations?</span>
                        </h2>
                        <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
                            Join thousands of teams already using HRMS to streamline their workforce management. Get started in minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/signup"
                                id="cta-register-btn"
                                className="w-full sm:w-auto px-10 py-4 text-base font-semibold text-white bg-gradient-to-r from-electric to-violet rounded-xl hover:shadow-xl hover:shadow-electric/30 hover:-translate-y-1 transition-all duration-300"
                            >
                                Create Free Account
                            </Link>
                            <Link
                                to="/login"
                                id="cta-login-btn"
                                className="w-full sm:w-auto px-10 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-electric hover:text-electric transition-all duration-300"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Footer ─── */}
            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric to-violet flex items-center justify-center font-bold text-white text-sm">
                                H
                            </div>
                            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric to-violet">HRMS</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            © {new Date().getFullYear()} HRMS. Built with ❤️ for modern teams.
                        </p>
                        <div className="flex items-center gap-6">
                            <a href="#features" className="text-sm text-slate-400 hover:text-electric transition-colors">Features</a>
                            <Link to="/login" className="text-sm text-slate-400 hover:text-electric transition-colors">Login</Link>
                            <Link to="/signup" className="text-sm text-slate-400 hover:text-electric transition-colors">Register</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
