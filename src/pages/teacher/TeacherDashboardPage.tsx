// src/pages/teacher/TeacherDashboardPage.tsx

import React, { useEffect, useState } from 'react';
import apiClient from '../../api/axios';

// Define interfaces for our expected data structure
interface Student {
    full_name: string;
    roll_number: string;
    photo: string | null;
}

interface Subject {
    id: number;
    name: string;
    students: Student[];
}

interface DashboardData {
    full_name: string;
    subjects: Subject[];
}

const TeacherDashboardPage = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/teacher/dashboard/');
                setDashboardData(response.data);
                // Automatically select the first subject if it exists
                if (response.data.subjects && response.data.subjects.length > 0) {
                    setSelectedSubject(response.data.subjects[0]);
                }
            } catch (err) {
                setError('Failed to fetch dashboard data. Please ensure you are logged in as a teacher.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome, {dashboardData?.full_name}
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    {/* Left Column: Subject List */}
                    <div className="md:col-span-1">
                        <div className="px-4 sm:px-0">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">My Subjects</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Select a subject to view the list of enrolled students.
                            </p>
                        </div>
                        <div className="mt-5 bg-white shadow rounded-lg">
                            <ul className="divide-y divide-gray-200">
                                {dashboardData?.subjects.map((subject) => (
                                    <li key={subject.id}>
                                        <button
                                            onClick={() => setSelectedSubject(subject)}
                                            className={`block w-full text-left px-4 py-4 text-sm font-medium ${
                                                selectedSubject?.id === subject.id
                                                    ? 'bg-indigo-50 text-indigo-700'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {subject.name}
                                        </button>
                                    </li>
                                ))}
                                {dashboardData?.subjects.length === 0 && (
                                    <li className="px-4 py-4 text-sm text-gray-500">
                                        You are not assigned to any subjects yet.
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Student List */}
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        {selectedSubject ? (
                            <div className="bg-white shadow sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Students in {selectedSubject.name}
                                    </h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        {selectedSubject.students.length} student(s) enrolled.
                                    </p>
                                </div>
                                <div className="border-t border-gray-200">
                                    <ul className="divide-y divide-gray-200">
                                        {selectedSubject.students.map((student) => (
                                            <li key={student.roll_number} className="p-4 flex items-center">
                                                <img className="h-10 w-10 rounded-full object-cover" src={student.photo || `https://ui-avatars.com/api/?name=${student.full_name.replace(' ', '+')}&background=random`} alt="" />
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">{student.full_name}</p>
                                                    <p className="text-sm text-gray-500">Roll No: {student.roll_number}</p>
                                                </div>
                                            </li>
                                        ))}
                                        {selectedSubject.students.length === 0 && (
                                            <li className="p-4 text-sm text-gray-500">
                                                No students are enrolled in this subject yet.
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                             <div className="text-center p-12 bg-white shadow rounded-lg">
                                <h3 className="text-lg font-medium text-gray-700">Please select a subject to see the student list.</h3>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboardPage;