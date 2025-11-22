// src/components/student/EditSkillsModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import apiClient from '../../api/axios';

const EditSkillsModal = ({ skills, onClose, onSuccess }: any) => {
    const [newSkill, setNewSkill] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    
    const handleAddSkill = async () => {
        if (!newSkill.trim()) return;
        setIsAdding(true);
        try {
            await apiClient.post('/profile/skills/', { skill_name: newSkill });
            setNewSkill('');
            onSuccess();
        } catch (error) {
            console.error("Failed to add skill", error);
        } finally {
            setIsAdding(false);
        }
    };
    
    const handleDeleteSkill = async (skillId: number) => {
        try {
            await apiClient.delete(`/profile/skills/${skillId}/`);
            onSuccess();
        } catch (error) {
            console.error("Failed to delete skill", error);
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
                    className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                >
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                        <h2 className="text-xl font-bold text-gray-900">Manage Skills</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto">
                        {/* Add Skill Input */}
                        <div className="flex gap-2 mb-6">
                            <input 
                                type="text" 
                                value={newSkill} 
                                onChange={(e) => setNewSkill(e.target.value)} 
                                placeholder="E.g. Python, Leadership..." 
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-red-500 focus:bg-white focus:outline-none transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                            />
                            <button 
                                onClick={handleAddSkill} 
                                disabled={isAdding || !newSkill.trim()}
                                className="bg-gray-900 text-white p-3 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
                            >
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Skills List */}
                        <div className="space-y-2">
                            <AnimatePresence>
                                {skills.map((skill: any) => (
                                    <motion.div 
                                        key={skill.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-xl shadow-sm hover:border-red-100 hover:shadow-md transition-all group"
                                    >
                                        <span className="font-medium text-gray-700 ml-2">{skill.skill_name}</span>
                                        <button 
                                            onClick={() => handleDeleteSkill(skill.id)} 
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {skills.length === 0 && (
                                <p className="text-center text-gray-400 text-sm py-4">No skills added yet.</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
                         <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors shadow-sm">
                             Done
                         </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditSkillsModal;