// src/components/student/EditPerformanceModal.tsx
import React, { useState } from 'react';
import apiClient from '../../api/axios';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const EditPerformanceModal = ({ records, onClose, onSuccess }) => {
    const [editingRecord, setEditingRecord] = useState(null);

    const handleEditClick = (record) => setEditingRecord({ ...record });
    
    const handleDelete = async (recordId) => {
        if (window.confirm("Are you sure you want to delete this performance record?")) {
            try {
                await apiClient.delete(`/profile/performance/${recordId}/delete/`);
                onSuccess();
            } catch (error) {
                console.error("Failed to delete record", error);
            }
        }
    };
    
    const handleFormSubmit = async (recordData) => {
        const isEditing = !!recordData.id;
        const endpoint = isEditing ? `/profile/performance/${recordData.id}/` : '/profile/performance/';
        const method = isEditing ? 'put' : 'post';

        try {
            await apiClient[method](endpoint, recordData);
            onSuccess();
            setEditingRecord(null);
        } catch (error) {
            console.error(`Failed to ${isEditing ? 'update' : 'add'} record`, error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Edit Performance</h2>
                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="space-y-3 mb-6">
                        {records.map(rec => (
                            <div key={rec.id} className="flex justify-between items-center bg-gray-900 p-3 rounded">
                                <div>
                                    <p className="font-semibold">Semester {rec.semester}</p>
                                    <p className="text-sm text-gray-400">CGPI: {rec.cgpi} - Status: <span className={rec.status === 'pass' ? 'text-green-400' : 'text-red-400'}>{rec.status}</span></p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button onClick={() => handleEditClick(rec)} className="text-blue-400 hover:text-blue-300"><PencilIcon className="h-5 w-5" /></button>
                                    <button onClick={() => handleDelete(rec.id)} className="text-red-500 hover:text-red-400"><TrashIcon className="h-5 w-5" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <PerformanceForm 
                        record={editingRecord}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setEditingRecord(null)}
                    />
                </div>
                <div className="text-right mt-4 pt-4 border-t border-gray-700">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">Done</button>
                </div>
            </div>
        </div>
    );
};

const PerformanceForm = ({ record, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({ semester: '', cgpi: '', status: 'pass' });

    React.useEffect(() => {
        if (record) {
            setFormData({ semester: record.semester, cgpi: record.cgpi, status: record.status });
        } else {
            setFormData({ semester: '', cgpi: '', status: 'pass' });
        }
    }, [record]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ id: record?.id, ...formData });
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2">{record ? 'Edit Record' : 'Add New Record'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3 bg-gray-900 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-3">
                    <select name="semester" value={formData.semester} onChange={handleChange} required className="bg-gray-700 p-2 rounded">
                        <option value="">Semester</option>
                        {[...Array(8).keys()].map(i => <option key={i+1} value={i+1}>{i+1}</option>)}
                    </select>
                    <input type="number" step="0.01" name="cgpi" value={formData.cgpi} onChange={handleChange} placeholder="CGPI" required className="bg-gray-700 p-2 rounded" />
                    <select name="status" value={formData.status} onChange={handleChange} required className="bg-gray-700 p-2 rounded">
                        <option value="pass">Pass</option>
                        <option value="fail">Fail</option>
                    </select>
                </div>
                <div className="flex justify-end space-x-2">
                    {record && <button type="button" onClick={onCancel} className="px-3 py-1 bg-gray-600 rounded">Cancel</button>}
                    <button type="submit" className="px-3 py-1 bg-blue-600 rounded">{record ? 'Update Record' : 'Add Record'}</button>
                </div>
            </form>
        </div>
    );
};

export default EditPerformanceModal;