// src/pages/teacher/ViewStudentDashboardPage.tsx
import { useParams, Link } from 'react-router-dom';
import StudentDashboardPage from '../student/StudentDashboardPage'; // Import the refactored dashboard

const ViewStudentDashboardPage = () => {
    const { rollNumber } = useParams<{ rollNumber: string }>();

    return (
        <div>
            <div className="bg-indigo-600 p-3 text-white flex justify-between items-center">
                <p>You are viewing a student's dashboard.</p>
                <Link to="/teacher/students" className="text-sm font-medium underline hover:text-indigo-200">
                    &larr; Back to Student List
                </Link>
            </div>
            {/* Pass the rollNumber from the URL as a prop */}
            <StudentDashboardPage studentRollNumber={rollNumber} />
        </div>
    );
};

export default ViewStudentDashboardPage;