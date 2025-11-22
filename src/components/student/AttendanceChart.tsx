// src/components/student/AttendanceChart.tsx
import React from 'react';
import { 
    PieChart, 
    Pie, 
    Cell, 
    Tooltip, 
    ResponsiveContainer,
    Legend
} from 'recharts';

interface ChartProps {
    present: number;
    absent: number;
}

const AttendanceChart = ({ present, absent }: ChartProps) => {
    
    // Prepare data for Recharts
    const data = [
        { name: 'Present', value: present },
        { name: 'Absent', value: absent },
    ];

    // Modern Colors: Emerald for Present, Brand Red for Absent
    const COLORS = ['#10B981', '#EF4444']; 

    if (present === 0 && absent === 0) {
        return (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                No data available
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60} // Makes it a Donut
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none" // Removes default ugly border
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle"
                        formatter={(value, entry: any) => (
                            <span className="text-gray-600 text-xs font-bold ml-1">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- Custom Tooltip ---
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-xl p-3">
                <div className="flex items-center gap-2">
                    <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: data.payload.fill }}
                    />
                    <p className="text-sm font-bold text-gray-800">
                        {data.name}: <span className="text-gray-600">{data.value}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default AttendanceChart;