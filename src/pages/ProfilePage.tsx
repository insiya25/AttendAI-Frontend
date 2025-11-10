// src/pages/ProfilePage.tsx
import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import apiClient from '../api/axios'; // <-- Use our configured apiClient

const ProfilePage = () => {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/profile/');
                setProfile(response.data);
            } catch (err) {
                setError('Failed to fetch profile data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // We will replace this with a form later to update the profile
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Update functionality to be implemented!");
        // Here you would make a PUT or PATCH request with the updated profile data
        // For example: apiClient.put('/profile/', updatedProfileData);
    }

    if (loading) return <div className="p-8">Loading profile...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h2>
                {profile && (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                value={profile.username}
                                readOnly
                                className="mt-1 block w-full bg-gray-100 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="full_name"
                                defaultValue={profile.full_name}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Age</label>
                            <input
                                type="number"
                                name="age"
                                defaultValue={profile.age}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Student-specific fields */}
                        {user?.role === 'student' && (
                             <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                                    <input
                                        type="text"
                                        value={profile.roll_number}
                                        readOnly
                                        className="mt-1 block w-full bg-gray-100 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Class Name</label>
                                     <input
                                        type="text"
                                        name="class_name"
                                        defaultValue={profile.class_name}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </>
                        )}
                        
                        {/* We will add subject selection and image upload later */}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;