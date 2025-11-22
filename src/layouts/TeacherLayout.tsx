// src/layouts/TeacherLayout.tsx
import { NavLink, Outlet } from 'react-router-dom';
import { ChartBarIcon, UsersIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import useAuthStore from '../store/authStore';
import { InboxIcon } from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/teacher/dashboard', icon: ChartBarIcon },
    { name: 'Students', href: '/teacher/students', icon: UsersIcon },
    { name: 'Requests', href: '/teacher/requests', icon: InboxIcon },
    
];

const TeacherLayout = () => {
    const { logout } = useAuthStore();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <h1 className="text-2xl font-bold">Teacher Panel</h1>
                </div>
                <nav className="flex-1 p-2 space-y-1">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive ? 'bg-gray-900' : 'hover:bg-gray-700'
                                }`
                            }
                        >
                            <item.icon className="h-6 w-6 mr-3" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-2 border-t border-gray-700">
                    <button onClick={logout} className="flex items-center w-full px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                        <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default TeacherLayout;