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
            <div className="min-h-[calc(100vh-80px)] bg-[#FDF9FB] flex items-center justify-center p-8 font-sans">
                <div className="max-w-md w-full">
                    <div className="bg-white p-8 rounded-3xl border border-pink-100 shadow-xl shadow-pink-100/50">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-pink-50 rounded-2xl text-pink-500 shadow-sm">
                                <Settings size={28} strokeWidth={1.5} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-display font-bold mb-2 text-center text-slate-800">Admin Access</h1>
                        <p className="text-slate-500 text-sm mb-8 text-center font-medium">
                            Restricted area. Please verify your identity.
                        </p>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="Enter access code"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all text-center tracking-widest font-mono text-lg shadow-inner"
                                    autoFocus
                                />
                            </div>

                            {showError && (
                                <div className="bg-red-50 text-red-500 text-xs font-bold text-center py-2 rounded-xl animate-bounce">
                                    Incorrect password
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-slate-200 active:scale-95"
                            >
                                Authenticate
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="w-full text-slate-400 hover:text-pink-600 font-medium py-2 rounded-xl transition-colors text-xs"
                            >
                                ← Return to Home
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#FDF9FB] p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white border border-pink-100 rounded-2xl text-pink-500 shadow-sm">
                            <Server size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-slate-800">System Configuration</h1>
                            <p className="text-sm text-slate-500 font-medium">Manage message routing and service filters</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-pink-50 shadow-sm">
                        <Terminal size={12} />
                        <span>v1.0.2-stable</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: List & Edit */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Routes</h2>
                            <span className="text-xs bg-pink-100 text-pink-600 px-2.5 py-0.5 rounded-full font-bold">{services.length} Services</span>
                        </div>

                        {services.map(service => (
                            <div key={service.id} className="bg-white p-6 rounded-3xl border border-pink-50 shadow-sm hover:shadow-md hover:border-pink-100 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-display font-bold text-xl group-hover:bg-pink-50 group-hover:text-pink-500 transition-colors">
                                            {service.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                {service.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 font-mono">ID: {service.id}</p>
                                        </div>
                                    </div>

                                    {editingService?.id === service.id ? (
                                        <div className="flex gap-2">
                                            <button onClick={handleUpdate} className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl text-white text-sm font-bold transition-all shadow-sm active:scale-95">
                                                <Save size={16} /> Save
                                            </button>
                                            <button onClick={handleCancelEdit} className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl text-slate-600 text-sm font-bold transition-colors">
                                                <X size={16} /> Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleEditClick(service)} className="p-2.5 text-slate-300 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all">
                                            <Edit2 size={18} />
                                        </button>
                                    )}
                                </div>

                                {/* Configuration Fields */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Sender Filter */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sender Domain</label>
                                        {editingService?.id === service.id ? (
                                            <input
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono text-slate-800 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all"
                                                value={editingService.sender_filter || ''}
                                                onChange={(e) => setEditingService({ ...editingService, sender_filter: e.target.value })}
                                            />
                                        ) : (
                                            <div className="bg-slate-50/50 px-3 py-2.5 rounded-xl border border-slate-100 text-sm font-mono text-slate-600">
                                                {service.sender_filter || <span className="text-slate-300 italic">No filter set</span>}
                                            </div>
                                        )}
                                    </div>

                                    {/* Subject Filter */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Subject Keywords
                                        </label>
                                        {editingService?.id === service.id ? (
                                            <textarea
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono text-slate-800 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all min-h-[42px] resize-none"
                                                value={editingService.subject_filter || ''}
                                                onChange={(e) => setEditingService({ ...editingService, subject_filter: e.target.value })}
                                                placeholder="Subject 1|Subject 2"
                                            />
                                        ) : (
                                            <div className="bg-slate-50/50 px-3 py-2.5 rounded-xl border border-slate-100 text-sm flex flex-wrap gap-1">
                                                {service.subject_filter ? service.subject_filter.split('|').map((s, i) => (
                                                    <span key={i} className="inline-block bg-white px-2 py-0.5 rounded-md border border-slate-200 text-xs font-mono text-pink-500 font-medium">
                                                        {s}
                                                    </span>
                                                )) : <span className="text-slate-300 italic font-mono">No keywords</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: Create Form */}
                    <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xl shadow-pink-50/50 h-fit sticky top-24">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-pink-50">
                            <div className="p-2 bg-pink-50 rounded-xl text-pink-500">
                                <Plus size={20} />
                            </div>
                            <h2 className="font-bold text-slate-800 text-lg">New Service</h2>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Service Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-50 outline-none transition-all font-medium"
                                    placeholder="e.g. Amazon"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Sender Domain</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-50 outline-none transition-all"
                                    placeholder="e.g. amazon.com"
                                    value={formData.sender_filter}
                                    onChange={e => setFormData({ ...formData, sender_filter: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Subject Keywords</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-50 outline-none transition-all"
                                    placeholder="Order|Receipt"
                                    value={formData.subject_filter}
                                    onChange={e => setFormData({ ...formData, subject_filter: e.target.value })}
                                />
                                <p className="text-[10px] text-slate-400 mt-2 ml-1 font-medium">Separate multiple keywords with |</p>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-slate-200 active:scale-95 text-sm"
                            >
                                + Create Route
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
