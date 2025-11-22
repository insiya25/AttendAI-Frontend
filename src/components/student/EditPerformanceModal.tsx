// src/components/student/EditPerformanceModal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PencilIcon, TrashIcon, PlusIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import apiClient from '../../api/axios';

const EditPerformanceModal = ({ records, onClose, onSuccess }: any) => {
    const [editingRecord, setEditingRecord] = useState<any>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleEditClick = (record: any) => {
        setEditingRecord({ ...record });
        setIsFormVisible(true);
    };

    const handleDelete = async (recordId: number) => {
        if (window.confirm("Delete this record?")) {
            try {
                await apiClient.delete(`/profile/performance/${recordId}/delete/`);
                onSuccess();
            } catch (error) { console.error(error); }
        }
    };

    const handleFormSubmit = async (recordData: any) => {
        const isEditing = !!recordData.id;
        const endpoint = isEditing ? `/profile/performance/${recordData.id}/` : '/profile/performance/';
        const method = isEditing ? 'put' : 'post';

        try {
            await apiClient[method](endpoint, recordData);
            onSuccess();
            setEditingRecord(null);
            setIsFormVisible(false);
        } catch (error) { console.error(error); }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
                />
                
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }} 
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h2 className="text-xl font-bold text-gray-900">Academic Records</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {isFormVisible ? (
                            <PerformanceForm 
                                record={editingRecord} 
                                onSubmit={handleFormSubmit} 
                                onCancel={() => { setIsFormVisible(false); setEditingRecord(null); }} 
                            />
                        ) : (
                            <div className="space-y-3">
                                <button 
                                    onClick={() => { setEditingRecord(null); setIsFormVisible(true); }}
                                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <PlusIcon className="w-5 h-5" /> Add Semester Record
                                </button>

                                {records.map((rec: any) => (
                                    <div key={rec.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all group flex justify-between items-center">
                                        <div className="flex gap-4 items-center">
                                            <div className="p-3 bg-gray-50 rounded-lg text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                                                <AcademicCapIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">Semester {rec.semester}</h4>
                                                <div className="flex gap-3 mt-1 text-sm">
                                                    <span className="text-gray-500">CGPI: <strong className="text-gray-800">{rec.cgpi}</strong></span>
                                                    <span className={`font-bold px-2 rounded text-[10px] uppercase tracking-wider py-0.5 ${rec.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {rec.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditClick(rec)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><PencilIcon className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(rec.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const PerformanceForm = ({ record, onSubmit, onCancel }: any) => {
    const [formData, setFormData] = useState({ semester: '', cgpi: '', status: 'pass' });

    useEffect(() => {
        if (record) setFormData({ semester: record.semester, cgpi: record.cgpi, status: record.status });
    }, [record]);

    const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ id: record?.id, ...formData }); }} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{record ? 'Edit Record' : 'New Record'}</h3>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Semester</label>
                    <select name="semester" value={formData.semester} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none">
                        <option value="">Select</option>
                        {[...Array(8).keys()].map(i => <option key={i+1} value={i+1}>{i+1}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CGPI</label>
                    <input type="number" step="0.01" name="cgpi" value={formData.cgpi} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none" />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none">
                    <option value="pass">Pass</option>
                    <option value="fail">Fail</option>
                </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 shadow-lg">Save Record</button>
            </div>
        </form>
    );
};

export default EditPerformanceModal;