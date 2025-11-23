// src/pages/teacher/TeacherProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    PencilSquareIcon, 
    EnvelopeIcon, 
    AcademicCapIcon, 
    BriefcaseIcon, 
    UserGroupIcon
} from '@heroicons/react/24/outline';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import apiClient from '../../api/axios';
import EditTeacherProfileModal from '../../components/teacher/EditTeacherProfileModal';

const TeacherProfilePage = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get('/profile/');
            setProfile(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600"></div></div>;
    if (!profile) return null;

    // Prepare Chart Data
    const chartData = profile.subjects_data.map((s: any) => ({ name: s.name, students: s.student_count }));

    return (
        <div className="min-h-screen bg-gray-50 p-6 relative overflow-hidden">
            
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* --- Header --- */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Faculty Profile</h1>
                    <button 
                        onClick={() => setIsEditOpen(true)}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 hover:text-red-600 transition-all shadow-sm font-medium"
                    >
                        <PencilSquareIcon className="w-5 h-5" /> Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- Left: Identity Card --- */}
                  {/* --- Left: Identity Card (Improved) --- */}
<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
>
    {/* Top Banner */}
    <div className="h-40 bg-gradient-to-br from-red-600 to-red-800 relative">
        <div className="absolute inset-0 opacity-20 bg-[url('/patterns/grid.svg')] bg-cover" />
    </div>

    {/* Profile Image */}
    <div className="relative -mt-20 flex justify-center">
        <img
            src={
                profile.photo ||
                `https://ui-avatars.com/api/?name=${profile.full_name.replace(
                    " ",
                    "+"
                )}&background=ef4444&color=fff`
            }
            alt=""
            className="w-36 h-36 rounded-full shadow-lg border-4 border-white object-cover bg-white"
        />
    </div>

    {/* Basic Info */}
    <div className="px-8 py-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
            {profile.full_name}
        </h2>
        <p className="text-red-600 font-medium">Faculty Member</p>

        {/* Info Boxes */}
        <div className="mt-8 space-y-5">
            {/* Email */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="p-3 bg-white rounded-xl text-red-500 shadow-sm">
                    <EnvelopeIcon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                        Email
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                        {profile.email || "Not provided"}
                    </p>
                </div>
            </div>

            {/* Age */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="p-3 bg-white rounded-xl text-red-500 shadow-sm">
                    <UserGroupIcon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                        Age
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                        {profile.age || "N/A"} years
                    </p>
                </div>
            </div>
        </div>
    </div>
</motion.div>


                    {/* --- Right: Stats & Subjects --- */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Chart Section */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-red-50 rounded-lg text-red-600"><AcademicCapIcon className="w-6 h-6" /></div>
                                <h3 className="text-xl font-bold text-gray-900">Student Distribution</h3>
                            </div>
                            
                            <div className="h-64 w-full">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                            <Tooltip 
                                                cursor={{ fill: '#F9FAFB' }}
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg">
                                                                {payload[0].value} Students
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Bar dataKey="students" radius={[0, 4, 4, 0]} barSize={20}>
                                                {chartData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill="#DC2626" />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
                                        No subjects assigned yet.
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Subjects List */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><BriefcaseIcon className="w-6 h-6" /></div>
                                <h3 className="text-xl font-bold text-gray-900">Subjects Taught</h3>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {profile.subjects_data.length > 0 ? (
                                    profile.subjects_data.map((sub: any) => (
                                        <div key={sub.id} className="group flex items-center gap-3 pl-4 pr-3 py-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-all">
                                            <span className="font-medium text-gray-700 group-hover:text-red-700">{sub.name}</span>
                                            <span className="bg-white text-xs font-bold text-gray-400 px-2 py-1 rounded-md shadow-sm group-hover:text-red-500">
                                                {sub.student_count} Students
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm">No subjects added.</p>
                                )}
                                <button 
                                    onClick={() => setIsEditOpen(true)}
                                    className="px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-medium hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                >
                                    + Add Subject
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {isEditOpen && (
                <EditTeacherProfileModal 
                    profile={profile} 
                    onClose={() => setIsEditOpen(false)} 
                    onSuccess={fetchProfile} 
                />
            )}
        </div>
    );
};

export default TeacherProfilePage;