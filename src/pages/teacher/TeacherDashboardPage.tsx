// src/pages/teacher/TeacherDashboardPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../api/axios';
import { 
    UsersIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    AcademicCapIcon,
    CalendarDaysIcon,
    SparklesIcon,
    ChevronDownIcon,
    PresentationChartLineIcon
} from '@heroicons/react/24/outline';

// Recharts Imports
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend
} from 'recharts';

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

const TeacherDashboardPage = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('/teacher/dashboard/');
                setData(response.data);
                if (response.data.subjects && response.data.subjects.length > 0) {
                    setSelectedSubjectId(response.data.subjects[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Could not load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const selectedSubjectData = useMemo(() => {
        return data?.subjects?.find(s => s.id === selectedSubjectId) || null;
    }, [data, selectedSubjectId]);

    // --- Derived Metrics ---
    const classHealth = useMemo(() => {
        if (!selectedSubjectData) return { status: 'N/A', color: 'gray' };
        const p = selectedSubjectData.present_percentage;
        if (p >= 85) return { status: 'Excellent', color: 'green' };
        if (p >= 70) return { status: 'Average', color: 'yellow' };
        return { status: 'Critical', color: 'red' };
    }, [selectedSubjectData]);

    // --- Loading State ---
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 border-gray-200"></div>
            </div>
        );
    }

    if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;

    // --- Empty State ---
    if (!data || !data.subjects || data.subjects.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md border border-gray-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                        <PresentationChartLineIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, Teacher!</h2>
                    <p className="text-gray-500 mb-6">You are not assigned to any subjects yet. Update your profile to start tracking attendance.</p>
                    <button className="bg-red-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-red-700 transition">
                        Go to Profile
                    </button>
                </div>
            </div>
        );
    }

    // --- Animation Variants ---
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
                <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-red-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[30vw] h-[30vw] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* --- Header Section --- */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10"
                >
                    <div>
                        <div className="flex items-center gap-2 text-red-600 font-medium text-sm uppercase tracking-wider mb-1">
                            <SparklesIcon className="w-4 h-4" />
                            <span>Faculty Dashboard</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Hello, {data.full_name.split(' ')[0]}
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Here's what's happening in your classes today.
                        </p>
                    </div>

                    {/* Subject Selector */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
                        <div className="relative flex items-center bg-white rounded-xl border border-gray-200 shadow-sm p-1">
                            <div className="pl-4 pr-2 pointer-events-none">
                                <span className="text-xs font-bold text-gray-400 uppercase mr-2">Subject:</span>
                            </div>
                            <select 
                                value={selectedSubjectId || ''}
                                onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                                className="bg-transparent text-gray-900 font-bold text-sm py-2 pl-0 pr-8 focus:ring-0 border-none cursor-pointer"
                            >
                                {data.subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                                ))}
                            </select>
                            <ChevronDownIcon className="w-4 h-4 text-gray-500 absolute right-3 pointer-events-none" />
                        </div>
                    </div>
                </motion.div>

                {selectedSubjectData && (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        {/* --- KPI Grid --- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <DashboardCard 
                                title="Enrolled Students" 
                                value={selectedSubjectData.total_students} 
                                icon={UsersIcon} 
                                color="blue"
                            />
                            <DashboardCard 
                                title="Avg. Attendance" 
                                value={`${selectedSubjectData.present_percentage}%`} 
                                icon={CheckCircleIcon} 
                                color="green"
                            />
                            <DashboardCard 
                                title="Absence Rate" 
                                value={`${selectedSubjectData.absent_percentage}%`} 
                                icon={XCircleIcon} 
                                color="red"
                            />
                            <DashboardCard 
                                title="Class Health" 
                                value={classHealth.status} 
                                icon={AcademicCapIcon} 
                                color={classHealth.color as any}
                                trend="Analysis"
                            />
                        </div>

                        {/* --- Main Charts Area --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Monthly Trend (Area Chart) */}
                            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 flex flex-col">
                                <div className="mb-6 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Attendance Trends</h3>
                                        <p className="text-sm text-gray-500">Daily participation for current month</p>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                        <CalendarDaysIcon className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1 min-h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={selectedSubjectData.monthly_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorPresents" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2}/>
                                                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                            <RechartsTooltip content={<CustomTooltip />} />
                                            <Area type="monotone" dataKey="presents" stroke="#DC2626" strokeWidth={3} fillOpacity={1} fill="url(#colorPresents)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            {/* Attendance Ratio (Pie Chart) */}
                            <motion.div variants={itemVariants} className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Participation Ratio</h3>
                                    <p className="text-sm text-gray-500">Overall present vs absent</p>
                                </div>
                                <div className="flex-1 min-h-[300px] w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Present', value: selectedSubjectData.present_percentage },
                                                    { name: 'Absent', value: selectedSubjectData.absent_percentage }
                                                ]}
                                                cx="50%" cy="50%"
                                                innerRadius={60} outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                <Cell fill="#10B981" /> {/* Green */}
                                                <Cell fill="#EF4444" /> {/* Red */}
                                            </Pie>
                                            <Legend verticalAlign="bottom" height={36} />
                                            <RechartsTooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    
                                    {/* Center Text Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                                        <div className="text-center">
                                            <span className="block text-3xl font-bold text-gray-900">{selectedSubjectData.present_percentage}%</span>
                                            <span className="text-xs text-gray-400 uppercase font-bold">Turnout</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

// --- Helper Components ---

const DashboardCard = ({ title, value, icon: Icon, color, trend }: any) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-600',
        yellow: 'bg-yellow-50 text-yellow-600',
    };

    return (
        <motion.div 
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden group"
        >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-125 transition-transform duration-500 ${colorClasses[color as keyof typeof colorClasses].split(' ')[0]}`} />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        {trend}
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

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-xl p-3">
                {label && <p className="text-xs font-bold text-gray-400 uppercase mb-1">{label}</p>}
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    <p className="text-lg font-bold text-gray-900">
                        {payload[0].value}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default TeacherDashboardPage;