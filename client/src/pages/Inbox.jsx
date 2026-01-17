import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, RefreshCw, Copy, ChevronLeft, ArrowLeft, MoreVertical, Trash2, Inbox as InboxIcon, FileText, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '../context/ThemeContext';

export default function Inbox() {
    const { user } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const serviceId = query.get('serviceId');
    const domain = query.get('domain') || '@catty.my.id';
    const serviceName = serviceId === '2' ? 'Netflix' : 'Inbox';

    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [address] = useState(`${user}${domain}`);

    // Mobile View State
    const [showDetail, setShowDetail] = useState(false);

    const { theme } = useTheme();

    const getThemedBody = (htmlBody) => {
        if (!htmlBody) return '';

        const style = `
            <style>
                body {
                    background-color: #ffffff !important;
                    color: #0f172a !important;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
                    margin: 0;
                    padding: 1.5rem;
                }
                a { color: #db2777 !important; }
                * { border-color: #e2e8f0 !important; }
            </style>
        `;
        return style + htmlBody;
    };

    const fetchEmails = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        try {
            let url = `/api/emails/${user}`;
            if (serviceId) {
                url += `/service/${serviceId}`;
            }
            const res = await axios.get(url);

            // Ensure response is an array
            if (Array.isArray(res.data)) {
                setEmails(res.data);
            } else {
                console.error('API response is not an array:', res.data);
                setEmails([]);
            }
        } catch (err) {
            console.error('Error fetching emails:', err);
            setEmails([]); // Set empty array on error
        } finally {
            if (isRefresh) setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchEmails();
        const interval = setInterval(() => {
            fetchEmails();
        }, 5000);
        return () => clearInterval(interval);
    }, [address, serviceId]);

    const handleSelectEmail = (email) => {
        setSelectedEmail(email);
        setShowDetail(true);
    };

    const handleBackToInbox = () => {
        setShowDetail(false);
        setTimeout(() => setSelectedEmail(null), 300);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address);
    };

    const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

    return (
        <div className="flex h-[calc(100vh-64px)] bg-pink-50/50 overflow-hidden font-sans">

            {/* LEFT COLUMN: Email List */}
            <div className={`
                flex-col w-full md:w-[420px] bg-white border-r-2 border-pink-100 z-10 transition-transform duration-300 flex
                ${showDetail ? 'hidden md:flex' : 'flex'}
            `}>
                {/* Header Section */}
                <div className="flex-none px-4 py-3 border-b-2 border-pink-100 bg-white z-20">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-xl hover:bg-pink-50 text-slate-400 hover:text-pink-600 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="font-black text-xl tracking-tight text-slate-800 italic uppercase">{serviceName} 💅</h1>
                        <div className="w-8"></div>
                    </div>

                    <div className="bg-pink-50 p-3 rounded-2xl border border-pink-100 flex items-center gap-3 shadow-sm">
                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-pink-500 shadow-sm border border-pink-100">
                            <Mail size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-pink-400 font-bold truncate uppercase tracking-wider">Alamat Sementara Kamu</p>
                            <div className="flex items-center gap-1 group cursor-pointer" onClick={copyToClipboard}>
                                <p className="text-sm font-mono font-black text-slate-800 truncate group-hover:text-pink-600 transition-colors">{address}</p>
                                <Copy size={12} className="text-slate-300 group-hover:text-pink-600 opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 py-2 bg-white text-xs border-b-2 border-pink-100">
                    <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ring-2 ring-white border border-slate-100 ${refreshing ? 'bg-amber-400' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></span>
                        <span className="text-slate-600 font-bold">
                            {refreshing ? 'Lagi Sync...' : 'Live Connect ⚡'}
                        </span>
                    </div>
                    <button
                        onClick={() => fetchEmails(true)}
                        className={`p-2 rounded-xl hover:bg-pink-50 text-slate-500 hover:text-pink-600 transition-all border border-transparent hover:border-pink-100 ${refreshing ? 'animate-spin text-pink-600' : ''}`}
                        title="Refresh"
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>

                {/* Email List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {emails.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-4/5 text-slate-400 space-y-4">
                            <div className="p-4 rounded-full bg-pink-50 border border-pink-100">
                                <InboxIcon size={40} className="stroke-1 text-pink-300" />
                            </div>
                            <div className="text-center">
                                <p className="text-base font-bold text-slate-600">Belum ada email masuk nih</p>
                                <p className="text-sm mt-1 max-w-[200px] leading-relaxed">
                                    Waiting for {serviceName === 'Other' ? 'incoming' : serviceName} emails...
                                </p>
                            </div>
                        </div>
                    ) : (
                        emails.map(email => (
                            <div
                                key={email.id}
                                onClick={() => handleSelectEmail(email)}
                                className={`
                                    relative group p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2
                                    ${selectedEmail?.id === email.id
                                        ? 'bg-pink-50 border-pink-200 shadow-sm'
                                        : 'bg-white border-transparent hover:bg-pink-50/50 hover:border-pink-100'}
                                `}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-white
                                            ${selectedEmail?.id === email.id
                                                ? 'bg-pink-500 text-white'
                                                : 'bg-pink-100 text-pink-600'}
                                        `}>
                                            {getInitial(email.from_address)}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className={`text-sm font-bold truncate ${selectedEmail?.id === email.id ? 'text-slate-900' : 'text-slate-600'}`}>
                                                {email.from_address.replace(/<.*>/, '').trim()}
                                            </h3>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 whitespace-nowrap font-bold ml-2 bg-slate-50 px-2 py-1 rounded-full">
                                        {formatDistanceToNow(new Date(email.received_at), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className={`text-sm font-medium mb-1 truncate pl-11 ${selectedEmail?.id === email.id ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-700'}`}>
                                    {email.subject}
                                </p>
                                <p className="text-xs text-slate-400 truncate pl-11 line-clamp-1 font-medium">
                                    {email.text_body ? email.text_body.substring(0, 100) : 'No preview available'}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>


            <div className={`
                flex-1 flex flex-col bg-white transition-all duration-300 relative
                ${showDetail ? 'fixed inset-0 z-50 md:static' : 'hidden md:flex'}
            `}>
                {selectedEmail ? (
                    <>
                        {/* Headers */}
                        <div className="flex-none bg-white border-b-2 border-pink-100 shadow-sm z-10">
                            {/* ... (Header Content Same as Before) ... */}
                            <div className="h-16 px-4 flex items-center justify-between">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <button onClick={handleBackToInbox} className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900">
                                        <ChevronLeft size={24} />
                                    </button>
                                    <h2 className="text-lg font-black text-slate-800 truncate max-w-md">{selectedEmail.subject}</h2>
                                    <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-pink-100 text-pink-500 uppercase tracking-wide">
                                        Inbox
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-pink-50 rounded-xl text-slate-400 hover:text-pink-600 transition-colors" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                    <button className="p-2 hover:bg-pink-50 rounded-xl text-slate-400 hover:text-pink-600 transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Meta Data Row */}
                            <div className="px-4 pb-4 md:px-6 md:pb-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 text-lg font-black border border-pink-100">
                                            {getInitial(selectedEmail.from_address)}
                                        </div>
                                        <div>
                                            <div className="flex items-baseline gap-2">
                                                <p className="font-bold text-slate-900">
                                                    {selectedEmail.from_address.split('<')[0]}
                                                </p>
                                                <span className="text-xs text-slate-400 hidden sm:inline">{selectedEmail.from_address}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                to <span className="text-slate-700 font-bold">{selectedEmail.to_address || address}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-600">
                                            {new Date(selectedEmail.received_at).toLocaleDateString()}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            {new Date(selectedEmail.received_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Email Content Frame */}
                        <div className="flex-1 w-full bg-white relative overflow-hidden">
                            {selectedEmail.html_body ? (
                                <iframe
                                    title="email-content"
                                    srcDoc={getThemedBody(selectedEmail.html_body)}
                                    className="w-full h-full border-none block transition-colors duration-300"
                                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                                />
                            ) : (
                                <div className="h-full overflow-y-auto p-4 md:p-8">
                                    <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                                        <div className="bg-slate-50 dark:bg-zinc-900/50 px-6 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-2">
                                            <FileText size={16} className="text-slate-400" />
                                            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wide">Plain Text Format</span>
                                        </div>
                                        <div className="p-6 md:p-10 font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-300 whitespace-pre-wrap selection:bg-pink-500/20">
                                            {selectedEmail.text_body}
                                        </div>
                                        <div className="bg-slate-50 dark:bg-zinc-900/50 px-6 py-3 border-t border-slate-200 dark:border-zinc-800 text-right">
                                            <button className="text-xs font-medium text-pink-600 dark:text-pink-400 hover:underline flex items-center justify-end gap-1">
                                                <Download size={12} /> Save as .txt
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="hidden md:flex flex-col items-center justify-center h-full text-slate-400 bg-pink-50/30">
                        <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-pink-100/50">
                            <div className="w-32 h-32 bg-pink-50 rounded-3xl flex items-center justify-center">
                                <Mail size={48} className="text-pink-300" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-slate-700 mb-2">Pilih pesan dulu bestie</h2>
                        <p className="text-slate-500 text-center max-w-sm">
                            Klik salah satu email di kiri buat baca isinya yaa~
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
