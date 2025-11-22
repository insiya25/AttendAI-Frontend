import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { sendApprovalDecisionEmail } from '../../api/emailService';

const TeacherRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);

    useEffect(() => {
        apiClient.get('/teacher/approvals/').then(res => setRequests(res.data));
    }, []);

    const handleDecision = async (status: 'approved' | 'rejected') => {
        if (!selectedRequest) return;
        try {
            await apiClient.put(`/teacher/approvals/${selectedRequest.id}/update/`, { status });
            
            // Send Email to Student
            await sendApprovalDecisionEmail(selectedRequest.student_name, "Teacher", status === 'approved' ? 'Approved' : 'Rejected', selectedRequest.subject);

            // Update local state
            setRequests(prev => prev.map((r: any) => r.id === selectedRequest.id ? {...r, status} : r) as any);
            setSelectedRequest(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6 md:p-8 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Approval Requests</h1>

            <div className="grid gap-4">
                {requests.map((req: any) => (
                    <motion.div 
                        key={req.id}
                        layoutId={`req-${req.id}`}
                        onClick={() => setSelectedRequest(req)}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer group"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    req.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                    req.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }`}>
                                    <EnvelopeIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">{req.subject}</h3>
                                    <p className="text-sm text-gray-500">From: {req.student_name}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold uppercase tracking-wide text-gray-400 block mb-1">Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                    req.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                                    req.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>{req.status}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div 
                            layoutId={`req-${selectedRequest.id}`}
                            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedRequest.subject}</h2>
                                        <p className="text-sm text-gray-500 mt-1">From: <span className="font-semibold text-gray-900">{selectedRequest.student_name}</span></p>
                                        {selectedRequest.cc_names.length > 0 && (
                                            <p className="text-xs text-gray-400 mt-1">CC: {selectedRequest.cc_names.join(', ')}</p>
                                        )}
                                    </div>
                                    <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">Close</button>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed mb-8">
                                    {selectedRequest.message}
                                </div>

                                {selectedRequest.status === 'pending' ? (
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => handleDecision('rejected')}
                                            className="flex-1 py-3 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 flex items-center justify-center gap-2"
                                        >
                                            <XCircleIcon className="w-5 h-5" /> Reject
                                        </button>
                                        <button 
                                            onClick={() => handleDecision('approved')}
                                            className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                                        >
                                            <CheckCircleIcon className="w-5 h-5" /> Approve
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center p-3 bg-gray-100 rounded-xl text-gray-500 font-medium">
                                        Request already {selectedRequest.status}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherRequestsPage;