import { useState } from 'react';
import { FiBell, FiSearch, FiMenu } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { Avatar, Badge } from '@/components/ui';
import { MOCK_ANNOUNCEMENTS } from '@/constants/mockData';

interface AdminHeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

export default function AdminHeader({ onMenuClick, title }: AdminHeaderProps) {
  const { user } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const unread = MOCK_ANNOUNCEMENTS.filter(a => !a.isDraft).slice(0, 3);

  return (
    <header className="h-16 bg-white border-b border-surface-border flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden p-2 rounded-lg hover:bg-surface-subtle transition-colors">
          <FiMenu className="w-5 h-5 text-gray-600" />
        </button>
        {title && <h1 className="text-lg font-bold text-military-dark hidden sm:block">{title}</h1>}
        <div className="relative hidden md:flex items-center">
          <FiSearch className="absolute left-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students, projects..."
            className="pl-9 pr-4 py-2 bg-surface-subtle border border-surface-border rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-military-green/20 focus:border-military-green w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-xl hover:bg-surface-subtle transition-colors"
          >
            <FiBell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full border border-white" />
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-card-hover border border-surface-border z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
                <span className="font-semibold text-sm text-military-dark">Notifications</span>
                <Badge color="gold">{unread.length} new</Badge>
              </div>
              <div className="py-2 max-h-72 overflow-y-auto">
                {unread.map(n => (
                  <div key={n.id} className="px-4 py-3 hover:bg-surface-subtle cursor-pointer transition-colors">
                    <p className="text-sm font-medium text-gray-800 leading-snug">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.publishedAt}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-surface-border">
                <button className="text-xs font-semibold text-military-green hover:underline">View all announcements</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-surface-border">
          <Avatar name={user?.name || 'Admin'} size="sm" />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name?.split(' ').slice(-1)[0]}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
