// src/components/student/EditProjectsModal.tsx
import React, { useState } from 'react';
import apiClient from '../../api/axios';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// This component will manage both the list and the add/edit form
const EditProjectsModal = ({ projects, onClose, onSuccess }) => {
    // State to manage which project is currently being edited
    const [editingProject, setEditingProject] = useState(null);

    const handleEditClick = (project) => {
        setEditingProject({ ...project }); // Create a copy to edit
    };

    const handleDelete = async (projectId) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                await apiClient.delete(`/profile/projects/${projectId}/delete/`);
                onSuccess();
            } catch (error) {
                console.error("Failed to delete project", error);
            }
        }
    };

    const handleFormSubmit = async (projectData) => {
        const isEditing = !!projectData.id;
        const endpoint = isEditing ? `/profile/projects/${projectData.id}/` : '/profile/projects/';
        const method = isEditing ? 'put' : 'post';

        try {
            await apiClient[method](endpoint, projectData);
            onSuccess();
            setEditingProject(null); // Close the form after submission
        } catch (error) {
            console.error(`Failed to ${isEditing ? 'update' : 'add'} project`, error);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Edit Projects</h2>

                <div className="flex-1 overflow-y-auto pr-2">
                    {/* List of existing projects */}
                    <div className="space-y-3 mb-6">
                        {projects.map(project => (
                            <div key={project.id} className="flex justify-between items-center bg-gray-900 p-3 rounded">
                                <div>
                                    <p className="font-semibold">{project.project_name} (Sem {project.semester})</p>
                                    <p className="text-sm text-gray-400">{project.description.substring(0, 50)}...</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button onClick={() => handleEditClick(project)} className="text-blue-400 hover:text-blue-300"><PencilIcon className="h-5 w-5" /></button>
                                    <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-400"><TrashIcon className="h-5 w-5" /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add/Edit Form */}
                    <ProjectForm 
                        project={editingProject} 
                        onSubmit={handleFormSubmit} 
                        onCancel={() => setEditingProject(null)} 
                    />
                </div>
                
                <div className="text-right mt-4 pt-4 border-t border-gray-700">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">Done</button>
                </div>
            </div>
        </div>
    );
};

// A sub-component for the form to keep state organized
const ProjectForm = ({ project, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        project_name: '',
        semester: '',
        description: '',
    });

    // When the 'project' prop changes (i.e., user clicks edit), populate the form
    React.useEffect(() => {
        if (project) {
            setFormData({
                project_name: project.project_name,
                semester: project.semester,
                description: project.description,
            });
        } else {
            // Reset form when adding a new project or cancelling
            setFormData({ project_name: '', semester: '', description: '' });
        }
    }, [project]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ id: project?.id, ...formData });
    };

    const isEditing = !!project;

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2">{isEditing ? 'Edit Project' : 'Add New Project'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3 bg-gray-900 p-4 rounded-lg">
                <input type="text" name="project_name" value={formData.project_name} onChange={handleChange} placeholder="Project Name" required className="w-full bg-gray-700 p-2 rounded" />
                <select name="semester" value={formData.semester} onChange={handleChange} required className="w-full bg-gray-700 p-2 rounded">
                    <option value="">Select Semester</option>
                    {[...Array(8).keys()].map(i => <option key={i+1} value={i+1}>Semester {i+1}</option>)}
                </select>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required rows="3" className="w-full bg-gray-700 p-2 rounded"></textarea>
                <div className="flex justify-end space-x-2">
                    {isEditing && <button type="button" onClick={onCancel} className="px-3 py-1 bg-gray-600 rounded">Cancel</button>}
                    <button type="submit" className="px-3 py-1 bg-blue-600 rounded">{isEditing ? 'Update Project' : 'Add Project'}</button>
                </div>
            </form>
        </div>
    );
};

export default EditProjectsModal;