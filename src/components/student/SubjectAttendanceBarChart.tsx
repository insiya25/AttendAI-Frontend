// src/components/student/SubjectAttendanceBarChart.tsx
import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface SubjectStats {
    name: string;
    attendance_percentage: number;
}

interface BarChartProps {
    subjects: SubjectStats[];
}

const SubjectAttendanceBarChart = ({ subjects }: BarChartProps) => {
    // Sort subjects by attendance percentage (Highest on top)
    const sortedSubjects = [...subjects].sort((a, b) => b.attendance_percentage - a.attendance_percentage);

    return (
        <div className="w-full h-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical" // Horizontal Bars
                    data={sortedSubjects}
                    margin={{ top: 0, right: 20, left: 0, bottom: 0 }} // Left 0 because YAxis handles labels inside container usually, but we might need margin depending on label length. Recharts handles YAxis width automatically mostly.
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />

                    <XAxis 
                        type="number" 
                        domain={[0, 100]} 
                        hide // Hide X axis numbers for cleaner look
                    />

                    <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={100} // Fixed width for subject names
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }}
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6', opacity: 0.4 }} />

                    <Bar 
                        dataKey="attendance_percentage" 
                        radius={[0, 4, 4, 0]} // Rounded ends on the right
                        barSize={20}
                        animationDuration={1500}
                    >
                        {sortedSubjects.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                // Green for >= 75%, Red for < 75%
                                fill={entry.attendance_percentage >= 75 ? '#10B981' : '#EF4444'} 
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- Custom Tooltip ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        const isGood = value >= 75;
        
        return (
            <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-xl p-3">
                <p className="text-xs font-bold text-gray-500 mb-1 line-clamp-1 max-w-[150px]">{label}</p>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isGood ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <p className="text-lg font-bold text-gray-900">
                        {value}%
                    </p>
                </div>
                <p className={`text-[10px] font-bold uppercase mt-1 ${isGood ? 'text-green-600' : 'text-red-600'}`}>
                    {isGood ? 'Good Standing' : 'Low Attendance'}
                </p>
            </div>
        );
    }
    return null;
};

export default SubjectAttendanceBarChart;