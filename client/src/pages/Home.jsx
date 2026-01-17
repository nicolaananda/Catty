import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Zap, Play, ChevronRight } from 'lucide-react';

export default function Home() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const [selectedDomain, setSelectedDomain] = useState('@catty.my.id');
    const [isLoading, setIsLoading] = useState(false);
    const domains = ['@catty.my.id', '@cattyprems.top', '@catsflix.site'];

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
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white text-slate-800 font-sans overflow-hidden group">

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Background Image with Blur */}
                <div
                    className="absolute inset-0 bg-[url('/catty-fresh-bg.png')] bg-cover bg-center"
                    style={{
                        filter: 'blur(3px) brightness(1.1)'
                    }}
                ></div>

                {/* Lighter Overlay to let colors pop */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-pink-100/60"></div>
            </div>

            <div className="z-10 w-full max-w-5xl px-6 py-12 flex flex-col items-center text-center">

                {/* Hero Section */}
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight max-w-4xl drop-shadow-sm text-slate-900">
                    Bikin Email Ga Pake Ribet, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600 drop-shadow-md decoration-wavy underline-offset-4">Sat Set Wat Wet! 💅✨</span>
                </h1>

                <p className="text-xl md:text-2xl text-pink-600 mb-8 font-bold drop-shadow-sm italic font-serif">
                    ~ "Email gratisan buat kamu yang ter-kiyowo se-jagat raya" ~
                </p>

                <p className="text-lg text-slate-600 mb-6 max-w-xl leading-relaxed font-medium">
                    Mau daftar akun tapi takut spam? <span className="text-pink-600 font-bold bg-pink-100 px-1 rounded">Catty</span> solusinya bestie! Pilih domain syantikmu dibawah ini 👇
                </p>

                {/* Input Component - Netflix Style */}
                {/* Input Component - Separated for clarity */}
                <div className="w-full max-w-4xl flex flex-col items-center gap-4">

                    {/* Username Input */}
                    <div className="w-full relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                            <Mail className="h-8 w-8 text-pink-500 group-focus-within/input:text-pink-600 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Ketik nama email cantik kamu disini / kosongkan untuk random"
                            className="w-full h-20 pl-20 pr-6 bg-white/90 border-4 border-pink-300 rounded-3xl text-slate-800 placeholder-pink-300/70 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-200 focus:bg-white transition-all text-2xl font-black shadow-lg text-center md:text-left"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleGo()}
                        />
                    </div>

                    {/* Domain Selector & Action - Grouped */}
                    <div className="w-full flex flex-col md:flex-row gap-4">
                        {/* Clearer Domain Selector */}
                        <div className="flex-1 relative h-16 md:h-20 bg-pink-500 rounded-3xl border-4 border-white shadow-xl flex items-center overflow-hidden hover:scale-[1.02] transition-transform group cursor-pointer">
                            {/* <div className="absolute left-6 text-pink-100 font-bold text-xs uppercase tracking-widest pointer-events-none">
                                Pilih Domain
                            </div> */}
                            <select
                                value={selectedDomain}
                                onChange={(e) => setSelectedDomain(e.target.value)}
                                className="w-full h-full bg-transparent text-white px-12 font-black text-xl md:text-2xl outline-none cursor-pointer appearance-none text-center flex items-center justify-center pt-1"
                            >
                                {domains.map(d => (
                                    <option key={d} value={d} className="bg-white text-pink-600 font-bold">{d}</option>
                                ))}
                            </select>
                            <div className="absolute right-6 pointer-events-none text-white bg-pink-400/50 rounded-full p-1">
                                <ChevronRight size={24} className="rotate-90" strokeWidth={3} />
                            </div>
                        </div>

                        <button
                            onClick={handleGo}
                            disabled={isLoading}
                            className="flex-1 h-16 md:h-20 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-2xl md:text-3xl font-black rounded-3xl border-4 border-white shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <span className="animate-spin text-3xl">⏳</span>
                                    <span>OTW...</span>
                                </>
                            ) : (
                                <>
                                    GASAK!! <ChevronRight size={32} strokeWidth={4} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </div>


            </div>

            {/* Random Generator */}
            <div className="mt-6">
                <button
                    onClick={generateRandom}
                    className="flex items-center gap-2 text-pink-500 hover:text-pink-700 transition-colors text-sm font-bold uppercase tracking-widest hover:tracking-wider duration-300 bg-pink-50 px-4 py-2 rounded-full border border-pink-200 hover:bg-pink-100 hover:shadow-md"
                >
                    <Zap size={16} className="text-pink-600 fill-current" /> Pencet Buat Random Aja Deh
                </button>
            </div>

            {/* Service Badge */}
            {/* <div className="mt-16 flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border-2 border-pink-100 shadow-xl shadow-pink-100/50 hover:scale-105 transition-transform cursor-default">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white p-2 rounded-full shadow-lg shadow-pink-500/30 animate-pulse">
                    <Play size={16} fill="currentColor" />
                </div>
                <span className="text-slate-600 font-bold tracking-wide text-sm">Layanan Email <span className="text-pink-600 font-black underline decoration-wavy">GRATIS</span> Tanpa Tapi-Tapian!</span>
            </div> */}

            {/* Footer Links */}
            <div className="mt-24 flex items-center gap-8 text-sm font-bold text-pink-400">
                <button onClick={() => navigate('/admin')} className="hover:underline hover:text-pink-600 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-pink-100 hover:shadow-md">Settingan Admin (Sstt.. 🤫)</button>
                {/* API and Support links removed as per request */}
            </div>

        </div>
    );
}
