// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../api/axios';

// Components
import SkillAssessmentModal from '../components/student/SkillAssessmentModal';
import PerformanceChart from '../components/student/PerformanceChart';
import EditProfileDetailsModal from '../components/student/EditProfileDetailsModal';
import EditSkillsModal from '../components/student/EditSkillsModal';
import EditProjectsModal from '../components/student/EditProjectsModal';
import EditPerformanceModal from '../components/student/EditPerformanceModal';

// Icons
import { 
    PencilSquareIcon, 
    EnvelopeIcon, 
    PhoneIcon, 
    AcademicCapIcon, 
    CheckBadgeIcon, 
    PlusIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// --- Type Definitions ---
interface Skill { id: number; skill_name: string; verified: boolean; }
interface Project { id: number; project_name: string; semester: number; description: string; }
interface PerformanceRecord { semester: number; cgpi: number; }
interface ProfileData {
    full_name: string;
    photo: string | null;
    email: string;
    phone_number: string;
    class_name: string;
    skills: Skill[];
    projects: Project[];
    performance_records: PerformanceRecord[];
}

const ProfilePage = () => {
    const navigate = useNavigate(); 
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

    // Modal States
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
    const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
    const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get('/profile/');
            setProfile(response.data);
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const openModal = (skill: Skill) => setSelectedSkill(skill);
    const closeModal = () => setSelectedSkill(null);

    const startAssessment = (skill: Skill) => {
        closeModal();
        navigate(`/assessment/${encodeURIComponent(skill.skill_name)}/${skill.id}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 border-gray-200"></div>
            </div>
        );
    }

    if (!profile) {
        return <div className="p-8 text-center text-gray-500">Could not load profile.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden p-4 md:p-8">
            
            {/* --- Background Effects (Matching Landing Page) --- */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-red-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Page Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex justify-between items-center"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-gray-500">Manage your academic portfolio and skills.</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- LEFT COLUMN: Identity Card --- */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        {/* Profile Main Card */}
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative group">
                            
                            {/* Decorative Cover Gradient */}
                            <div className="h-32 bg-gradient-to-r from-red-500 to-pink-600 relative">
                                <button 
                                    onClick={() => setIsDetailsModalOpen(true)}
                                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-red-600 transition-all shadow-sm"
                                >
                                    <PencilSquareIcon className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Avatar & Info */}
                            <div className="px-6 pb-8 text-center -mt-16">
                                <div className="relative inline-block">
                                    <img 
                                        src={profile.photo || `https://ui-avatars.com/api/?name=${profile.full_name.replace(' ', '+')}&background=f3f4f6&color=374151`} 
                                        alt="Avatar" 
                                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white" 
                                    />
                                </div>
                                
                                <h2 className="mt-4 text-2xl font-bold text-gray-900">{profile.full_name}</h2>
                                <p className="text-red-600 font-medium">{profile.class_name}</p>
                                
                                {/* Contact Mini-List */}
                                <div className="mt-6 space-y-3 text-left">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="p-2 bg-white rounded-full text-gray-400 shadow-sm">
                                            <EnvelopeIcon className="w-4 h-4" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                                            <p className="text-sm text-gray-700 truncate" title={profile.email}>{profile.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="p-2 bg-white rounded-full text-gray-400 shadow-sm">
                                            <PhoneIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Phone</p>
                                            <p className="text-sm text-gray-700">{profile.phone_number || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- RIGHT COLUMN: Skills & Performance --- */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Skills Section */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                                        <CheckBadgeIcon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Verified Skills</h3>
                                </div>
                                <button 
                                    onClick={() => setIsSkillsModalOpen(true)} 
                                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    <PencilSquareIcon className="w-4 h-4" /> Edit
                                </button>
                            </div>

                            {profile.skills.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {profile.skills.map(skill => (
                                        <div key={skill.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-red-100 hover:shadow-md transition-all bg-gray-50/50">
                                            <span className="font-medium text-gray-700 ml-2">{skill.skill_name}</span>
                                            
                                            {skill.verified ? (
                                                <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200">
                                                    <CheckCircleIcon className="w-3 h-3" /> Verified
                                                </span>
                                            ) : (
                                                <button 
                                                    onClick={() => openModal(skill)} 
                                                    className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-full shadow-md shadow-red-200 transition-all"
                                                >
                                                    Verify Now
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-400 text-sm">No skills added yet.</p>
                                    <button onClick={() => setIsSkillsModalOpen(true)} className="mt-2 text-red-600 font-medium text-sm hover:underline">Add your first skill</button>
                                </div>
                            )}
                        </motion.div>

                        {/* Performance Section */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <AcademicCapIcon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Academic Performance</h3>
                                </div>
                                <button 
                                    onClick={() => setIsPerformanceModalOpen(true)} 
                                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    <PencilSquareIcon className="w-4 h-4" /> Manage
                                </button>
                            </div>

                            <div className="h-64 w-full">
                                {profile.performance_records.length > 0 ? (
                                    <PerformanceChart performanceData={profile.performance_records} />
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-gray-400 text-sm">No performance records found.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* --- BOTTOM SECTION: Projects --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Project Showcase</h3>
                        <button 
                            onClick={() => setIsProjectsModalOpen(true)}
                            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 text-sm font-bold"
                        >
                            <PlusIcon className="w-4 h-4" /> Manage Projects
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profile.projects.length > 0 ? (
                            profile.projects.map(project => (
                                <div key={project.id} className="group relative bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-red-500 rounded-l-2xl group-hover:w-3 transition-all" />
                                    <div className="pl-2">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                                Sem {project.semester}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">{project.project_name}</h4>
                                        <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{project.description}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-500">Showcase your best work here.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* --- Modals --- */}
            {isDetailsModalOpen && <EditProfileDetailsModal profile={profile} onClose={() => setIsDetailsModalOpen(false)} onSuccess={fetchProfile} />}
            {isSkillsModalOpen && <EditSkillsModal skills={profile.skills} onClose={() => setIsSkillsModalOpen(false)} onSuccess={fetchProfile} />}
            {isProjectsModalOpen && <EditProjectsModal projects={profile.projects} onClose={() => setIsProjectsModalOpen(false)} onSuccess={fetchProfile} />}
            {isPerformanceModalOpen && <EditPerformanceModal records={profile.performance_records} onClose={() => setIsPerformanceModalOpen(false)} onSuccess={fetchProfile} />}
            <SkillAssessmentModal selectedSkill={selectedSkill} onClose={closeModal} onStart={startAssessment} />
        </div>
    );
};

export default ProfilePage;