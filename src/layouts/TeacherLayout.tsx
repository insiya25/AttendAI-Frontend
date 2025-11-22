import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChartBarIcon, 
    UsersIcon, 
    InboxIcon,
    ArrowLeftOnRectangleIcon, 
    Bars3Icon, 
    XMarkIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../store/authStore';

const navigation = [
    { name: 'Dashboard', href: '/teacher/dashboard', icon: ChartBarIcon },
    { name: 'Students', href: '/teacher/students', icon: UsersIcon },
    { name: 'Requests', href: '/teacher/requests', icon: InboxIcon },
];

const TeacherLayout = () => {
    const { logout } = useAuthStore();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const closeMobileMenu = () => setMobileMenuOpen(false);

    // Shared Sidebar Content
    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-extrabold tracking-tight text-gray-900 leading-none">
                            Attend<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900">AI</span>
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Faculty</span>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Management
                </p>
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                            `group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                                isActive
                                    ? 'bg-red-50 text-red-700 shadow-sm ring-1 ring-red-100'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                                        isActive ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'
                                    }`}
                                />
                                {item.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill-teacher"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-red-600"
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-700 transition-colors group"
                >
                    <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* --- Desktop Sidebar --- */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200 shadow-sm z-30">
                <SidebarContent />
            </div>

            {/* --- Mobile Header --- */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 z-40">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900">AttendAI</span>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>
            </div>

            {/* --- Mobile Drawer (Slide Over) --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMobileMenu}
                            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 lg:hidden"
                        />
                        
                        {/* Sidebar Panel */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-50 lg:hidden"
                        >
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    onClick={closeMobileMenu}
                                    className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --- Main Content Wrapper --- */}
            <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
                <main className="flex-1 py-6 lg:py-8 mt-16 lg:mt-0 overflow-x-hidden">
                     <Outlet />
                </main>
            </div>
        </div>
    );
};

export default TeacherLayout;