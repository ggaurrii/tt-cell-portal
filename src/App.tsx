import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from '@/routes/ProtectedRoute';

import AdminLayout from '@/layouts/AdminLayout';
import StudentLayout from '@/layouts/StudentLayout';

import LandingPage from '@/pages/public/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import { NotFoundPage, UnauthorizedPage } from '@/pages/ErrorPages';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import StudentsPage from '@/pages/admin/StudentsPage';
import ProjectsPage from '@/pages/admin/ProjectsPage';
import AttendancePage from '@/pages/admin/AttendancePage';
import AnnouncementsPage from '@/pages/admin/AnnouncementsPage';
import AnalyticsPage from '@/pages/admin/AnalyticsPage';
import { ReportsPage, RepositoryPage } from '@/pages/admin/ReportsRepository';
import { AdminProfilePage, AdminSettingsPage } from '@/pages/admin/ProfileSettings';

import StudentDashboard from '@/pages/student/StudentDashboard';
import {
  StudentAttendancePage,
  StudentProjectsPage,
  StudentAnnouncementsPage,
  StudentProfilePage,
  StudentSettingsPage,
} from '@/pages/student/StudentSubPages';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="repository" element={<RepositoryPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          <Route path="/student" element={<ProtectedRoute requiredRole="student"><StudentLayout /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route path="attendance" element={<StudentAttendancePage />} />
            <Route path="projects" element={<StudentProjectsPage />} />
            <Route path="announcements" element={<StudentAnnouncementsPage />} />
            <Route path="profile" element={<StudentProfilePage />} />
            <Route path="settings" element={<StudentSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1a1a1a',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            fontSize: '13px',
            fontWeight: '500',
            border: '1px solid #E2E8E4',
          },
          success: { iconTheme: { primary: '#1B3A2D', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  );
}
