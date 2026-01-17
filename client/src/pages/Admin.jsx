import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, ArrowLeft, Edit2, Save, X, Settings, Database, Server, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({ name: '', sender_filter: '', subject_filter: '' });
    const [editingService, setEditingService] = useState(null);

    // Password protection
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [showError, setShowError] = useState(false);

    const navigate = useNavigate();

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordInput === '1905') {
            setIsAuthenticated(true);
            setShowError(false);
        } else {
            setShowError(true);
            setTimeout(() => setShowError(false), 2000);
        }
    };

    const fetchServices = async () => {
        try {
            const res = await axios.get('/api/services');
            setServices(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchServices();
        }
    }, [isAuthenticated]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/services', formData);
            setFormData({ name: '', sender_filter: '', subject_filter: '' });
            fetchServices();
        } catch (err) {
            alert('Failed to add service');
        }
    };

    const handleEditClick = (service) => {
        setEditingService({ ...service });
    };

    const handleCancelEdit = () => {
        setEditingService(null);
    };

    const handleUpdate = async () => {
        if (!editingService) return;
        try {
            await axios.put(`/api/admin/services/${editingService.id}`, {
                sender_filter: editingService.sender_filter,
                subject_filter: editingService.subject_filter
            });
            setEditingService(null);
            fetchServices();
        } catch (err) {
            alert('Failed to update service');
            console.error(err);
        }
    };

    // Password prompt screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-[#030712] flex items-center justify-center p-8 transition-colors duration-300">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-[#0B0F19] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
                        <div className="flex justify-center mb-6">
                            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl text-red-500">
                                <Settings size={32} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold mb-2 text-center text-slate-900 dark:text-white">Restricted Access</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 text-center">
                            This area is for system administrators only. <br /> Please authenticate to continue.
                        </p>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="Enter access code"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all text-center tracking-widest font-mono text-lg"
                                    autoFocus
                                />
                            </div>

                            {showError && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-red-500 text-sm text-center animate-fade-in-down">
                                    Access Denied
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-black font-semibold py-3.5 rounded-xl transition-all shadow-lg active:scale-95"
                            >
                                Authenticate
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="w-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium py-3 rounded-xl transition-colors text-sm"
                            >
                                Return to Safety
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-[#030712] p-4 md:p-8 transition-colors duration-300 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                            <Server size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Configuration</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Manage message routing and service filters</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        <Terminal size={12} />
                        <span>v1.0.2-stable</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: List & Edit */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Routes</h2>
                            <span className="text-xs bg-pink-500/10 text-pink-500 px-2 py-0.5 rounded-full font-medium">{services.length} Services</span>
                        </div>

                        {services.map(service => (
                            <div key={service.id} className="bg-white dark:bg-[#0B0F19] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-lg">
                                            {service.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                {service.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 font-mono">Service ID: {service.id}</p>
                                        </div>
                                    </div>

                                    {editingService?.id === service.id ? (
                                        <div className="flex gap-2">
                                            <button onClick={handleUpdate} className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-colors shadow-sm">
                                                <Save size={16} /> Save
                                            </button>
                                            <button onClick={handleCancelEdit} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors">
                                                <X size={16} /> Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleEditClick(service)} className="p-2 text-slate-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10 rounded-lg transition-colors">
                                            <Edit2 size={18} />
                                        </button>
                                    )}
                                </div>

                                {/* Configuration Fields */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Sender Filter */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Sender Domain</label>
                                        {editingService?.id === service.id ? (
                                            <input
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 dark:text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                                                value={editingService.sender_filter || ''}
                                                onChange={(e) => setEditingService({ ...editingService, sender_filter: e.target.value })}
                                            />
                                        ) : (
                                            <div className="bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-mono text-slate-600 dark:text-slate-300">
                                                {service.sender_filter || <span className="text-slate-400 italic">No filter set</span>}
                                            </div>
                                        )}
                                    </div>

                                    {/* Subject Filter */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                                            Subject Keywords
                                        </label>
                                        {editingService?.id === service.id ? (
                                            <textarea
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-900 dark:text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all min-h-[42px] resize-none overflow-hidden"
                                                value={editingService.subject_filter || ''}
                                                onChange={(e) => setEditingService({ ...editingService, subject_filter: e.target.value })}
                                                placeholder="Subject 1|Subject 2"
                                            />
                                        ) : (
                                            <div className="bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm flex flex-wrap gap-1">
                                                {service.subject_filter ? service.subject_filter.split('|').map((s, i) => (
                                                    <span key={i} className="inline-block bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-xs font-mono text-pink-500 dark:text-pink-400">
                                                        {s}
                                                    </span>
                                                )) : <span className="text-slate-400 italic font-mono">No keywords</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: Create Form */}
                    <div className="bg-white dark:bg-[#0B0F19] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit sticky top-20">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-1.5 bg-pink-100 dark:bg-pink-900/20 rounded-lg text-pink-600 dark:text-pink-500">
                                <Plus size={18} />
                            </div>
                            <h2 className="font-bold text-slate-900 dark:text-white">New Service</h2>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Service Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                                    placeholder="e.g. Amazon"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Sender Domain</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-900 dark:text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                                    placeholder="e.g. amazon.com"
                                    value={formData.sender_filter}
                                    onChange={e => setFormData({ ...formData, sender_filter: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Subject Keywords</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-900 dark:text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                                    placeholder="Order|Receipt"
                                    value={formData.subject_filter}
                                    onChange={e => setFormData({ ...formData, subject_filter: e.target.value })}
                                />
                                <p className="text-[10px] text-slate-400 mt-1.5 ml-1">Separate multiple keywords with |</p>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-black font-semibold py-3 rounded-xl transition-all shadow-lg active:scale-95 text-sm"
                            >
                                Create Service Route
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
