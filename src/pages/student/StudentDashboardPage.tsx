// src/pages/student/StudentDashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../api/axios';

// Existing Chart Components (To be replaced later)
import AttendanceChart from '../../components/student/AttendanceChart'; 
import StatCard from '../../components/student/StatCard'; // We will replace this internal logic with inline styles for better control
import SubjectAttendanceBarChart from '../../components/student/SubjectAttendanceBarChart';
import AttendanceTrendLineChart from '../../components/student/AttendanceTrendLineChart';

import { 
    BookOpenIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    ClockIcon,
    CalendarDaysIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

// --- Interfaces ---
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

interface DashboardProps {
    studentRollNumber?: string;
}

const StudentDashboardPage = ({ studentRollNumber }: DashboardProps) => {
    const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const endpoint = studentRollNumber
            ? `/teacher/view-student/${studentRollNumber}/`
            : '/student/dashboard/';

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(endpoint);
                setDashboardData(response.data);
            } catch (err) {
                setError('Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [studentRollNumber]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 border-gray-200"></div>
            </div>
        );
    }

    if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;
    if (!dashboardData) return null;

    const { full_name, overall_stats, subjects, attendance_trend } = dashboardData;

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden p-4 md:p-8">
             
             {/* --- Background Effects --- */}
             <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-red-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* --- Header Section --- */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
                >
                    <div>
                        <div className="flex items-center gap-2 text-red-600 font-medium text-sm uppercase tracking-wider mb-1">
                            <SparklesIcon className="w-4 h-4" />
                            <span>Overview</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            {studentRollNumber ? `Dashboard: ${full_name}` : `Welcome back, ${full_name.split(' ')[0]}`}
                        </h1>
                        <p className="text-gray-500 mt-2 max-w-lg">
                            Here is your real-time academic performance and attendance analysis.
                        </p>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm text-gray-600">
                        <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* --- KPI Grid --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DashboardCard 
                            title="Overall Attendance" 
                            value={`${overall_stats.overall_percentage}%`} 
                            icon={ClockIcon} 
                            color="blue"
                            trend={overall_stats.overall_percentage >= 75 ? 'Good' : 'Attention'}
                        />
                        <DashboardCard 
                            title="Total Presents" 
                            value={overall_stats.total_present} 
                            icon={CheckCircleIcon} 
                            color="green"
                        />
                        <DashboardCard 
                            title="Total Absents" 
                            value={overall_stats.total_absent} 
                            icon={XCircleIcon} 
                            color="red"
                        />
                        <DashboardCard 
                            title="Active Subjects" 
                            value={overall_stats.total_subjects} 
                            icon={BookOpenIcon} 
                            color="purple"
                        />
                    </div>

                    {/* --- Main Charts Area --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Trend Chart (Spans 2 cols) */}
                        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 flex flex-col">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Attendance Trend</h3>
                                <p className="text-sm text-gray-500">Daily tracking over the last 30 days</p>
                            </div>
                            <div className="flex-1 min-h-[300px] w-full bg-gray-50 rounded-2xl border border-gray-100 p-4 relative overflow-hidden">
                                {/* Placeholder for the future Recharts Trend Component */}
                                <AttendanceTrendLineChart trendData={attendance_trend} />
                            </div>
                        </motion.div>

                        {/* Distribution Chart (Spans 1 col) */}
                        <motion.div variants={itemVariants} className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 flex flex-col">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Subject Comparison</h3>
                                <p className="text-sm text-gray-500">Performance by class</p>
                            </div>
                            <div className="flex-1 min-h-[300px] w-full bg-gray-50 rounded-2xl border border-gray-100 p-4 relative overflow-hidden">
                                {/* Placeholder for the future Recharts Bar Component */}
                                <SubjectAttendanceBarChart subjects={subjects} />
                            </div>
                        </motion.div>
                    </div>

                    {/* --- Detailed Subject Breakdown --- */}
                    <motion.div variants={itemVariants}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Subject Details</h2>
                            <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                {subjects.length} Subjects Enrolled
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {subjects.map((subject) => (
                                <motion.div 
                                    key={subject.id} 
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col"
                                >
                                    {/* Card Header */}
                                    <div className="p-6 border-b border-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{subject.name}</h3>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                subject.attendance_percentage >= 75 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                                {subject.attendance_percentage}%
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium">Teacher:</span> {subject.teachers.map(t => t.full_name).join(', ') || 'TBA'}
                                        </p>
                                    </div>

                                    {/* Card Body (Chart + Stats) */}
                                    <div className="p-6 flex flex-col items-center">
                                        <div className="w-32 h-32 mb-4 relative">
                                            {/* Placeholder for Future Recharts Pie */}
                                            <AttendanceChart present={subject.present_count} absent={subject.absent_count} />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 w-full gap-4 text-center mt-2">
                                            <div className="bg-green-50 p-2 rounded-xl">
                                                <p className="text-xs text-green-600 font-bold uppercase">Attended</p>
                                                <p className="text-lg font-bold text-gray-900">{subject.present_count}</p>
                                            </div>
                                            <div className="bg-red-50 p-2 rounded-xl">
                                                <p className="text-xs text-red-600 font-bold uppercase">Missed</p>
                                                <p className="text-lg font-bold text-gray-900">{subject.absent_count}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            
                            {subjects.length === 0 && (
                                <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                                    <p className="text-gray-500">No subjects enrolled yet.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

// --- Internal Helper: Modern Stat Card ---
const DashboardCard = ({ title, value, icon: Icon, color, trend }: any) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <motion.div 
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden group"
        >
            {/* Decorative Background Blob */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500 ${colorClasses[color as keyof typeof colorClasses].split(' ')[0]}`} />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        trend === 'Good' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {trend === 'Good' ? 'On Track' : 'Low'}
                    </span>
                )}
            </div>
            
            <div className="relative z-10">
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h4 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h4>
            </div>
        </motion.div>
    );
};

export default StudentDashboardPage;