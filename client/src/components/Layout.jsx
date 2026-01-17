import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';

export default function Layout() {
    const location = useLocation();

    // Hide header on home page if desired, but let's keep it minimal
    const isHome = location.pathname === '/';

    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-pink-500/30 bg-white text-slate-900">
            {/* Navigation Bar */}
            <nav className={`
                fixed top-0 w-full z-50 transition-all duration-300
                ${isHome
                    ? 'bg-gradient-to-b from-white/90 to-transparent backdrop-blur-sm'
                    : 'bg-white border-b-2 border-pink-100 shadow-sm'
                }
            `}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <span className="font-bold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-fuchsia-600 uppercase drop-shadow-sm">
                                Catty 💅
                            </span>
                        </Link>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            {!isHome && (
                                <Link
                                    to="/admin"
                                    className="p-2 rounded-xl bg-pink-50 text-pink-400 hover:bg-pink-100 hover:text-pink-600 transition-all shadow-sm border border-pink-100"
                                    title="Admin Panel"
                                >
                                    <Settings size={20} />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className={`flex-grow ${isHome ? 'pt-0' : 'pt-16'}`}>
                <Outlet />
            </main>
        </div>
    );
}
