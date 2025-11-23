// src/components/teacher/EditTeacherProfileModal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PhotoIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as SolidCheck } from '@heroicons/react/24/solid';
import apiClient from '../../api/axios';

const EditTeacherProfileModal = ({ profile, onClose, onSuccess }: any) => {
    const [formData, setFormData] = useState({
        full_name: profile.full_name || '',
        email: profile.email || '',
        age: profile.age || '',
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [allSubjects, setAllSubjects] = useState<any[]>([]);
    const [selectedSubjectIds, setSelectedSubjectIds] = useState<Set<number>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load existing subjects and fetch all available subjects
    useEffect(() => {
        const currentIds = new Set(profile.subjects_data.map((s: any) => s.id));
        setSelectedSubjectIds(currentIds as Set<number>); // Fix type assertion

        apiClient.get('/subjects/').then(res => setAllSubjects(res.data));
    }, [profile]);

    const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handlePhotoChange = (e: any) => setPhotoFile(e.target.files[0]);

    const toggleSubject = (id: number) => {
        const newSet = new Set(selectedSubjectIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedSubjectIds(newSet);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);
        const submissionData = new FormData();
        Object.keys(formData).forEach(key => submissionData.append(key, (formData as any)[key]));
        if (photoFile) submissionData.append('photo', photoFile);
        
        // Append Subject IDs
        Array.from(selectedSubjectIds).forEach(id => submissionData.append('subject_ids', id.toString()));

        try {
            await apiClient.put('/profile/', submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                    
                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h2 className="text-xl font-bold text-gray-900">Edit Faculty Profile</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400"><XMarkIcon className="w-6 h-6" /></button>
                    </div>

                    <div className="p-8 overflow-y-auto">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Photo & Personal Info */}
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex justify-center">
                                    <div className="relative group w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-300 hover:border-red-400 bg-gray-50 flex items-center justify-center cursor-pointer">
                                        {photoFile ? <img src={URL.createObjectURL(photoFile)} alt="" className="w-full h-full object-cover" /> : <div className="text-center text-gray-400"><PhotoIcon className="w-8 h-8 mx-auto" /><span className="text-xs block mt-1">Upload</span></div>}
                                        <input type="file" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-red-500 outline-none" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-red-500 outline-none" />
                                        <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-red-500 outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Subject Selection */}
                            <div>
                                <label className="block text-sm font-bold text-gray-500 uppercase mb-3">Teaching Subjects</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {allSubjects.map((sub: any) => {
                                        const isSelected = selectedSubjectIds.has(sub.id);
                                        return (
                                            <div key={sub.id} onClick={() => toggleSubject(sub.id)} className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all ${isSelected ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                                                <span className={`font-medium ${isSelected ? 'text-red-700' : 'text-gray-700'}`}>{sub.name}</span>
                                                {isSelected ? <SolidCheck className="w-5 h-5 text-red-600" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-200" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all shadow-lg">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditTeacherProfileModal;