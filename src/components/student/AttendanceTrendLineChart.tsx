// src/components/student/AttendanceTrendLineChart.tsx
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface TrendData {
    date: string;
    presents: number;
}

interface LineChartProps {
    trendData: TrendData[];
}

const AttendanceTrendLineChart = ({ trendData }: LineChartProps) => {
    const data = {
        labels: trendData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'Classes Attended',
                data: trendData.map(d => d.presents),
                fill: false,
                borderColor: 'rgb(79, 70, 229)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Attendance Trend (Last 30 Days)' },
        },
    };

    return <Line options={options} data={data} />;
};

export default AttendanceTrendLineChart;