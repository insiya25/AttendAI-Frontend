import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, SparklesIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import Select from 'react-select'; // Ensure you have react-select installed
import { sendApprovalRequestEmail } from '../../api/emailService';

const StudentApprovalsPage = () => {
    const [approvals, setApprovals] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        teacher: null, // Select Option
        cc_teachers: [] // Array of Select Options
    });
    const [isEnhancing, setIsEnhancing] = useState({ subject: false, message: false });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [appRes, teachRes] = await Promise.all([
                apiClient.get('/student/approvals/'),
                apiClient.get('/teachers/list/')
            ]);
            setApprovals(appRes.data);
            setTeachers(teachRes.data.map(t => ({ value: t.user_id, label: t.full_name })));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnhance = async (field: 'subject' | 'message') => {
        if (!formData[field]) return;
        setIsEnhancing({ ...isEnhancing, [field]: true });
        try {
            const res = await apiClient.post('/ai/enhance/', { text: formData[field], type: field });
            setFormData({ ...formData, [field]: res.data.enhanced_text });
        } catch (err) {
            console.error(err);
        } finally {
            setIsEnhancing({ ...isEnhancing, [field]: false });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.teacher) return;

        try {
            await apiClient.post('/student/approvals/', {
                teacher: formData.teacher.value,
                cc_teachers: formData.cc_teachers.map(t => t.value),
                subject: formData.subject,
                message: formData.message
            });
            
            // Send Email Notification
            // Note: In real app, you might want to fetch teacher's email from backend, 
            // here we assume we are sending to the teacher's name or a generic email for demo
            await sendApprovalRequestEmail(formData.teacher.label, "Student", formData.subject, formData.message);

            setModalOpen(false);
            setFormData({ subject: '', message: '', teacher: null, cc_teachers: [] });
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Failed to submit", error);
        }
    };

    return (
        <div className="p-6 md:p-8 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Approvals</h1>
                <button 
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all font-medium"
                >
                    <PlusIcon className="w-5 h-5" /> New Request
                </button>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {approvals.map((app: any) => (
                    <motion.div 
                        key={app.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{app.subject}</h3>
                                <p className="text-sm text-gray-500 mt-1">To: <span className="font-medium text-gray-700">{app.teacher_name}</span></p>
                                <p className="text-sm text-gray-400 mt-2 line-clamp-2">{app.message}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                app.status === 'approved' ? 'bg-green-100 text-green-700' :
                                app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                            }`}>
                                {app.status}
                            </span>
                        </div>
                    </motion.div>
                ))}
                {approvals.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-gray-400">No approval requests found.</div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">New Approval Request</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">To (Teacher)</label>
                                            <Select 
                                                options={teachers} 
                                                value={formData.teacher}
                                                onChange={(val: any) => setFormData({...formData, teacher: val})}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">CC (Optional)</label>
                                            <Select 
                                                isMulti
                                                options={teachers} 
                                                value={formData.cc_teachers}
                                                onChange={(val: any) => setFormData({...formData, cc_teachers: val})}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Subject</label>
                                            <button type="button" onClick={() => handleEnhance('subject')} className="text-xs flex items-center gap-1 text-red-600 hover:text-red-700 font-medium">
                                                <SparklesIcon className="w-3 h-3" /> {isEnhancing.subject ? 'Enhancing...' : 'Enhance with AI'}
                                            </button>
                                        </div>
                                        <input 
                                            type="text" 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                            value={formData.subject}
                                            onChange={e => setFormData({...formData, subject: e.target.value})}
                                            placeholder="e.g. Leave Application"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Message</label>
                                            <button type="button" onClick={() => handleEnhance('message')} className="text-xs flex items-center gap-1 text-red-600 hover:text-red-700 font-medium">
                                                <SparklesIcon className="w-3 h-3" /> {isEnhancing.message ? 'Enhancing...' : 'Enhance with AI'}
                                            </button>
                                        </div>
                                        <textarea 
                                            rows={5}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                            value={formData.message}
                                            onChange={e => setFormData({...formData, message: e.target.value})}
                                            placeholder="Type your request here..."
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium">Cancel</button>
                                        <button type="submit" className="px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 font-medium flex items-center gap-2">
                                            <PaperAirplaneIcon className="w-4 h-4" /> Send Request
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentApprovalsPage;