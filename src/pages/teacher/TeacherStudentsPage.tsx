// src/pages/teacher/TeacherStudentsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../../api/axios';
import { Link } from 'react-router-dom';
import AddStudentModal from '../../components/teacher/AddStudentModal';

// --- Interfaces (can be moved to a types file later) ---
interface Student { full_name: string; roll_number: string; photo: string | null; }
interface Subject { id: number; name: string; students: Student[]; }
interface DashboardData { subjects: Subject[]; }
// ---

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
                // Preserve selected subject if it still exists, otherwise default to first
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
    }, []); // Fetch data only on initial load

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

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Students Management</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    Add Student
                </button>
            </div>

            {/* Controls: Subject Selector and Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <select
                    onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                    value={selectedSubjectId || ''}
                    className="w-full md:w-1/3 border-gray-300 rounded-md"
                >
                    {data?.subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Search students in this subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-2/3 border-gray-300 rounded-md"
                />
            </div>

            {/* Student List Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll Number</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredStudents.map(student => (
                            <tr key={student.roll_number} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/teacher/view-student/${student.roll_number}`} className="flex items-center group">
                                        <img className="h-10 w-10 rounded-full object-cover" src={student.photo || `https://ui-avatars.com/api/?name=${student.full_name.replace(' ', '+')}&background=random`} alt="" />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">{student.full_name}</div>
                                        </div>
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.roll_number}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredStudents.length === 0 && (
                    <p className="p-4 text-center text-gray-500">No students found.</p>
                )}
            </div>

            <AddStudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData} // Refresh the data on success
                teacherSubjects={data?.subjects || []}
            />
        </div>
    );
};

export default TeacherStudentsPage;