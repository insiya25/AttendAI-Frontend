// src/components/student/EditSkillsModal.tsx
import React, { useState } from 'react';
import apiClient from '../../api/axios';
import { XMarkIcon } from '@heroicons/react/24/outline';

const EditSkillsModal = ({ skills, onClose, onSuccess }) => {
    const [newSkill, setNewSkill] = useState('');
    
    const handleAddSkill = async () => {
        if (!newSkill.trim()) return;
        try {
            await apiClient.post('/profile/skills/', { skill_name: newSkill });
            setNewSkill('');
            onSuccess(); // Refresh the profile data on the main page
        } catch (error) {
            console.error("Failed to add skill", error);
        }
    };
    
    const handleDeleteSkill = async (skillId) => {
        try {
            await apiClient.delete(`/profile/skills/${skillId}/`);
            onSuccess();
        } catch (error) {
            console.error("Failed to delete skill", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Edit Skills</h2>
                {/* List of Existing Skills */}
                <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                    {skills.map(skill => (
                        <div key={skill.id} className="flex justify-between items-center bg-gray-900 p-2 rounded">
                            <span>{skill.skill_name}</span>
                            <button onClick={() => handleDeleteSkill(skill.id)} className="text-red-500 hover:text-red-400">
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
                {/* Add New Skill */}
                <div className="flex gap-2">
                    <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add new skill" className="flex-grow bg-gray-900 p-2 rounded" />
                    <button onClick={handleAddSkill} className="px-4 py-2 bg-blue-600 rounded">Add</button>
                </div>
                <div className="text-right mt-4">
                     <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">Done</button>
                </div>
            </div>
        </div>
    );
};

export default EditSkillsModal;