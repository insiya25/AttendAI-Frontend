// src/pages/student/StudentDashboardPage.tsx
import React, { useEffect, useState } from 'react';
import apiClient from '../../api/axios';
import AttendanceChart from '../../components/student/AttendanceChart';

interface Teacher {
    full_name: string;
}

interface SubjectStats {
    id: number;
    name: string;
    teacher: Teacher | null;
    total_classes: number;
    present_count: number;
    absent_count: number;
    attendance_percentage: number;
}

interface StudentDashboardData {
    full_name: string;
    subjects: SubjectStats[];
}

const StudentDashboardPage = () => {
    const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/student/dashboard/');
                setDashboardData(response.data);
            } catch (err) {
                setError('Failed to fetch dashboard data. Please ensure you are logged in as a student.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Welcome, {dashboardData?.full_name}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardData?.subjects.map((subject) => (
                        <div key={subject.id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800">{subject.name}</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Taught by: {subject.teacher?.full_name || 'N/A'}
                            </p>
                            
                            <div className="w-48 h-48 mx-auto mb-4">
                                <AttendanceChart present={subject.present_count} absent={subject.absent_count} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-600">Attendance:</span>
                                    <span className={`font-bold ${subject.attendance_percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                                        {subject.attendance_percentage}%
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Classes Attended:</span>
                                    <span className="font-medium text-gray-800">{subject.present_count}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Classes Missed:</span>
                                    <span className="font-medium text-gray-800">{subject.absent_count}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Total Classes:</span>
                                    <span className="font-medium text-gray-800">{subject.total_classes}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {dashboardData?.subjects.length === 0 && (
                        <p className="text-gray-600">You are not enrolled in any subjects. Please update your profile.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardPage;