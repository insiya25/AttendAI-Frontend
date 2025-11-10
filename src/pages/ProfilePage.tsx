// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import apiClient from '../api/axios';
import Select from 'react-select'; // Import react-select

// Define types for clarity
interface Subject {
    id: number;
    name: string;
}

interface SelectOption {
    value: number;
    label: string;
}

const ProfilePage = () => {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<any>(null);
    const [allSubjects, setAllSubjects] = useState<SelectOption[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<SelectOption[]>([]);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    
    // State for UI feedback
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch both profile and subjects in parallel
                const [profileResponse, subjectsResponse] = await Promise.all([
                    apiClient.get('/profile/'),
                    apiClient.get('/subjects/')
                ]);

                // Set profile data
                setProfile(profileResponse.data);

                // Format subjects for react-select
                const subjectOptions = subjectsResponse.data.map((subject: Subject) => ({
                    value: subject.id,
                    label: subject.name,
                }));
                setAllSubjects(subjectOptions);

                // Set the user's current subjects as the default selected options
                const userSubjectIds = new Set(profileResponse.data.subjects.map((s: Subject) => s.id));
                setSelectedSubjects(subjectOptions.filter((opt: SelectOption) => userSubjectIds.has(opt.value)));

            } catch (err) {
                setError('Failed to fetch initial data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhotoFile(e.target.files[0]);
        }
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsUpdating(true);

        // We MUST use FormData because we are sending a file
        const formData = new FormData();
        
        // Get form data directly
        const formElements = e.currentTarget.elements;
        formData.append('full_name', (formElements.namedItem('full_name') as HTMLInputElement).value);
        formData.append('age', (formElements.namedItem('age') as HTMLInputElement).value);

        if (user?.role === 'student') {
            formData.append('class_name', (formElements.namedItem('class_name') as HTMLInputElement).value);
        }

        // Append selected subject IDs
        selectedSubjects.forEach(option => {
            formData.append('subject_ids', option.value.toString());
        });

        // Append the new photo file ONLY if one was selected
        if (photoFile) {
            formData.append('photo', photoFile);
        }

        try {
            const response = await apiClient.put('/profile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setProfile(response.data); // Update profile state with the response
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile. Please check your inputs.');
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <div className="p-8">Loading profile...</div>;
    if (error && !profile) return <div className="p-8 text-red-500">{error}</div>;


    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h2>
                
                {/* Feedback Messages */}
                {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
                {success && <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>}

                {profile && (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="flex items-center space-x-4">
                            {profile.photo && <img src={profile.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover" />}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Update Profile Photo</label>
                                <input type="file" name="photo" onChange={handlePhotoChange} className="mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
                            </div>
                        </div>

                        {/* ... other form fields ... */}
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="full_name" defaultValue={profile.full_name} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Age</label>
                            <input type="number" name="age" defaultValue={profile.age} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                        </div>

                        {user?.role === 'student' && (
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Class Name</label>
                                <input type="text" name="class_name" defaultValue={profile.class_name} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {user?.role === 'teacher' ? 'Subjects I Teach' : 'My Enrolled Subjects'}
                            </label>
                            <Select
                                isMulti
                                name="subjects"
                                options={allSubjects}
                                value={selectedSubjects}
                                onChange={(options) => setSelectedSubjects(options as SelectOption[])}
                                className="mt-1 basic-multi-select"
                                classNamePrefix="select"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
                            >
                                {isUpdating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;