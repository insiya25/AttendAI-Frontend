// src/components/student/StatCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    // Optional props to make it flexible like the dashboard version
    trend?: 'Good' | 'Bad' | 'Neutral';
    color?: 'blue' | 'green' | 'red' | 'purple' | 'orange'; 
}

const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend = 'Neutral', 
    color = 'red' // Defaulting to brand color
}: StatCardProps) => {

    // Map colors to Tailwind classes
    const colorMap = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    const selectedColorClass = colorMap[color] || colorMap['red'];

    return (
        <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col justify-between relative overflow-hidden group h-full"
        >
            {/* Decorative Background Blob */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-125 transition-transform duration-500 ${selectedColorClass.split(' ')[0].replace('bg-', 'bg-')}`} />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${selectedColorClass}`}>
                    <Icon className="w-6 h-6" />
                </div>
                
                {/* Optional Trend Badge */}
                {trend !== 'Neutral' && (
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                        trend === 'Good' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {trend === 'Good' ? 'On Track' : 'Action'}
                    </span>
                )}
            </div>
            
            <div className="relative z-10">
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h4 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h4>
            </div>
        </motion.div>
    );
};

export default StatCard;