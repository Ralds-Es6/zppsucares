import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import FacultyLogin from './pages/FacultyLogin';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';

import StudentDashboard from './pages/StudentDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // We grab the secret paths from .env. If they aren't loaded, default to long random strings 
  // so they still aren't easily guessable.
  const adminPath = import.meta.env.VITE_ADMIN_SECURE_ROUTE || 'secure-admin-portal-xyz123';
  const facultyPath = import.meta.env.VITE_FACULTY_SECURE_ROUTE || 'secure-faculty-access-abc789';

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Dynamic Secure Routes */}
        <Route path={`/${adminPath}`} element={<AdminLogin />} />
        <Route path={`/${facultyPath}`} element={<FacultyLogin />} />

        {/* Protected Dashboard Routes (Will add auth guards later) */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  )
}

export default App;
