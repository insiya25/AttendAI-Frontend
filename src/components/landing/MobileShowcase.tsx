import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
    QrCodeIcon, 
    CheckCircleIcon, 
    AcademicCapIcon, 
    BellIcon,
    ChartBarIcon
} from '@heroicons/react/24/solid';

const MobileShowcase = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax Movement for Phones
    const yLeft = useTransform(scrollYProgress, [0, 1], [200, -100]);
    const yRight = useTransform(scrollYProgress, [0, 1], [400, -200]);
    const rotateLeft = useTransform(scrollYProgress, [0, 1], [-10, 0]);
    const rotateRight = useTransform(scrollYProgress, [0, 1], [10, 0]);

    // Floating Background Shapes
    const shapeY = useTransform(scrollYProgress, [0, 1], [0, -300]);
    const rotateShape = useTransform(scrollYProgress, [0, 1], [0, 360]);

    return (
        <section ref={containerRef} className="relative py-32 px-6 bg-white overflow-hidden min-h-[120vh]">
            
            {/* --- Background Decor --- */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Gradient Orb */}
                <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[60vw] h-[60vw] bg-red-500/5 rounded-full blur-[100px]" />
                
                {/* Floating 3D Shapes */}
                <motion.div 
                    style={{ y: shapeY, rotate: rotateShape }}
                    className="absolute top-[20%] left-[10%] w-24 h-24 border-[3px] border-red-100 rounded-3xl opacity-60 hidden md:block"
                />
                <motion.div 
                    style={{ y: shapeY, rotate: rotateShape }}
                    className="absolute top-[40%] right-[10%] w-16 h-16 bg-gradient-to-br from-red-100 to-transparent rounded-full opacity-60 hidden md:block"
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
                
                {/* Header Text */}
                <div className="text-center max-w-3xl mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block py-1 px-4 rounded-full bg-gray-900 text-white text-xs font-bold uppercase tracking-widest mb-6 shadow-lg"
                    >
                        Mobile First Design
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-none"
                    >
                        Your Campus.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
                            In Your Pocket.
                        </span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 text-xl text-gray-500"
                    >
                        Everything you need, accessible from anywhere. 
                        Attendance tracking, leave approvals, and skill verification—all in a tap.
                    </motion.p>
                </div>

                {/* Phones Container */}
                <div className="relative w-full max-w-4xl h-[600px] flex justify-center gap-8 md:gap-16 perspective-1000">
                    
                    {/* --- Left Phone (Teacher View) --- */}
                    <motion.div 
                        style={{ y: yLeft, rotate: rotateLeft }}
                        className="relative z-20"
                    >
                        <PhoneFrame color="black">
                            <TeacherScreen />
                        </PhoneFrame>
                        
                        {/* Floating Notification Badge */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -left-12 top-32 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 w-48"
                        >
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <CheckCircleIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-800">Leave Approved</p>
                                <p className="text-[10px] text-gray-500">Insiya sent a request</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* --- Right Phone (Student View) --- */}
                    <motion.div 
                        style={{ y: yRight, rotate: rotateRight }}
                        className="relative z-10 mt-24 md:mt-32"
                    >
                        <PhoneFrame color="white">
                            <StudentScreen />
                        </PhoneFrame>

                         {/* Floating Notification Badge */}
                         <motion.div 
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-12 top-20 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 w-48"
                        >
                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                <AcademicCapIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-800">Skill Verified</p>
                                <p className="text-[10px] text-gray-500">Python Assessment</p>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>

            </div>
        </section>
    );
};

// --- Reusable Phone Frame Component (CSS Art) ---
const PhoneFrame = ({ children, color }: { children: React.ReactNode, color: 'black' | 'white' }) => {
    const borderColor = color === 'black' ? 'bg-gray-900' : 'bg-white border-4 border-gray-100';
    const shadow = color === 'black' ? 'shadow-2xl' : 'shadow-2xl shadow-gray-200';

    return (
        <div className={`relative w-[280px] h-[580px] ${borderColor} rounded-[3rem] p-3 ${shadow}`}>
            {/* Inner Bezel */}
            <div className="relative w-full h-full bg-black rounded-[2.5rem] overflow-hidden border-[6px] border-black">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-28 bg-black z-20 rounded-b-xl flex items-center justify-center gap-2">
                    <div className="w-12 h-1 rounded-full bg-gray-800/50" />
                    <div className="w-1 h-1 rounded-full bg-blue-900/50" />
                </div>
                
                {/* Status Bar Time */}
                <div className="absolute top-2 left-6 text-white text-[10px] font-bold z-20">9:41</div>
                <div className="absolute top-2 right-6 flex gap-1 z-20">
                     <div className="w-3 h-2 bg-white rounded-[1px]" />
                     <div className="w-3 h-2 bg-white rounded-[1px]" />
                </div>

                {/* Screen Content */}
                <div className="w-full h-full bg-white pt-8 pb-4 px-4 relative">
                    {children}
                </div>
                
                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-900 rounded-full z-20" />
            </div>

            {/* Side Buttons */}
            <div className="absolute top-24 -left-1 w-1 h-8 bg-gray-400 rounded-l-sm" />
            <div className="absolute top-36 -left-1 w-1 h-12 bg-gray-400 rounded-l-sm" />
            <div className="absolute top-28 -right-1 w-1 h-16 bg-gray-400 rounded-r-sm" />
        </div>
    );
};

// --- Teacher Screen Mockup ---
const TeacherScreen = () => (
    <div className="flex flex-col h-full">
        {/* App Header */}
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Dashboard</h3>
            <div className="p-2 bg-gray-100 rounded-full"><BellIcon className="w-4 h-4 text-gray-600" /></div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-3 mb-6">
            <div className="flex-1 bg-red-50 p-3 rounded-2xl">
                <p className="text-xs text-red-500 font-bold">Present</p>
                <p className="text-xl font-bold text-gray-900">84%</p>
            </div>
            <div className="flex-1 bg-gray-50 p-3 rounded-2xl">
                <p className="text-xs text-gray-500 font-bold">Absent</p>
                <p className="text-xl font-bold text-gray-900">16%</p>
            </div>
        </div>

        {/* Big Scan Button */}
        <div className="bg-gray-900 text-white rounded-3xl p-6 flex flex-col items-center justify-center gap-4 shadow-lg shadow-red-500/20 relative overflow-hidden">
            {/* Pulse Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-pink-600 opacity-20 animate-pulse" />
            
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/40">
                <QrCodeIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
                <h4 className="text-lg font-bold">Scan Sheet</h4>
                <p className="text-xs text-gray-400">AI Detection Ready</p>
            </div>
        </div>

        {/* List */}
        <div className="mt-6 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase">Recent Activity</p>
            {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <div className="flex-1">
                        <div className="w-20 h-2 bg-gray-800 rounded mb-1" />
                        <div className="w-12 h-2 bg-gray-200 rounded" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// --- Student Screen Mockup ---
const StudentScreen = () => (
    <div className="flex flex-col h-full">
         {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-pink-500 p-[2px]">
                <div className="w-full h-full bg-white rounded-full p-[2px]">
                    <img src="https://ui-avatars.com/api/?name=Student&background=random" className="rounded-full" alt="" />
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-900">Hello, Insiya</h3>
                <p className="text-xs text-gray-400">Computer Science • Sem 5</p>
            </div>
        </div>

        {/* Attendance Graph */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 mb-6">
            <div className="flex justify-between mb-4">
                <h4 className="font-bold text-gray-800 text-sm">Attendance</h4>
                <ChartBarIcon className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-end gap-2 h-24">
                {[40, 60, 35, 80, 65, 90, 75].map((h, i) => (
                    <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                        className="flex-1 bg-gradient-to-t from-red-500 to-pink-500 rounded-t-md opacity-80"
                    />
                ))}
            </div>
        </div>

        {/* Skills */}
        <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase">Verified Skills</p>
            <div className="flex flex-wrap gap-2">
                {['Python', 'React', 'Design'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-full border border-gray-200 flex items-center gap-1">
                        <CheckCircleIcon className="w-3 h-3 text-yellow-500" /> {skill}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

export default MobileShowcase;