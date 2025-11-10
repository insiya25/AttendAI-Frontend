// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './router/ProtectedRoute'; // <-- Import ProtectedRoute

const TeacherDashboard = () => <h1 className="text-3xl">Teacher Dashboard</h1>;
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
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;