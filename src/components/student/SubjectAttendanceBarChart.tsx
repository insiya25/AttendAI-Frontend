// src/components/student/SubjectAttendanceBarChart.tsx
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SubjectStats {
    name: string;
    attendance_percentage: number;
}

interface BarChartProps {
    subjects: SubjectStats[];
}

const SubjectAttendanceBarChart = ({ subjects }: BarChartProps) => {
    // Sort subjects by attendance percentage to find top/bottom
    const sortedSubjects = [...subjects].sort((a, b) => b.attendance_percentage - a.attendance_percentage);
    
    const data = {
        labels: sortedSubjects.map(s => s.name),
        datasets: [
            {
                label: 'Attendance %',
                data: sortedSubjects.map(s => s.attendance_percentage),
                backgroundColor: sortedSubjects.map(s => s.attendance_percentage >= 75 ? 'rgba(79, 70, 229, 0.8)' : 'rgba(239, 68, 68, 0.8)'),
                borderColor: sortedSubjects.map(s => s.attendance_percentage >= 75 ? 'rgba(79, 70, 229, 1)' : 'rgba(239, 68, 68, 1)'),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const, // Makes the bar chart horizontal
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Subject Attendance Comparison (%)' },
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
            },
        },
    };

    return <Bar options={options} data={data} />;
};

export default SubjectAttendanceBarChart;