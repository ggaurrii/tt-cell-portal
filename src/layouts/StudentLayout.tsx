import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiCalendar, FiBriefcase, FiBell, FiUser, FiSettings, FiLogOut, FiShield, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: FiGrid, path: '/student' },
  { label: 'My Attendance', icon: FiCalendar, path: '/student/attendance' },
  { label: 'My Projects', icon: FiBriefcase, path: '/student/projects' },
  { label: 'Announcements', icon: FiBell, path: '/student/announcements' },
  { label: 'My Profile', icon: FiUser, path: '/student/profile' },
  { label: 'Settings', icon: FiSettings, path: '/student/settings' },
];

export default function StudentLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const isActive = (path: string) => path === '/student' ? location.pathname === '/student' : location.pathname.startsWith(path);

  const Sidebar = () => (
    <aside className="w-64 h-full bg-military-dark flex flex-col">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center">
          <FiShield className="text-military-dark w-5 h-5" />
        </div>
        <div>
          <p className="text-white font-bold text-sm">TT CELL</p>
          <p className="text-white/50 text-xs">Student Portal</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${active ? 'bg-military-green text-white' : 'text-white/60 hover:bg-white/8 hover:text-white'}`}>
                <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name || 'Student'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-white/50 text-xs">{(user as any)?.studentId || 'Student'}</p>
          </div>
          <button onClick={logout} className="text-white/50 hover:text-red-400 transition-colors">
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-surface-muted overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="w-64 flex-shrink-0"><Sidebar /></div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden h-14 bg-white border-b border-surface-border flex items-center justify-between px-4">
          <button onClick={() => setMobileOpen(true)}><FiMenu className="w-5 h-5 text-gray-600" /></button>
          <span className="font-bold text-military-dark text-sm">TT CELL</span>
          <Avatar name={user?.name || 'S'} size="sm" />
        </header>
        <main className="flex-1 overflow-y-auto">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="p-6 max-w-screen-xl mx-auto">
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
