import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';

export default function Layout() {
    const location = useLocation();

    const isHome = location.pathname === '/';
    const isInbox = location.pathname.startsWith('/inbox');
    const shouldShowNavbar = !isHome && !isInbox;

    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-pink-500/30 bg-[#FDF9FB] text-slate-900">
            {/* Navigation Bar */}
            {shouldShowNavbar && (
                <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center shadow-md group-hover:shadow-pink-200 transition-all duration-300">
                                    <span className="text-white font-bold text-lg pt-0.5">C</span>
                                </div>
                                <span className="font-display font-bold text-2xl tracking-tight text-slate-800">
                                    Catty
                                </span>
                            </Link>

                            {/* Right Actions */}
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/admin"
                                    className="p-2.5 rounded-full text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300"
                                    title="Admin Settings"
                                >
                                    <Settings size={20} strokeWidth={1.5} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            {/* Main Content */}
            <main className={`flex-grow ${shouldShowNavbar ? 'pt-20' : ''}`}>
                <Outlet />
            </main>
        </div>
    );
}
