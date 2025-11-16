// src/components/teacher/AddStudentModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../../api/axios';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Subject {
    id: number;
    name: string;
}

interface Student {
    user_id: number;
    full_name: string;
    roll_number: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // To trigger a refresh on the parent page
    teacherSubjects: Subject[];
}

const AddStudentModal = ({ isOpen, onClose, onSuccess, teacherSubjects }: ModalProps) => {
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState<Set<number>>(new Set());
    const [selectedSubjectIds, setSelectedSubjectIds] = useState<Set<number>>(new Set());
    
    // UI Feedback State
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            apiClient.get('/students/all/')
                .then(response => setAllStudents(response.data))
                .catch(() => setError("Failed to load student list."))
                .finally(() => setIsLoading(false));
        } else {
            // Reset state when modal is closed
            setSearchTerm('');
            setSelectedStudentIds(new Set());
            setSelectedSubjectIds(new Set());
            setError('');
        }
    }, [isOpen]);

    const filteredStudents = useMemo(() => {
        return allStudents.filter(student =>
            student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.roll_number.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allStudents, searchTerm]);

    const handleStudentSelect = (studentId: number) => {
        const newSelection = new Set(selectedStudentIds);
        if (newSelection.has(studentId)) {
            newSelection.delete(studentId);
        } else {
            newSelection.add(studentId);
        }
        setSelectedStudentIds(newSelection);
    };
    
    const handleSubjectSelect = (subjectId: number) => {
        const newSelection = new Set(selectedSubjectIds);
        if (newSelection.has(subjectId)) {
            newSelection.delete(subjectId);
        } else {
            newSelection.add(subjectId);
        }
        setSelectedSubjectIds(newSelection);
    };

    const handleSubmit = async () => {
        if (selectedStudentIds.size === 0 || selectedSubjectIds.size === 0) {
            setError("Please select at least one student and one subject.");
            return;
        }
        setError('');
        setIsSubmitting(true);
        try {
            await apiClient.post('/teacher/assign-students/', {
                student_ids: Array.from(selectedStudentIds),
                subject_ids: Array.from(selectedSubjectIds),
            });
            onSuccess(); // Trigger parent refresh
            onClose(); // Close modal
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Add Students to Subjects</h2>
                    <button onClick={onClose}><XMarkIcon className="h-6 w-6" /></button>
                </div>

                <div className="p-4 overflow-y-auto">
                    {/* Step 1: Select Subjects */}
                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-800 mb-2">1. Select Subjects to add students to:</h3>
                        <div className="flex flex-wrap gap-2">
                            {teacherSubjects.map(subject => (
                                <button key={subject.id} onClick={() => handleSubjectSelect(subject.id)}
                                    className={`px-3 py-1 text-sm rounded-full border ${selectedSubjectIds.has(subject.id) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700'}`}
                                >
                                    {subject.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Select Students */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">2. Select Students:</h3>
                        <input
                            type="text"
                            placeholder="Search by name or roll number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md mb-2"
                        />
                        <div className="border rounded-md max-h-64 overflow-y-auto">
                            {isLoading ? <p className="p-4">Loading students...</p> : (
                                <ul className="divide-y">
                                    {filteredStudents.map(student => (
                                        <li key={student.user_id} className="p-2 flex items-center cursor-pointer hover:bg-gray-50" onClick={() => handleStudentSelect(student.user_id)}>
                                            <input type="checkbox" readOnly checked={selectedStudentIds.has(student.user_id)} className="h-4 w-4 mr-3" />
                                            <div>
                                                <p className="font-medium">{student.full_name}</p>
                                                <p className="text-sm text-gray-500">{student.roll_number}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50">
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
                    >
                        {isSubmitting ? 'Adding...' : `Add ${selectedStudentIds.size} Students to ${selectedSubjectIds.size} Subjects`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddStudentModal;