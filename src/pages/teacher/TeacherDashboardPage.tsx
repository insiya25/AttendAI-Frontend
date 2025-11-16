// src/pages/teacher/TeacherDashboardPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import apiClient from '../../api/axios';
import StatCard from '../../components/student/StatCard'; // Re-use the student StatCard
import { UsersIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// --- Interfaces ---
interface MonthlyTrend { day: string; presents: number; absents: number; }
interface SubjectData {
    id: number;
    name: string;
    total_students: number;
    present_percentage: number;
    absent_percentage: number;
    monthly_trend: MonthlyTrend[];
}
interface DashboardData { full_name: string; subjects: SubjectData[]; }
// ---

const TeacherDashboardPage = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); // Added error state for better feedback

    useEffect(() => {
        apiClient.get('/teacher/dashboard/')
            .then(response => {
                setData(response.data);
                // Set the initial selected subject ONLY if subjects exist
                if (response.data.subjects && response.data.subjects.length > 0) {
                    setSelectedSubjectId(response.data.subjects[0].id);
                }
            })
            .catch(err => {
                console.error("Failed to fetch dashboard data:", err);
                setError("Could not load dashboard data. Please try again later.");
            })
            .finally(() => setLoading(false));
    }, []);

    const selectedSubjectData = useMemo(() => {
        // Use optional chaining here for safety
        return data?.subjects?.find(s => s.id === selectedSubjectId) || null;
    }, [data, selectedSubjectId]);

    // --- FIX #1: Add robust loading and error states before the main return ---
    if (loading) {
        return <div className="p-8 text-center text-lg">Loading Dashboard...</div>;
    }
    
    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    if (!data || !data.subjects || data.subjects.length === 0) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                    You are not assigned to any subjects yet. Please go to your profile to add subjects.
                </p>
            </div>
        );
    }
    // --- End of FIX #1 ---


    // --- Chart Data ---
    const pieChartData = {
        labels: ['Present', 'Absent'],
        datasets: [{
            data: [selectedSubjectData?.present_percentage || 0, selectedSubjectData?.absent_percentage || 0],
            backgroundColor: ['#4ade80', '#f87171'],
        }],
    };

    const barChartData = {
        labels: selectedSubjectData?.monthly_trend.map(d => d.day) || [],
        datasets: [
            { label: 'Presents', data: selectedSubjectData?.monthly_trend.map(d => d.presents) || [], backgroundColor: '#4ade80' },
            { label: 'Absents', data: selectedSubjectData?.monthly_trend.map(d => d.absents) || [], backgroundColor: '#f87171' },
        ],
    };
    // ---

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
            
            <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Select Subject</label>
                <select id="subject" name="subject"
                    onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                    value={selectedSubjectId || ''}
                    className="mt-1 block w-full md:w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    {/* FIX #2: Use optional chaining on `data.subjects` just in case, though the guard above should prevent this from being an issue. */}
                    {data.subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                </select>
            </div>

            {selectedSubjectData && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <StatCard title="Total Students" value={selectedSubjectData.total_students} icon={UsersIcon} />
                        <StatCard title="Overall Presence" value={`${selectedSubjectData.present_percentage}%`} icon={CheckCircleIcon} />
                        <StatCard title="Overall Absence" value={`${selectedSubjectData.absent_percentage}%`} icon={XCircleIcon} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                            <h3 className="font-semibold mb-2">Monthly Attendance</h3>
                            <Bar data={barChartData} options={{ scales: { x: { stacked: true }, y: { stacked: true } } }} />
                        </div>
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
                            <div className="w-full h-full max-w-xs">
                                <h3 className="font-semibold mb-2 text-center">Attendance Ratio</h3>
                                <Pie data={pieChartData} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TeacherDashboardPage;