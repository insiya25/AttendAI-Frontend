import React from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  ChartBarIcon, 
  AcademicCapIcon, 
  CheckBadgeIcon,
  UserGroupIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const FeaturesBento = () => {
  return (
    <section className="py-24 px-6 bg-gray-50 relative overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-red-600 font-bold tracking-wide uppercase text-sm mb-3">
                Powerful Features
            </h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Everything you need to <br className="hidden md:block" /> manage your campus.
            </h3>
        </motion.div>
      </div>

      {/* The Bento Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* Feature 1: AI OCR (Large, spans 2 cols) */}
        <BentoItem 
            className="md:col-span-2 min-h-[300px]"
            title="AI-Powered Attendance OCR"
            description="Snap a photo of the physical sheet. Our AI detects handwriting, verifies signatures, and updates the database instantly."
            delay={0.1}
        >
            {/* Animation: The Scanning Laser */}
            <div className="absolute right-0 bottom-0 w-full md:w-1/2 h-full bg-gradient-to-t from-gray-100 to-transparent p-6 flex items-center justify-center overflow-hidden">
                <div className="relative w-48 h-64 bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex flex-col gap-3">
                    {/* Fake Text Lines */}
                    <div className="w-full h-2 bg-gray-100 rounded"></div>
                    <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
                    <div className="w-full h-2 bg-gray-100 rounded"></div>
                    <div className="flex gap-2 mt-4">
                        <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                        <div className="flex-1 h-2 bg-gray-100 rounded mt-3"></div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                        <div className="flex-1 h-2 bg-gray-100 rounded mt-3"></div>
                    </div>

                    {/* The Laser Scanner */}
                    <motion.div 
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                        className="absolute left-0 w-full h-[2px] bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] z-10"
                    />
                    <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded">
                        DETECTING...
                    </div>
                </div>
            </div>
        </BentoItem>

        {/* Feature 2: Real-time Analytics (Tall, spans 1 col, 2 rows) */}
        <BentoItem 
            className="md:row-span-2 bg-gray-900 text-white min-h-[400px]"
            title="Real-time Analytics"
            description="Beautiful charts track attendance trends, CGPI performance, and semester grades in real-time."
            delay={0.2}
            dark
        >
            {/* Animation: Growing Bars */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 px-6 flex items-end justify-between gap-2 pb-6">
                {[40, 70, 50, 90, 60, 80].map((height, i) => (
                    <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: 0.2 + (i * 0.1), type: "spring" }}
                        className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                    />
                ))}
            </div>
        </BentoItem>

        {/* Feature 3: Skill Verification (Square) */}
        <BentoItem 
            title="AI Skill Verification"
            description="Earn golden badges. Our AI interviews students to verify listed skills."
            delay={0.3}
        >
            <div className="absolute top-4 right-4">
                <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center border border-yellow-100 text-yellow-600"
                >
                    <CheckBadgeIcon className="w-6 h-6" />
                </motion.div>
            </div>
        </BentoItem>

        {/* Feature 4: Smart Leave Apps (Square) */}
        <BentoItem 
            title="AI Leave Requests"
            description="Draft professional leave applications instantly. Teachers approve with one click."
            delay={0.4}
        >
             <div className="absolute top-4 right-4 bg-blue-50 p-2 rounded-lg">
                <PaperAirplaneIcon className="w-6 h-6 text-blue-500 -rotate-45" />
             </div>
        </BentoItem>

         {/* Feature 5: Classroom Management (Wide, spans 2 cols) */}
         <BentoItem 
            className="md:col-span-2"
            title="Total Classroom Control"
            description="Manage students, view detailed profiles, and track subject-wise performance from a single dashboard."
            delay={0.5}
        >
             <div className="absolute right-6 top-1/2 -translate-y-1/2 flex -space-x-4">
                {[1,2,3,4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-sm">
                        <UserGroupIcon className="w-6 h-6 text-gray-400" />
                    </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white bg-red-50 flex items-center justify-center text-red-600 font-bold text-xs shadow-sm">
                    +40
                </div>
             </div>
        </BentoItem>

      </div>
    </section>
  );
};

// --- Helper Component for Bento Items ---
interface BentoProps {
    children?: React.ReactNode;
    className?: string;
    title: string;
    description: string;
    delay: number;
    dark?: boolean;
}

const BentoItem = ({ children, className = "", title, description, delay, dark = false }: BentoProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay }}
            className={`
                relative group overflow-hidden rounded-3xl p-8
                ${dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 border border-gray-100 shadow-sm'}
                hover:shadow-xl transition-all duration-500 hover:-translate-y-1
                ${className}
            `}
        >
            <div className="relative z-10 flex flex-col h-full">
                <h4 className={`text-xl font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h4>
                <p className={`text-sm leading-relaxed max-w-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {description}
                </p>
            </div>
            
            {/* Background Hover Gradient Effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                ${dark ? 'bg-gradient-to-br from-gray-800 to-transparent' : 'bg-gradient-to-br from-red-50/50 to-transparent'}
            `} />

            {/* Slot for the specific animation/graphic */}
            {children}
        </motion.div>
    );
};

export default FeaturesBento;