// src/components/student/EditProfileDetailsModal.tsx
import React, { useState } from 'react';
import apiClient from '../../api/axios';

const EditProfileDetailsModal = ({ profile, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone_number: profile.phone_number || '',
        age: profile.age || '',
        class_name: profile.class_name || ''
    });
    const [photoFile, setPhotoFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handlePhotoChange = (e) => setPhotoFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const submissionData = new FormData();
        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
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
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Edit Profile Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Profile Photo</label>
                        <input type="file" onChange={handlePhotoChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-700 hover:file:bg-gray-600"/>
                    </div>
                    {/* Other Fields */}
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" className="w-full bg-gray-900 p-2 rounded" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full bg-gray-900 p-2 rounded" />
                    <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" className="w-full bg-gray-900 p-2 rounded" />
                    <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" className="w-full bg-gray-900 p-2 rounded" />
                    <input type="text" name="class_name" value={formData.class_name} onChange={handleChange} placeholder="Class Name" className="w-full bg-gray-900 p-2 rounded" />
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 rounded disabled:bg-blue-400">
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileDetailsModal;