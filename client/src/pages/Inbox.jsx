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
        <div className="flex h-[calc(100vh-64px)] bg-[#FDF9FB] overflow-hidden font-sans">

            {/* LEFT COLUMN: Email List */}
            <div className={`
                flex-col w-full md:w-[420px] bg-white border-r border-pink-50 z-10 transition-transform duration-300 flex
                ${showDetail ? 'hidden md:flex' : 'flex'}
            `}>
                {/* Header Section - Premium & Clean */}
                <div className="flex-none px-6 py-5 bg-white/80 backdrop-blur-xl z-20 sticky top-0">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => navigate('/')} className="group flex items-center gap-2 px-3 py-1.5 -ml-3 rounded-full hover:bg-slate-50 transition-all">
                            <ArrowLeft size={16} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                            <span className="text-sm font-medium text-slate-500 group-hover:text-slate-800">Back</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-pink-500 bg-pink-50 px-2 py-0.5 rounded-md uppercase tracking-wide">Live</span>
                        </div>
                    </div>

                    <div className="space-y-1 mb-6">
                        <h1 className="font-display font-bold text-2xl text-slate-800 tracking-tight">{serviceName}</h1>
                        <p className="text-sm text-slate-400 font-medium">Manage your temporary communications</p>
                    </div>

                    {/* Address Card - Premium Card */}
                    <div className="bg-slate-900 p-4 rounded-2xl shadow-lg shadow-slate-200 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                    <Mail size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Current Address</p>
                                    <p className="text-sm font-mono font-medium text-white truncate max-w-[180px]">{address}</p>
                                </div>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
                                title="Copy Address"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between px-6 py-2 bg-slate-50/50 border-y border-pink-50/50">
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${refreshing ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                            {refreshing ? 'Syncing...' : 'Auto-Sync Active'}
                        </span>
                    </div>
                    <button
                        onClick={() => fetchEmails(true)}
                        className={`p-1.5 rounded-md hover:bg-white text-slate-400 hover:text-pink-600 transition-all ${refreshing ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>

                {/* Email List - Clean & Airy */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {emails.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-2/3 text-slate-400 mt-12">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                                <InboxIcon size={24} className="text-slate-300" />
                            </div>
                            <p className="text-sm font-medium text-slate-600">No messages yet</p>
                            <p className="text-xs mt-1 text-slate-400 max-w-[180px] text-center">
                                Emails will appear here automatically
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {emails.map(email => (
                                <div
                                    key={email.id}
                                    onClick={() => handleSelectEmail(email)}
                                    className={`
                                        relative group p-4 rounded-xl cursor-pointer transition-all duration-200 border
                                        ${selectedEmail?.id === email.id
                                            ? 'bg-white border-pink-200 shadow-[0_4px_20px_rgb(0,0,0,0.03)]'
                                            : 'bg-transparent border-transparent hover:bg-white hover:border-slate-100 hover:shadow-sm'}
                                    `}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`
                                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                                                ${selectedEmail?.id === email.id
                                                    ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200'
                                                    : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-pink-600 group-hover:shadow-sm'}
                                            `}>
                                                {getInitial(email.from_address)}
                                            </div>
                                            <h3 className={`text-sm font-semibold truncate ${selectedEmail?.id === email.id ? 'text-slate-900' : 'text-slate-700'}`}>
                                                {email.from_address.replace(/<.*>/, '').trim()}
                                            </h3>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            {formatDistanceToNow(new Date(email.received_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <div className="pl-11">
                                        <p className={`text-sm font-medium mb-0.5 truncate ${selectedEmail?.id === email.id ? 'text-slate-800' : 'text-slate-600'}`}>
                                            {email.subject}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate line-clamp-1 opacity-80">
                                            {email.text_body ? email.text_body.substring(0, 100) : 'No preview available'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>


            <div className={`
                flex-1 flex flex-col bg-[#FDF9FB] transition-all duration-300 relative
                ${showDetail ? 'fixed inset-0 z-50 md:static' : 'hidden md:flex'}
            `}>
                {selectedEmail ? (
                    <div className="flex flex-col h-full">
                        {/* Detail Header */}
                        <div className="flex-none bg-white/80 backdrop-blur-md border-b border-pink-50 px-6 py-4 z-10 sticky top-0">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <button onClick={handleBackToInbox} className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-900">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className="flex flex-col">
                                        <h2 className="text-lg font-display font-bold text-slate-900 truncate max-w-md leading-tight">{selectedEmail.subject}</h2>
                                        <span className="text-xs text-slate-400 font-medium mt-0.5">{new Date(selectedEmail.received_at).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-pink-500 font-bold border border-slate-100 text-lg shadow-sm">
                                    {getInitial(selectedEmail.from_address)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-slate-900 truncate">{selectedEmail.from_address}</p>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">to <span className="text-slate-700 font-medium">{selectedEmail.to_address || address}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Email Content */}
                        <div className="flex-1 overflow-hidden relative bg-white m-4 rounded-2xl shadow-sm border border-pink-50/50">
                            {selectedEmail.html_body ? (
                                <iframe
                                    title="email-content"
                                    srcDoc={getThemedBody(selectedEmail.html_body)}
                                    className="w-full h-full border-none"
                                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                                />
                            ) : (
                                <div className="p-8 h-full overflow-y-auto">
                                    <div className="prose prose-slate prose-sm max-w-none font-mono bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        {selectedEmail.text_body}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Empty State - Right Side */
                    <div className="hidden md:flex flex-col items-center justify-center h-full text-slate-400">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6 animate-pulse-slow">
                            <Mail size={32} className="text-pink-200" />
                        </div>
                        <h2 className="text-lg font-display font-semibold text-slate-800">Select a message</h2>
                        <p className="text-sm text-slate-400">to view details here</p>
                    </div>
                )}
            </div>
        </div>
    );
}
