// src/pages/teacher/TeacherStudentsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../api/axios';
import AddStudentModal from '../../components/teacher/AddStudentModal';
import { 
    MagnifyingGlassIcon, 
    UserPlusIcon, 
    FunnelIcon,
    AcademicCapIcon,
    ChevronRightIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

// --- Interfaces ---
interface Student { full_name: string; roll_number: string; photo: string | null; }
interface Subject { id: number; name: string; students: Student[]; }
interface DashboardData { subjects: Subject[]; }

const TeacherStudentsPage = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const fetchData = () => {
        setLoading(true);
        apiClient.get('/teacher/dashboard/')
            .then(response => {
                setData(response.data);
                const currentSubjects = response.data.subjects || [];
                if (currentSubjects.length > 0) {
                    if (!selectedSubjectId || !currentSubjects.some(s => s.id === selectedSubjectId)) {
                        setSelectedSubjectId(currentSubjects[0].id);
                    }
                }
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const selectedSubject = useMemo(() => {
        return data?.subjects.find(s => s.id === selectedSubjectId) || null;
    }, [data, selectedSubjectId]);

    const filteredStudents = useMemo(() => {
        if (!selectedSubject) return [];
        return selectedSubject.students.filter(student =>
            student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.roll_number.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [selectedSubject, searchTerm]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 border-gray-200"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden p-4 md:p-8">
            
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-red-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* --- Header & Actions --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
                        <p className="text-gray-500 mt-1">Manage enrollment and view profiles.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all font-medium"
                    >
                        <UserPlusIcon className="w-5 h-5" />
                        <span>Add Student</span>
                    </button>
                </div>

                {/* --- Toolbar (Glassmorphism) --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
                    
                    {/* Subject Selector */}
                    <div className="relative w-full md:w-64 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FunnelIcon className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                        </div>
                        <select
                            onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                            value={selectedSubjectId || ''}
                            className="block w-full pl-10 pr-10 py-2.5 border-none bg-gray-50 rounded-xl text-gray-900 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all cursor-pointer font-medium text-sm"
                        >
                            {data?.subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search Bar */}
                    <div className="relative flex-1 w-full group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or roll number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 py-2.5 border-none bg-gray-50 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-sm"
                        />
                    </div>
                </div>

                {/* --- Student Grid --- */}
                {filteredStudents.length > 0 ? (
                    <motion.div 
                        layout 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        <AnimatePresence>
                            {filteredStudents.map(student => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={student.roll_number}
                                >
                                    <Link to={`/teacher/view-student/${student.roll_number}`} className="block group h-full">
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-red-100 transition-all duration-300 h-full flex flex-col items-center text-center relative overflow-hidden">
                                            
                                            {/* Hover Gradient Background */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                            <div className="relative mb-4">
                                                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-red-100 group-hover:to-red-200 transition-colors">
                                                    <img 
                                                        className="w-full h-full rounded-full object-cover bg-white" 
                                                        src={student.photo || `https://ui-avatars.com/api/?name=${student.full_name.replace(' ', '+')}&background=random`} 
                                                        alt="" 
                                                    />
                                                </div>
                                                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-1">
                                                {student.full_name}
                                            </h3>
                                            <p className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                {student.roll_number}
                                            </p>

                                            <div className="mt-auto pt-6 w-full">
                                                <button className="w-full py-2 rounded-xl bg-gray-50 text-gray-600 text-sm font-medium group-hover:bg-red-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                                                    View Profile <ChevronRightIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <AcademicCapIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No students found</h3>
                        <p className="text-gray-500 text-sm mt-1">Try adjusting your search or selected subject.</p>
                    </div>
                )}
            </div>

            <AddStudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
                teacherSubjects={data?.subjects || []}
            />
        </div>
    );
};

export default TeacherStudentsPage;