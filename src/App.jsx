import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import CustomCursor from './components/CustomCursor';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminSkills from './pages/admin/AdminSkills';
import AdminProjects from './pages/admin/AdminProjects';
import AdminProfile from './pages/admin/AdminProfile';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/skills" replace />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
