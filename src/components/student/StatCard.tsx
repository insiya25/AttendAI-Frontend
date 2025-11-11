// src/components/student/StatCard.tsx
import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
}

const StatCard = ({ title, value, icon: Icon }: StatCardProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-indigo-500 p-3 rounded-full text-white">
                <Icon className="h-6 w-6" />
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;