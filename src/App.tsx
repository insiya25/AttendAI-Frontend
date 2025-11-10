// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './router/ProtectedRoute';
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage'; // <-- Import the new page

// You can keep this or create a new student dashboard page later
const StudentDashboard = () => <h1 className="text-3xl">Student Dashboard</h1>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          {/* Replace the placeholder with the actual component */}
          <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} /> 
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;