import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { 
    ChartBarIcon, 
    ArrowTrendingUpIcon, 
    UserGroupIcon, 
    EllipsisHorizontalIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

const DashboardPreview = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // 3D Tilt Transformation based on scroll
    const rotateX = useTransform(scrollYProgress, [0, 0.5], [20, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0.5, 1]);
    
    // Floating Parallax for Widgets
    const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const y2 = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <section ref={containerRef} className="relative py-32 px-6 bg-white overflow-hidden perspective-1000">
            
            {/* Header Text */}
            <div className="max-w-4xl mx-auto text-center mb-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-wider mb-6"
                >
                    <ChartBarIcon className="w-4 h-4" />
                    Deep Intelligence
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Data that drives <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                        decisions.
                    </span>
                </h2>
                <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
                    A unified dashboard that transforms raw attendance logs into actionable insights using our proprietary AI models.
                </p>
            </div>

            {/* The 3D Dashboard Interface */}
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    style={{ rotateX, scale, opacity, transformStyle: "preserve-3d" }}
                    className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 md:p-4"
                >
                    {/* Browser Window Controls (Decoration) */}
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                        <div className="ml-4 flex-1 h-6 bg-gray-50 rounded-md border border-gray-100 flex items-center px-3 text-[10px] text-gray-400 font-mono">
                            attendai.com/dashboard/analytics
                        </div>
                    </div>

                    {/* Dashboard Grid Layout */}
                    <div className="grid grid-cols-12 gap-4 md:gap-6 h-[600px] md:h-[700px] bg-gray-50 rounded-xl border border-gray-100 p-4 md:p-6 overflow-hidden">
                        
                        {/* Sidebar (Left) */}
                        <div className="hidden md:flex col-span-2 flex-col gap-4 border-r border-gray-200 pr-4">
                            <div className="h-10 w-full bg-red-600 rounded-lg shadow-lg shadow-red-200 mb-6" />
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className={`h-8 w-full rounded-md ${i === 1 ? 'bg-white shadow-sm border border-gray-200' : 'bg-transparent'}`} />
                            ))}
                            <div className="mt-auto h-24 w-full bg-gradient-to-b from-red-50 to-white rounded-xl border border-red-100 p-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full mb-2 flex items-center justify-center text-red-500">
                                    <SparklesIcon className="w-4 h-4" />
                                </div>
                                <div className="w-full h-2 bg-red-100 rounded mb-1" />
                                <div className="w-2/3 h-2 bg-red-100 rounded" />
                            </div>
                        </div>

                        {/* Main Content (Right) */}
                        <div className="col-span-12 md:col-span-10 flex flex-col gap-6">
                            
                            {/* Top Stats Row */}
                            <div className="grid grid-cols-3 gap-4 md:gap-6">
                                <StatCard title="Total Attendance" value="98.2%" change="+2.4%" color="blue" />
                                <StatCard title="Classes Held" value="1,240" change="+12%" color="green" />
                                <StatCard title="AI Flags" value="3" change="-5" color="red" />
                            </div>

                            {/* Main Chart Area */}
                            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Attendance Trends</h3>
                                        <p className="text-sm text-gray-400">Last 30 Days • Computer Science Dept.</p>
                                    </div>
                                    <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <EllipsisHorizontalIcon className="w-6 h-6 text-gray-400" />
                                    </button>
                                </div>

                                {/* CSS Chart Animation */}
                                <div className="relative h-64 w-full flex items-end justify-between gap-2 md:gap-4">
                                    {/* Background Grid Lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                        {[1,2,3,4].map(i => <div key={i} className="w-full h-[1px] bg-gray-100" />)}
                                    </div>

                                    {/* Animated Bars */}
                                    {[40, 70, 55, 90, 65, 85, 50, 75, 60, 95, 80, 100].map((h, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.5, delay: i * 0.05, type: "spring", damping: 15 }}
                                            className="w-full bg-gradient-to-t from-red-500/10 to-red-500/80 rounded-t-md relative group-hover:from-red-600/20 group-hover:to-red-600 transition-all duration-500"
                                        >
                                            {/* Tooltip on Hover */}
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {h}%
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Widgets */}
                            <div className="grid grid-cols-2 gap-6 h-32">
                                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <UserGroupIcon className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <div>
                                        <div className="w-24 h-4 bg-gray-100 rounded mb-2" />
                                        <div className="w-16 h-3 bg-gray-50 rounded" />
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                                        <SparklesIcon className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <div>
                                        <div className="w-24 h-4 bg-gray-100 rounded mb-2" />
                                        <div className="w-16 h-3 bg-gray-50 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FLOATING WIDGETS (Parallax) */}
                    {/* Widget 1: AI Insight */}
                    <motion.div 
                        style={{ y: y1 }}
                        className="absolute -right-8 top-20 w-64 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 hidden md:block"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1">
                                <SparklesIcon className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">AI Insight</h4>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    Attendance in <strong className="text-gray-700">CSE-A</strong> improved by 12% this week.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Widget 2: Real-time Processing */}
                    <motion.div 
                        style={{ y: y2 }}
                        className="absolute -left-12 bottom-40 w-56 bg-gray-900 text-white p-4 rounded-2xl shadow-2xl border border-gray-700 hidden md:block"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-mono text-gray-400">OCR ENGINE</span>
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                <motion.div 
                                    animate={{ width: ["0%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="h-full bg-green-500" 
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 font-mono">Processing Batch #2024...</p>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
            
            {/* Background Gradient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-red-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        </section>
    );
};

// --- Helper Component: Stat Card ---
const StatCard = ({ title, value, change, color }: any) => (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
        <div className="mt-2 flex items-end justify-between">
            <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                color === 'red' ? 'bg-red-50 text-red-600' : 
                color === 'green' ? 'bg-green-50 text-green-600' : 
                'bg-blue-50 text-blue-600'
            }`}>
                {change}
            </span>
        </div>
    </div>
);

export default DashboardPreview;