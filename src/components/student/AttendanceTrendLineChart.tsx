// src/components/student/AttendanceTrendLineChart.tsx
import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface TrendData {
    date: string;
    presents: number;
}

interface LineChartProps {
    trendData: TrendData[];
}

const AttendanceTrendLineChart = ({ trendData }: LineChartProps) => {
    // Format date for the X-axis (e.g., "Nov 12")
    const formattedData = trendData.map(item => ({
        ...item,
        displayDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));

    return (
        <div className="w-full h-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={formattedData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    {/* Red Gradient Definition */}
                    <defs>
                        <linearGradient id="colorPresents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />

                    <XAxis 
                        dataKey="displayDate" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        minTickGap={30} // Prevents label overlap
                        dy={10}
                    />
                    
                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        allowDecimals={false} // Attendance count is always integer
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#EF4444', strokeWidth: 1, strokeDasharray: '4 4' }} />

                    <Area 
                        type="monotone" 
                        dataKey="presents" 
                        stroke="#DC2626" // Red-600
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorPresents)" 
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- Custom Tooltip ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl rounded-xl p-3">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    <p className="text-lg font-bold text-gray-900">
                        {payload[0].value} <span className="text-xs font-normal text-gray-500">Classes</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default AttendanceTrendLineChart;