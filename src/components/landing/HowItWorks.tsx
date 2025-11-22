import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { 
    CameraIcon, 
    ChartPieIcon, 
    CheckBadgeIcon, 
    UserGroupIcon 
} from '@heroicons/react/24/outline';

// --- Data for the Steps ---
const STEPS = [
    {
        id: 1,
        title: "Teacher Logs In",
        description: "Start your day with a bird's-eye view. The dashboard highlights pending tasks, today's classes, and student leave requests instantly.",
        icon: UserGroupIcon,
        color: "bg-blue-500",
    },
    {
        id: 2,
        title: "Snap & Scan",
        description: "No more roll calls. Open the AI Scanner, take a photo of the attendance sheet, and watch our OCR engine digitize names and signatures in milliseconds.",
        icon: CameraIcon,
        color: "bg-red-500",
    },
    {
        id: 3,
        title: "Instant Analytics",
        description: "Data is processed immediately. View attendance trends, identify chronic absentees, and update semester records automatically.",
        icon: ChartPieIcon,
        color: "bg-purple-500",
    },
    {
        id: 4,
        title: "Skill Verification",
        description: "Students take AI-powered assessments. If they pass, they earn a verified gold badge on their profile, visible to all recruiters/teachers.",
        icon: CheckBadgeIcon,
        color: "bg-yellow-500",
    },
];

const HowItWorks = () => {
    return (
        <section className="relative bg-white py-24 px-6">
             {/* Section Header */}
            <div className="max-w-7xl mx-auto mb-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-block"
                >
                    <span className="py-1 px-3 rounded-full bg-red-50 text-red-600 text-xs font-bold tracking-widest uppercase border border-red-100">
                        Seamless Workflow
                    </span>
                </motion.div>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight"
                >
                    From paper to pixels <br className="hidden md:block" /> in seconds.
                </motion.h2>
            </div>

            <div className="max-w-7xl mx-auto">
                {STEPS.map((step, index) => (
                    <WorkflowStep key={step.id} step={step} index={index} />
                ))}
            </div>
        </section>
    );
};

// --- Individual Step Component with Sticky Logic ---
const WorkflowStep = ({ step, index }: { step: typeof STEPS[0], index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" }); 
    // The margin ensures 'isInView' triggers only when the element is in the CENTER of the screen

    return (
        <div ref={ref} className="flex flex-col md:flex-row items-center justify-between min-h-[80vh] mb-12 md:mb-0">
            
            {/* LEFT: Text Content */}
            <div className="w-full md:w-1/2 pr-0 md:pr-16 mb-12 md:mb-0">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-20%" }}
                >
                    <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center text-white shadow-lg ${step.color}`}>
                        <step.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        {step.title}
                    </h3>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        {step.description}
                    </p>
                    
                    {/* Decorative line that glows when active */}
                    <motion.div 
                        className="h-1 mt-8 rounded-full bg-gray-100 overflow-hidden"
                    >
                         <motion.div 
                            className={`h-full ${step.color}`}
                            initial={{ width: "0%" }}
                            whileInView={{ width: "100%" }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                         />
                    </motion.div>
                </motion.div>
            </div>

            {/* RIGHT: The Visual (Mocks) */}
            {/* This part renders differently based on the step index to show unique UI mocks */}
            <div className="w-full md:w-1/2 relative perspective-1000">
                <motion.div
                     initial={{ opacity: 0, rotateY: 15, scale: 0.9 }}
                     whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                     transition={{ duration: 0.8 }}
                     viewport={{ margin: "-30%" }}
                     className="relative z-10 bg-white rounded-2xl border border-gray-200 shadow-2xl p-2"
                >
                    {/* Glass Reflection Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl pointer-events-none z-20" />
                    
                    {/* Render Specific UI Mockup based on Index */}
                    <div className="bg-gray-50 rounded-xl overflow-hidden aspect-[4/3] relative group">
                        {index === 0 && <DashboardMock />}
                        {index === 1 && <ScanMock />}
                        {index === 2 && <AnalyticsMock />}
                        {index === 3 && <BadgeMock />}
                    </div>
                </motion.div>

                {/* Background Decorative Blob */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] ${step.color} opacity-10 blur-[80px] -z-10`} />
            </div>
        </div>
    );
};

// --- UI MOCKUPS (CSS Art for performance) ---

const DashboardMock = () => (
    <div className="w-full h-full p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
            <div className="w-32 h-4 bg-gray-200 rounded" />
            <div className="w-8 h-8 rounded-full bg-blue-100" />
        </div>
        {/* Cards */}
        <div className="grid grid-cols-2 gap-4">
            <div className="h-24 rounded-lg bg-white shadow-sm border border-gray-100 p-3 flex flex-col justify-between">
                <div className="w-8 h-8 rounded bg-blue-50" />
                <div className="w-16 h-3 bg-gray-200 rounded" />
            </div>
            <div className="h-24 rounded-lg bg-white shadow-sm border border-gray-100 p-3 flex flex-col justify-between">
                <div className="w-8 h-8 rounded bg-red-50" />
                <div className="w-16 h-3 bg-gray-200 rounded" />
            </div>
        </div>
        {/* List */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-3">
             {[1,2,3].map(i => <div key={i} className="w-full h-3 bg-gray-100 rounded" />)}
        </div>
    </div>
);

const ScanMock = () => (
    <div className="w-full h-full relative bg-gray-900 flex items-center justify-center">
        {/* Paper */}
        <div className="w-48 h-64 bg-white rounded shadow-lg flex flex-col items-center p-4 gap-2">
            <div className="w-full h-32 border border-dashed border-gray-300 rounded bg-gray-50" />
            <div className="w-full h-2 bg-gray-200 rounded" />
            <div className="w-3/4 h-2 bg-gray-200 rounded" />
        </div>
        {/* Laser Scanner */}
        <motion.div 
            animate={{ top: ["10%", "90%", "10%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_30px_rgba(239,68,68,1)]"
        />
        {/* Target Frame */}
        <div className="absolute inset-10 border-2 border-red-500/50 rounded-lg corner-box" />
    </div>
);

const AnalyticsMock = () => (
    <div className="w-full h-full p-6 flex items-end justify-center gap-4 bg-white">
        {[40, 80, 60, 100, 50].map((h, i) => (
            <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                transition={{ delay: i * 0.1, duration: 1, type: "spring" }}
                className="w-8 bg-purple-500 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"
            />
        ))}
    </div>
);

const BadgeMock = () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative"
        >
            <div className="w-32 h-32 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-yellow-100">
                <CheckBadgeIcon className="w-16 h-16 text-yellow-500" />
            </div>
            {/* Confetti dots */}
            {[...Array(6)].map((_, i) => (
                <motion.div 
                    key={i}
                    animate={{ 
                        y: [0, -20, 0], 
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                    }}
                    transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: i * 0.2 
                    }}
                    className={`absolute w-2 h-2 rounded-full bg-yellow-400`}
                    style={{ 
                        top: '0%', 
                        left: '50%', 
                        transform: `rotate(${i * 60}deg) translateY(-50px)` 
                    }}
                />
            ))}
        </motion.div>
    </div>
);

export default HowItWorks;