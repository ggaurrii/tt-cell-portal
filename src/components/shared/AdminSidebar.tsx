import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiUsers, FiBriefcase, FiCalendar, FiBell,
  FiArchive, FiFileText, FiBarChart2, FiUser, FiSettings,
  FiLogOut, FiChevronLeft, FiChevronRight, FiShield
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: FiGrid, path: '/admin' },
  { label: 'Students', icon: FiUsers, path: '/admin/students', badge: 3 },
  { label: 'Projects', icon: FiBriefcase, path: '/admin/projects' },
  { label: 'Attendance', icon: FiCalendar, path: '/admin/attendance' },
  { label: 'Announcements', icon: FiBell, path: '/admin/announcements', badge: 2 },
  { label: 'Repository', icon: FiArchive, path: '/admin/repository' },
  { label: 'Reports', icon: FiFileText, path: '/admin/reports' },
  { label: 'Analytics', icon: FiBarChart2, path: '/admin/analytics' },
];

const BOTTOM_ITEMS = [
  { label: 'Profile', icon: FiUser, path: '/admin/profile' },
  { label: 'Settings', icon: FiSettings, path: '/admin/settings' },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="h-screen bg-military-dark flex flex-col fixed left-0 top-0 z-30 shadow-sidebar overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center flex-shrink-0">
          <FiShield className="text-military-dark w-5 h-5" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight">TT CELL</p>
              <p className="text-white/50 text-xs">Admin Portal</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-14 w-6 h-6 bg-military-green border-2 border-military-dark rounded-full flex items-center justify-center text-white hover:bg-military-light transition-colors z-10"
      >
        {collapsed ? <FiChevronRight className="w-3 h-3" /> : <FiChevronLeft className="w-3 h-3" />}
      </button>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
        <div className="space-y-1">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${active ? 'bg-military-green text-white' : 'text-white/60 hover:bg-white/8 hover:text-white'}`}>
                  <item.icon className="w-4.5 h-4.5 flex-shrink-0 w-[18px] h-[18px]" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 whitespace-nowrap">
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!collapsed && item.badge && (
                    <span className="bg-gold text-military-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                  {collapsed && <div className="absolute left-full ml-2 px-2 py-1 bg-military-green text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">{item.label}</div>}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 space-y-1">
          {BOTTOM_ITEMS.map(item => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${active ? 'bg-military-green text-white' : 'text-white/60 hover:bg-white/8 hover:text-white'}`}>
                  <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <Avatar name={user?.name || 'Admin'} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
              <p className="text-white/50 text-xs truncate">Administrator</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={logout} title="Logout" className="text-white/50 hover:text-red-400 transition-colors">
              <FiLogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
