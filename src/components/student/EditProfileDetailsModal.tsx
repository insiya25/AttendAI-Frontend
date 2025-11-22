// src/components/student/EditProfileDetailsModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import apiClient from '../../api/axios';

const EditProfileDetailsModal = ({ profile, onClose, onSuccess }: any) => {
    const [formData, setFormData] = useState({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone_number: profile.phone_number || '',
        age: profile.age || '',
        class_name: profile.class_name || ''
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handlePhotoChange = (e: any) => setPhotoFile(e.target.files[0]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);
        const submissionData = new FormData();
        Object.keys(formData).forEach(key => submissionData.append(key, (formData as any)[key]));
        if (photoFile) {
            submissionData.append('photo', photoFile);
        }

        try {
            await apiClient.put('/profile/', submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setIsSubmitting(false);
        }
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
                    className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            
                            {/* Photo Upload Area */}
                            <div className="flex justify-center">
                                <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 hover:border-red-400 transition-colors bg-gray-50 flex items-center justify-center cursor-pointer">
                                    {photoFile ? (
                                        <img src={URL.createObjectURL(photoFile)} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-2">
                                            <PhotoIcon className="w-6 h-6 mx-auto text-gray-400 group-hover:text-red-500" />
                                            <span className="text-[10px] text-gray-500 block mt-1">Change Photo</span>
                                        </div>
                                    )}
                                    <input type="file" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <InputGroup label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} />
                                <InputGroup label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup label="Phone" name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} />
                                    <InputGroup label="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
                                </div>
                                <InputGroup label="Class Name" name="class_name" value={formData.class_name} onChange={handleChange} />
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting} 
                                    className="w-full py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-50 shadow-lg shadow-red-200 transition-all transform active:scale-95"
                                >
                                    {isSubmitting ? 'Saving Changes...' : 'Save Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const InputGroup = ({ label, ...props }: any) => (
    <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">{label}</label>
        <input 
            {...props} 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-red-500 focus:bg-white focus:outline-none transition-all placeholder-gray-400 font-medium"
        />
    </div>
);

export default EditProfileDetailsModal;