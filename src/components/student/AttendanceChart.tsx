// src/components/student/AttendanceChart.tsx
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartProps {
    present: number;
    absent: number;
}

const AttendanceChart = ({ present, absent }: ChartProps) => {
    const data = {
        labels: ['Present', 'Absent'],
        datasets: [
            {
                data: [present, absent],
                backgroundColor: ['#4ade80', '#f87171'], // green-400, red-400
                borderColor: ['#ffffff', '#ffffff'],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Attendance Ratio',
            },
        },
    };

    return <Doughnut data={data} options={options} />;
};

export default AttendanceChart;