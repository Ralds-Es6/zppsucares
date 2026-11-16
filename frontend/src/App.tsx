import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import FacultyLogin from './pages/FacultyLogin';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';

import StudentDashboard from './pages/StudentDashboard';
import { Toaster } from 'sonner';

function App() {
  // We grab the secret paths from .env. If they aren't loaded, default to long random strings 
  // so they still aren't easily guessable.
  const adminPath = import.meta.env.VITE_ADMIN_SECURE_ROUTE || 'secure-admin-portal-xyz123';
  const facultyPath = import.meta.env.VITE_FACULTY_SECURE_ROUTE || 'secure-faculty-access-abc789';

  return (
    <Router>
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        expand={false}
        visibleToasts={3}
        toastOptions={{
          duration: 4500,
          className: 'rounded-2xl shadow-xl border border-gray-200/80 font-sans sm:min-w-[390px] px-4 py-3.5',
          classNames: {
            title: 'text-sm font-bold leading-snug',
            description: 'text-xs leading-relaxed opacity-90',
            actionButton: 'rounded-xl font-bold text-xs px-3 py-1.5',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Dynamic Secure Routes & Direct Access Aliases */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path={`/${adminPath}`} element={<AdminLogin />} />

        <Route path="/faculty/login" element={<FacultyLogin />} />
        <Route path="/faculty" element={<FacultyLogin />} />
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
