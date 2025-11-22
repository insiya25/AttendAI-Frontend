// src/components/student/PerformanceChart.tsx
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

interface PerformanceRecord { semester: number; cgpi: number; }
interface ChartProps { performanceData: PerformanceRecord[]; }

const PerformanceChart = ({ performanceData }: ChartProps) => {
    // 1. Sort data to ensure the line flows correctly from Sem 1 -> Sem X
    const sortedData = [...performanceData].sort((a, b) => a.semester - b.semester);

    return (
        <div className="w-full h-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={sortedData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    {/* Gradient Definition for that "Premium" look */}
                    <defs>
                        <linearGradient id="colorCgpi" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                        </linearGradient>
                    </defs>

                    {/* Subtle Grid (Horizontal only) */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />

                    <XAxis 
                        dataKey="semester" 
                        tickFormatter={(val) => `Sem ${val}`}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        dy={10}
                    />
                    
                    <YAxis 
                        domain={[0, 10]} // CGPI is usually out of 10
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#EF4444', strokeWidth: 1, strokeDasharray: '4 4' }} />

                    <Area 
                        type="monotone" 
                        dataKey="cgpi" 
                        stroke="#DC2626" // Red-600
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorCgpi)" 
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- Custom Tooltip Component for Glassmorphism feel ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl rounded-xl p-3">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Semester {label}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    <p className="text-lg font-bold text-gray-900">
                        {Number(payload[0].value).toFixed(2)} <span className="text-xs font-normal text-gray-500">CGPI</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default PerformanceChart;