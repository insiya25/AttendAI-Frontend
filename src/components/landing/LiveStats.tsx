import React, { useEffect, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { BoltIcon, AcademicCapIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

// --- Fake Live Data Feed ---
const ACTIVITIES = [
    { id: 1, text: "Insiya Rizvi verified 'Python'", type: "skill" },
    { id: 2, text: "Class 3B Attendance marked", type: "attendance" },
    { id: 3, text: "Prof. Ifrah approved leave", type: "approval" },
    { id: 4, text: "Insiya Rizvi added 'React Project'", type: "project" },
    { id: 5, text: "System Optimization Complete", type: "system" },
];

const LiveStats = () => {
    return (
        <section className="relative py-24 px-6 bg-gray-50 overflow-hidden">
            
            {/* Background Decor: faint grid to make it look technical */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                
                {/* LEFT: The Numbers & Text */}
                <div className="flex flex-col gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-red-600 font-bold tracking-widest uppercase text-sm mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                            Live Ecosystem
                        </h2>
                        <h3 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Scale.</span><br />
                            Ready for <span className="italic font-serif text-gray-500 font-normal">Action.</span>
                        </h3>
                        <p className="mt-6 text-lg text-gray-500 max-w-lg">
                            Watch your campus come alive. From instant OCR processing to real-time skill verification, see the impact as it happens.
                        </p>
                    </motion.div>

                    {/* Counting Stats */}
                    <div className="grid grid-cols-2 gap-8 mt-4">
                        <StatCounter label="Active Students" target={1200} suffix="+" />
                        <StatCounter label="Classes Managed" target={45} suffix="" />
                        <StatCounter label="Hours Saved" target={850} suffix="h" />
                        <StatCounter label="Accuracy Rate" target={99} suffix="%" />
                    </div>
                </div>

                {/* RIGHT: The Neural Network Visualization */}
                <div className="relative h-[500px] w-full flex items-center justify-center">
                    <NeuralNetwork />
                    <ActivityFeed />
                </div>
            </div>
        </section>
    );
};

// --- Sub-Component: Animated Counters ---
const StatCounter = ({ label, target, suffix }: { label: string, target: number, suffix: string }) => {
    const [count, setCount] = useState(0);
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const duration = 2000; // 2 seconds
            const steps = 60;
            const increment = target / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);
            return () => clearInterval(timer);
        }
    }, [isInView, target]);

    return (
        <div ref={ref}>
            <h4 className="text-5xl font-bold text-gray-900 mb-1 tabular-nums">
                {count}{suffix}
            </h4>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        </div>
    );
};

// --- Sub-Component: Neural Network SVG Animation ---
const NeuralNetwork = () => {
    return (
        <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Central Hub */}
                <motion.circle 
                    cx="200" cy="200" r="30" 
                    className="fill-white stroke-red-100 stroke-4"
                    animate={{ strokeWidth: [1, 10, 1], opacity: [0.8, 0.2, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <circle cx="200" cy="200" r="15" className="fill-red-500" />

                {/* Satellite Nodes */}
                <Node cx="100" cy="100" delay={0} />
                <Node cx="300" cy="100" delay={1} />
                <Node cx="100" cy="300" delay={2} />
                <Node cx="300" cy="300" delay={3} />

                {/* Connecting Lines with Data Packets */}
                <Connection x1="200" y1="200" x2="100" y2="100" delay={0} />
                <Connection x1="200" y1="200" x2="300" y2="100" delay={1.5} />
                <Connection x1="200" y1="200" x2="100" y2="300" delay={0.5} />
                <Connection x1="200" y1="200" x2="300" y2="300" delay={2} />
            </svg>
        </div>
    );
};

const Node = ({ cx, cy, delay }: { cx: string, cy: string, delay: number }) => (
    <motion.circle 
        cx={cx} cy={cy} r="8" 
        className="fill-white stroke-gray-200 stroke-2"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay, type: "spring" }}
    />
);

const Connection = ({ x1, y1, x2, y2, delay }: { x1: string, y1: string, x2: string, y2: string, delay: number }) => {
    return (
        <>
            {/* Static Line */}
            <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-gray-200 stroke-1" />
            {/* Moving Packet */}
            <motion.circle r="3" className="fill-red-500">
                <animateMotion 
                    dur="2s" 
                    repeatCount="indefinite" 
                    path={`M${x1},${y1} L${x2},${y2}`} 
                    begin={`${delay}s`}
                />
            </motion.circle>
            {/* Reverse Packet */}
             <motion.circle r="2" className="fill-gray-400">
                <animateMotion 
                    dur="3s" 
                    repeatCount="indefinite" 
                    path={`M${x2},${y2} L${x1},${y1}`} 
                    begin={`${delay + 1}s`}
                />
            </motion.circle>
        </>
    )
};

// --- Sub-Component: Floating Activity Feed ---
const ActivityFeed = () => {
    const [activeActivity, setActiveActivity] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveActivity((prev) => (prev + 1) % ACTIVITIES.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute z-20 w-full h-full flex items-center justify-center pointer-events-none">
            {ACTIVITIES.map((activity, index) => (
                <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ 
                        opacity: index === activeActivity ? 1 : 0, 
                        y: index === activeActivity ? -80 : 20, // Move up when active
                        scale: index === activeActivity ? 1 : 0.9,
                        zIndex: index === activeActivity ? 10 : 0
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute bg-white/80 backdrop-blur-md border border-white shadow-xl px-6 py-3 rounded-full flex items-center gap-4 min-w-[280px]"
                >
                    <div className={`p-2 rounded-full ${
                        activity.type === 'skill' ? 'bg-yellow-100 text-yellow-600' :
                        activity.type === 'attendance' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>
                        {activity.type === 'skill' && <AcademicCapIcon className="w-4 h-4" />}
                        {activity.type === 'attendance' && <BoltIcon className="w-4 h-4" />}
                        {activity.type === 'approval' && <CheckCircleIcon className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{activity.text}</span>
                </motion.div>
            ))}
        </div>
    );
};

export default LiveStats;