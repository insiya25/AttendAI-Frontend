// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import useAuthStore from '../store/authStore';
import SkillAssessmentModal from '../components/student/SkillAssessmentModal';
import PerformanceChart from '../components/student/PerformanceChart';
import { FaGithub, FaGlobe } from 'react-icons/fa'; // Simplified icons for this example

import { PencilSquareIcon } from '@heroicons/react/24/outline';
import EditProfileDetailsModal from '../components/student/EditProfileDetailsModal';
import EditSkillsModal from '../components/student/EditSkillsModal';

import EditProjectsModal from '../components/student/EditProjectsModal';
import EditPerformanceModal from '../components/student/EditPerformanceModal';

import { useNavigate } from 'react-router-dom';

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
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const navigate = useNavigate(); 
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
    const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
    const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);

     const fetchProfile = async () => {
        // No isLoading(true) here to allow for silent refresh
        try {
            const response = await apiClient.get('/profile/');
            setProfile(response.data);
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setIsLoading(false); // Only set loading false on initial fetch
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get('/profile/');
                setProfile(response.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const openModal = (skill: Skill) => setSelectedSkill(skill);
    const closeModal = () => setSelectedSkill(null);

     const startAssessment = (skill: Skill) => {
        closeModal();
        // NEW: Navigate to the assessment page with skill details in the URL
        navigate(`/assessment/${encodeURIComponent(skill.skill_name)}/${skill.id}`);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div></div>;
    }

    if (!profile) {
        return <div className="p-8 text-center">Could not load profile.</div>;
    }

    return (
        <div className="p-6 max-w-6xl mx-auto text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Profile Card & Details */}
                <div className="md:col-span-1 space-y-6">

                    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                        <button onClick={() => setIsDetailsModalOpen(true)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <PencilSquareIcon className="h-6 w-6" />
                        </button>
                        <img src={profile.photo || `https://ui-avatars.com/api/?name=${profile.full_name.replace(' ', '+')}`} alt="Avatar" className="rounded-full w-44 h-44 border-4 border-gray-600 mx-auto mb-4 object-cover" />
                        <h4 className="text-2xl font-semibold">{profile.full_name}</h4>
                        <p className="text-gray-400 text-lg">{profile.class_name}</p>
                        {/* Add Edit Profile Button later */}
                    </div>
                    <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
                        <h6 className="text-lg font-semibold mb-4">Contact Information</h6>
                        <div className="space-y-4">
                            <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
                            <p><strong>Phone:</strong> {profile.phone_number || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Skills, Projects, Performance */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
                        <h6 className="text-lg font-semibold mb-3">Skills</h6>
                         <button onClick={() => setIsSkillsModalOpen(true)} className="text-gray-400 hover:text-white">
                                <PencilSquareIcon className="h-6 w-6" />
                            </button>
                        {profile.skills.length > 0 ? (
                            profile.skills.map(skill => (
                                <div key={skill.id} className="flex bg-gray-900 justify-between items-center mb-2 p-2 rounded-md">
                                    <span className="text-gray-300">{skill.skill_name}</span>
                                    <div className="flex items-center space-x-2">
                                        {skill.verified ? (
                                <span className="bg-yellow-500 text-gray-900 text-xs font-bold py-1 px-3 rounded-full">
                                    Verified
                                </span>
                            ) : (
                                <button onClick={() => openModal(skill)} className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700">
                                    Verify
                                </button>
                            )}
                                    </div>
                                </div>
                            ))
                        ) : <p className="text-gray-400">No skills listed.</p>}
                    </div>

                    <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
                        <h6 className="text-lg font-semibold mb-4">Performance</h6>
                         <button onClick={() => setIsPerformanceModalOpen(true)} className="text-gray-400 hover:text-white">
                                <PencilSquareIcon className="h-6 w-6" />
                            </button>
                        {profile.performance_records.length > 0 ? (
                            <PerformanceChart performanceData={profile.performance_records} />
                        ) : <p className="text-gray-400">No performance data available.</p>}
                    </div>
                </div>
            </div>

            {/* Full Width Bottom Section: Projects */}
            <div className="bg-gray-800 rounded-2xl mt-6 shadow-lg p-6 w-full">
                <h6 className="text-lg font-semibold mb-4">Projects Showcase</h6>
                <button onClick={() => setIsProjectsModalOpen(true)} className="text-gray-400 hover:text-white">
                        <PencilSquareIcon className="h-6 w-6" />
                    </button>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profile.projects.length > 0 ? (
                        profile.projects.map(project => (
                            <div key={project.id} className="bg-gray-900 p-4 rounded-lg">
                                <h4 className="font-bold text-md">{project.project_name} (Sem {project.semester})</h4>
                                <p className="text-sm text-gray-400 mt-2">{project.description}</p>
                            </div>
                        ))
                    ) : <p className="text-gray-500 text-center col-span-3">No projects added.</p>}
                </div>
            </div>

             
             {isDetailsModalOpen && <EditProfileDetailsModal profile={profile} onClose={() => setIsDetailsModalOpen(false)} onSuccess={fetchProfile} />}
            {isSkillsModalOpen && <EditSkillsModal skills={profile.skills} onClose={() => setIsSkillsModalOpen(false)} onSuccess={fetchProfile} />}
            {isProjectsModalOpen && <EditProjectsModal projects={profile.projects} onClose={() => setIsProjectsModalOpen(false)} onSuccess={fetchProfile} />}
            {isPerformanceModalOpen && <EditPerformanceModal records={profile.performance_records} onClose={() => setIsPerformanceModalOpen(false)} onSuccess={fetchProfile} />}
            <SkillAssessmentModal selectedSkill={selectedSkill} onClose={closeModal} onStart={startAssessment} />
        </div>
    );
};

export default ProfilePage;