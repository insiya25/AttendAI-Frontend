// src/components/student/PerformanceChart.tsx
import { Line } from 'react-chartjs-2';
// Make sure all necessary ChartJS modules are registered
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PerformanceRecord { semester: number; cgpi: number; }
interface ChartProps { performanceData: PerformanceRecord[]; }

const PerformanceChart = ({ performanceData }: ChartProps) => {
    const data = {
        labels: performanceData.map(p => `Sem ${p.semester}`),
        datasets: [{
            label: 'CGPI',
            data: performanceData.map(p => p.cgpi),
            fill: true,
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: 'rgb(79, 70, 229)',
            tension: 0.1,
        }],
    };
    return <Line data={data} options={{ plugins: { title: { display: true, text: 'Semester-wise Performance' } } }} />;
};
export default PerformanceChart;