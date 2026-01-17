import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Zap, Play, ChevronRight } from 'lucide-react';

export default function Home() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const [selectedDomain, setSelectedDomain] = useState('@catty.my.id');
    const [isLoading, setIsLoading] = useState(false);
    const domains = ['@catty.my.id', '@cattyprems.top'];

    const handleGo = () => {
        setIsLoading(true);
        setTimeout(() => {
            const names = ['gemoy', 'lucu', 'imut', 'kece', 'ganteng', 'cantik', 'manis', 'cool', 'top', 'hoki', 'mantap', 'gaul'];
            let targetUser = username.trim();

            // Strip domain if pasted
            domains.forEach(d => {
                if (targetUser.endsWith(d)) {
                    targetUser = targetUser.replace(d, '');
                }
            });

            if (!targetUser) {
                targetUser = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 10000);
            }

            // Navigate without serviceId to show ALL
            navigate(`/inbox/${targetUser}?domain=${encodeURIComponent(selectedDomain)}`);
            setIsLoading(false);
        }, 800); // 800ms delay for smooth UX
    };

    const generateRandom = () => {
        const names = ['gemoy', 'lucu', 'imut', 'kece', 'ganteng', 'cantik', 'manis', 'cool', 'top', 'hoki', 'mantap', 'gaul'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomNumber = Math.floor(Math.random() * 10000);
        setUsername(`${randomName}${randomNumber}`);
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center font-sans overflow-hidden bg-[#FDF9FB]">

            {/* Elegant Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-pink-200/40 to-rose-100/30 blur-[80px]" />
                <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-100/30 to-purple-100/30 blur-[60px]" />
            </div>

            <div className="z-10 w-full max-w-4xl px-6 py-12 flex flex-col items-center text-center animate-fade-in-up">

                {/* Hero Section */}
                <div className="mb-12 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-pink-100 shadow-sm mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                        </span>
                        <span className="text-xs font-medium text-slate-500 tracking-wide uppercase">Temporary Email Service</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-slate-900 leading-[1.1]">
                        Disposable email, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">simply elegant.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                        Protect your personal inbox with a professional-grade temporary address.
                        No spam, no tracking, just <span className="font-medium text-slate-900">Catty</span>.
                    </p>
                </div>

                {/* Main Action Card */}
                <div className="w-full max-w-2xl bg-white rounded-3xl p-3 shadow-xl shadow-pink-100/50 border border-pink-50 ring-4 ring-pink-50/50 transition-all hover:shadow-2xl hover:shadow-pink-100/70">
                    <div className="flex flex-col md:flex-row gap-3">

                        <div className="flex-1 relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Enter username"
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 border-transparent rounded-2xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-medium text-lg"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleGo()}
                            />
                        </div>

                        <div className="relative md:w-48">
                            <select
                                value={selectedDomain}
                                onChange={(e) => setSelectedDomain(e.target.value)}
                                className="w-full h-14 bg-slate-50 text-slate-700 font-medium text-base px-4 pr-10 rounded-2xl outline-none appearance-none cursor-pointer border-transparent hover:bg-slate-100 focus:ring-2 focus:ring-pink-100 transition-all"
                            >
                                {domains.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronRight size={18} className="rotate-90" />
                            </div>
                        </div>

                        <button
                            onClick={handleGo}
                            disabled={isLoading}
                            className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white text-base font-semibold rounded-2xl shadow-lg shadow-slate-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                        >
                            {isLoading ? (
                                <span className="animate-spin text-xl">◌</span>
                            ) : (
                                <>
                                    Create <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Random Generator */}
                <div className="mt-8">
                    <button
                        onClick={generateRandom}
                        className="group flex items-center gap-2 text-slate-400 hover:text-pink-600 transition-colors text-sm font-medium"
                    >
                        <Zap size={16} className="group-hover:fill-pink-100 transition-colors" />
                        Generate Random Address
                    </button>
                </div>

            </div>

            {/* Footer */}
            <div className="absolute bottom-8 text-center">
                <p className="text-slate-400 text-sm font-light">
                    © {new Date().getFullYear()} Catty Service. <button onClick={() => navigate('/admin')} className="hover:text-pink-500 transition-colors ml-1">Administration</button>
                </p>
            </div>

        </div>
    );
}
