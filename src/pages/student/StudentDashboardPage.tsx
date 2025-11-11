// src/pages/student/StudentDashboardPage.tsx
import React, { useEffect, useState } from 'react';
import apiClient from '../../api/axios';
import AttendanceChart from '../../components/student/AttendanceChart'; // Doughnut chart
import StatCard from '../../components/student/StatCard';
import SubjectAttendanceBarChart from '../../components/student/SubjectAttendanceBarChart';
import AttendanceTrendLineChart from '../../components/student/AttendanceTrendLineChart';

import { BookOpenIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

// --- Define updated interfaces to match backend ---
interface Teacher { full_name: string; }
interface TrendData { date: string; presents: number; }
interface OverallStats {
    total_subjects: number;
    total_present: number;
    total_absent: number;
    overall_percentage: number;
}
interface SubjectStats {
    id: number;
    name: string;
    teachers: Teacher[];
    total_classes: number;
    present_count: number;
    absent_count: number;
    attendance_percentage: number;
}
interface StudentDashboardData {
    full_name: string;
    subjects: SubjectStats[];
    overall_stats: OverallStats;
    attendance_trend: TrendData[];
}
// ---

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

    if (loading) return <div className="p-8 text-center text-lg">Loading Dashboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!dashboardData) return null;

    const { full_name, overall_stats, subjects, attendance_trend } = dashboardData;

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, {full_name}</h1>

                {/* KPI Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <StatCard title="Overall Attendance" value={`${overall_stats.overall_percentage}%`} icon={ClockIcon} />
                    <StatCard title="Total Presents" value={overall_stats.total_present} icon={CheckCircleIcon} />
                    <StatCard title="Total Absents" value={overall_stats.total_absent} icon={XCircleIcon} />
                    <StatCard title="Enrolled Subjects" value={overall_stats.total_subjects} icon={BookOpenIcon} />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                    <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                        <AttendanceTrendLineChart trendData={attendance_trend} />
                    </div>
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <SubjectAttendanceBarChart subjects={subjects} />
                    </div>
                </div>

                {/* Subject Details Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Subject Breakdown</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {subjects.map((subject) => (
                            <div key={subject.id} className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-bold text-gray-800">{subject.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Taught by: {subject.teachers.map(t => t.full_name).join(', ') || 'N/A'}
                                </p>
                                <div className="w-40 h-40 mx-auto mb-4">
                                    <AttendanceChart present={subject.present_count} absent={subject.absent_count} />
                                </div>
                                <div className="text-center font-bold text-lg mb-2">{subject.attendance_percentage}%</div>
                                <div className="text-center text-sm text-gray-600">
                                    ({subject.present_count} / {subject.total_classes} classes attended)
                                </div>
                            </div>
                        ))}
                        {subjects.length === 0 && (
                            <p className="text-gray-600">You are not enrolled in any subjects. Please update your profile.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardPage;