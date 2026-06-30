import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/shared/AdminSidebar';
import AdminHeader from '@/components/shared/AdminHeader';
import { motion } from 'framer-motion';

const TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/students': 'Student Management',
  '/admin/projects': 'Project Management',
  '/admin/attendance': 'Attendance',
  '/admin/announcements': 'Announcements',
  '/admin/repository': 'Historical Repository',
  '/admin/reports': 'Reports',
  '/admin/analytics': 'Analytics',
  '/admin/profile': 'My Profile',
  '/admin/settings': 'Settings',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = TITLES[location.pathname] || 'Admin Portal';

  return (
    <div className="flex h-screen bg-surface-muted overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 ml-[72px] md:ml-64 transition-all duration-250">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-6 max-w-screen-2xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
