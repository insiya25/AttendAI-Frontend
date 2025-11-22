// src/components/teacher/AddStudentModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../api/axios';
import { XMarkIcon, MagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as SolidCheck } from '@heroicons/react/24/solid';

interface Subject { id: number; name: string; }
interface Student { user_id: number; full_name: string; roll_number: string; }
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    teacherSubjects: Subject[];
}

const AddStudentModal = ({ isOpen, onClose, onSuccess, teacherSubjects }: ModalProps) => {
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState<Set<number>>(new Set());
    const [selectedSubjectIds, setSelectedSubjectIds] = useState<Set<number>>(new Set());
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

    const toggleSelection = (id: number, set: Set<number>, setFn: any) => {
        const newSet = new Set(set);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setFn(newSet);
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
            onSuccess();
            onClose();
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
                    />
                    
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Enroll Students</h2>
                                <p className="text-gray-500 text-sm mt-1">Assign students to your subjects.</p>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                            
                            {/* Left Panel: Subjects */}
                            <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-100 p-6 overflow-y-auto">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Select Subjects</h3>
                                <div className="space-y-2">
                                    {teacherSubjects.map(subject => {
                                        const isSelected = selectedSubjectIds.has(subject.id);
                                        return (
                                            <button 
                                                key={subject.id} 
                                                onClick={() => toggleSelection(subject.id, selectedSubjectIds, setSelectedSubjectIds)}
                                                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                                                    isSelected 
                                                    ? 'bg-white border-red-200 shadow-md shadow-red-100' 
                                                    : 'bg-white border-transparent hover:border-gray-200'
                                                }`}
                                            >
                                                <span className={`font-medium ${isSelected ? 'text-red-700' : 'text-gray-700'}`}>
                                                    {subject.name}
                                                </span>
                                                {isSelected ? (
                                                    <SolidCheck className="w-5 h-5 text-red-600" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-gray-300" />
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Right Panel: Students */}
                            <div className="flex-1 p-6 flex flex-col overflow-hidden bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Students</h3>
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-bold">
                                        {selectedStudentIds.size} Selected
                                    </span>
                                </div>

                                {/* Search */}
                                <div className="relative mb-4">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                                    />
                                </div>

                                {/* List */}
                                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                                    {isLoading ? (
                                        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600"></div></div>
                                    ) : (
                                        filteredStudents.map(student => {
                                            const isSelected = selectedStudentIds.has(student.user_id);
                                            return (
                                                <div 
                                                    key={student.user_id} 
                                                    onClick={() => toggleSelection(student.user_id, selectedStudentIds, setSelectedStudentIds)}
                                                    className={`flex items-center p-3 rounded-xl cursor-pointer transition-all border ${
                                                        isSelected ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center mr-4 transition-colors ${
                                                        isSelected ? 'bg-red-600 border-red-600' : 'border-gray-300 bg-white'
                                                    }`}>
                                                        {isSelected && <SolidCheck className="w-4 h-4 text-white" />}
                                                    </div>
                                                    <div>
                                                        <p className={`font-medium text-sm ${isSelected ? 'text-red-900' : 'text-gray-900'}`}>
                                                            {student.full_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{student.roll_number}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    {!isLoading && filteredStudents.length === 0 && (
                                        <p className="text-center text-gray-400 py-8 text-sm">No students found matching "{searchTerm}"</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-4 border-t border-gray-100 bg-white flex justify-between items-center">
                            <p className="text-sm text-red-600 font-medium h-5">{error}</p>
                            <div className="flex gap-3">
                                <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors">
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSubmit} 
                                    disabled={isSubmitting || selectedSubjectIds.size === 0 || selectedStudentIds.size === 0}
                                    className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200 transition-all"
                                >
                                    {isSubmitting ? 'Processing...' : 'Confirm Assignment'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddStudentModal;