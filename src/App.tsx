// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './router/ProtectedRoute';
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage'; 
import StudentDashboardPage from './pages/student/StudentDashboardPage';

import TeacherLayout from './layouts/TeacherLayout'; // Import layout
import TeacherStudentsPage from './pages/teacher/TeacherStudentsPage';
import ViewStudentDashboardPage from './pages/teacher/ViewStudentDashboardPage';

import StudentLayout from './layouts/StudentLayout';
import SkillAssessmentPage from './pages/student/SkillAssessmentPage';

import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LandingPage />} />

        {/* Protected Routes */}

          <Route element={<ProtectedRoute />}>
            <Route element={<StudentLayout />}>
                <Route path="/student/dashboard" element={<StudentDashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/assessment/:skillName/:skillId" element={<SkillAssessmentPage />} />
            </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
            <Route element={<TeacherLayout />}>
                <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
                <Route path="/teacher/students" element={<TeacherStudentsPage />} />
                <Route path="/teacher/view-student/:rollNumber" element={<ViewStudentDashboardPage />} />
            </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;