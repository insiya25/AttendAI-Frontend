// src/components/student/EditProjectsModal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PencilIcon, TrashIcon, PlusIcon, FolderIcon } from '@heroicons/react/24/outline';
import apiClient from '../../api/axios';

const EditProjectsModal = ({ projects, onClose, onSuccess }: any) => {
    const [editingProject, setEditingProject] = useState<any>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleEditClick = (project: any) => {
        setEditingProject({ ...project });
        setIsFormVisible(true);
    };

    const handleDelete = async (projectId: number) => {
        if (window.confirm("Delete this project?")) {
            try {
                await apiClient.delete(`/profile/projects/${projectId}/delete/`);
                onSuccess();
            } catch (error) { console.error(error); }
        }
    };

    const handleFormSubmit = async (projectData: any) => {
        const isEditing = !!projectData.id;
        const endpoint = isEditing ? `/profile/projects/${projectData.id}/` : '/profile/projects/';
        const method = isEditing ? 'put' : 'post';

        try {
            await apiClient[method](endpoint, projectData);
            onSuccess();
            setEditingProject(null);
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
                        <h2 className="text-xl font-bold text-gray-900">Project Portfolio</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {isFormVisible ? (
                            <ProjectForm 
                                project={editingProject} 
                                onSubmit={handleFormSubmit} 
                                onCancel={() => { setIsFormVisible(false); setEditingProject(null); }} 
                            />
                        ) : (
                            <div className="space-y-3">
                                <button 
                                    onClick={() => { setEditingProject(null); setIsFormVisible(true); }}
                                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-medium hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <PlusIcon className="w-5 h-5" /> Add New Project
                                </button>

                                {projects.map((project: any) => (
                                    <div key={project.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all group flex justify-between items-start">
                                        <div className="flex gap-4">
                                            <div className="p-3 bg-gray-50 rounded-lg text-gray-400 group-hover:text-red-500 group-hover:bg-red-50 transition-colors">
                                                <FolderIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{project.project_name}</h4>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-0.5">Semester {project.semester}</p>
                                                <p className="text-sm text-gray-500 mt-2 line-clamp-1">{project.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditClick(project)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><PencilIcon className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(project.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><TrashIcon className="w-4 h-4" /></button>
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

const ProjectForm = ({ project, onSubmit, onCancel }: any) => {
    const [formData, setFormData] = useState({ project_name: '', semester: '', description: '' });

    useEffect(() => {
        if (project) setFormData({ project_name: project.project_name, semester: project.semester, description: project.description });
    }, [project]);

    const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ id: project?.id, ...formData }); }} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{project ? 'Edit Project' : 'New Project'}</h3>
            
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Project Name</label>
                <input type="text" name="project_name" value={formData.project_name} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:bg-white focus:outline-none" />
            </div>
            
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Semester</label>
                <select name="semester" value={formData.semester} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:bg-white focus:outline-none">
                    <option value="">Select Semester</option>
                    {[...Array(8).keys()].map(i => <option key={i+1} value={i+1}>Semester {i+1}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:bg-white focus:outline-none resize-none" />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 shadow-lg">Save Project</button>
            </div>
        </form>
    );
};

export default EditProjectsModal;