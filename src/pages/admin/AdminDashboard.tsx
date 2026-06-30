
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  FiUsers, FiBriefcase, FiCalendar, FiCheckCircle,
  FiAlertTriangle, FiFileText, FiArrowRight, 
  FiClock, FiSettings, FiInfo, FiUploadCloud, FiFolderPlus, FiUserPlus, FiPenTool
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { StatCard, Card, Avatar } from '@/components/ui';
import {
  MOCK_STUDENTS, MOCK_PROJECTS,
  DOMAIN_DISTRIBUTION, MOCK_OPERATIONAL_LOGS, MOCK_ALERTS_NOTICES
} from '@/constants/mockData';

const COLORS = ['#1B3A2D', '#2D5A3D', '#C9A227', '#4d954d', '#7ab57a', '#A07D1A', '#E8BB3A'];

export default function AdminDashboard() {
  const activeStudents = MOCK_STUDENTS.filter(s => s.status === 'active').length;
  const activeProjects = MOCK_PROJECTS.filter(p => p.status === 'active').length;
  const lowAttendance = MOCK_STUDENTS.filter(s => s.attendancePercentage < 75);

  const STATS = [
    { title: 'Total Students', value: MOCK_STUDENTS.length, subtitle: 'All enrolled students', icon: <FiUsers className="w-6 h-6" />, trend: { value: 12, positive: true }, iconBg: 'bg-military-green/10' },
    { title: 'Active Students', value: activeStudents, subtitle: 'Currently training', icon: <FiCheckCircle className="w-6 h-6" />, trend: { value: 5, positive: true }, iconBg: 'bg-green-50' },
    { title: 'Active Projects', value: activeProjects, subtitle: 'In progress', icon: <FiBriefcase className="w-6 h-6" />, trend: { value: 3, positive: true }, iconBg: 'bg-gold/10' },
    { title: 'Attendance Today', value: '87%', subtitle: '42 / 48 present', icon: <FiCalendar className="w-6 h-6" />, trend: { value: 2, positive: true }, iconBg: 'bg-blue-50' },
  ];

  const getLogIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserPlus': return <FiUserPlus />;
      case 'CheckCircle': return <FiCheckCircle />;
      case 'FileText': return <FiFileText />;
      case 'Calendar': return <FiCalendar />;
      case 'AlertTriangle': return <FiAlertTriangle />;
      case 'UploadCloud': return <FiUploadCloud />;
      case 'Users': return <FiUsers />;
      case 'FolderPlus': return <FiFolderPlus />;
      default: return <FiFileText />;
    }
  };

  const getAlertIcon = (iconName: string) => {
    switch (iconName) {
      case 'PenTool': return <FiPenTool />;
      case 'Clock': return <FiClock />;
      case 'Settings': return <FiSettings />;
      case 'Info': return <FiInfo />;
      case 'Users': return <FiUsers />;
      default: return <FiInfo />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-military-dark">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/reports">
            <button className="btn-primary flex items-center gap-2 text-sm py-2 px-4 rounded-xl shadow-sm hover:shadow transition-all">
              <FiFileText className="w-4 h-4" /> View Reports
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Row 2: Operational Log and Alerts & Notices */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Operational Log */}
        <Card className="lg:col-span-2 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-military-dark text-base">Operational Log</h3>
            <span className="text-xs text-gray-400">Real-time</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {MOCK_OPERATIONAL_LOGS.map((log) => (
              <div key={log.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm ${log.status === 'success' ? 'bg-green-600' : log.status === 'warning' ? 'bg-amber-500' : 'bg-blue-600'}`}>
                  {getLogIcon(log.icon)}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{log.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{log.user} • {log.module}</p>
                </div>
                <span className="text-xs font-medium text-gray-400 whitespace-nowrap pt-1">{log.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Alerts & Notices */}
        <Card className="flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-military-dark text-base">Alerts & Notices</h3>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {MOCK_ALERTS_NOTICES.map((alert) => (
              <div key={alert.id} className="p-3.5 border border-surface-border rounded-xl hover:border-military-green/30 transition-colors bg-white shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-4 h-4 flex-shrink-0">{getAlertIcon(alert.icon)}</span>
                    <h4 className="font-bold text-sm text-gray-800 leading-none">{alert.title}</h4>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex-shrink-0 ${alert.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : alert.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                    {alert.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-500 pl-6 leading-relaxed">{alert.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: Domain Distribution, Quick Actions, Low Attendance */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Domain Distribution */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-military-dark text-base">Domain Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={DOMAIN_DISTRIBUTION} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {DOMAIN_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-4">
            {DOMAIN_DISTRIBUTION.slice(0, 4).map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: COLORS[i] }} />
                  <span className="text-gray-600 font-medium">{d.name}</span>
                </div>
                <span className="font-bold text-gray-800">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="font-bold text-military-dark text-base mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 h-[240px]">
            {[
              { label: 'Mark Attendance', icon: '📋', path: '/admin/attendance', color: 'bg-military-green/5 hover:bg-military-green/10 text-military-dark' },
              { label: 'Manage Students', icon: '👥', path: '/admin/students', color: 'bg-gold/10 hover:bg-gold/20 text-yellow-900' },
              { label: 'New Project', icon: '📁', path: '/admin/projects', color: 'bg-blue-50 hover:bg-blue-100 text-blue-900' },
              { label: 'Announcements', icon: '📢', path: '/admin/announcements', color: 'bg-purple-50 hover:bg-purple-100 text-purple-900' },
              { label: 'View Reports', icon: '📊', path: '/admin/reports', color: 'bg-green-50 hover:bg-green-100 text-green-900' },
              { label: 'Analytics', icon: '📈', path: '/admin/analytics', color: 'bg-orange-50 hover:bg-orange-100 text-orange-900' },
            ].map(a => (
              <Link key={a.label} to={a.path} className="block h-full">
                <div className={`rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer border border-transparent hover:border-gray-200 h-full ${a.color}`}>
                  <span className="text-2xl mb-1">{a.icon}</span>
                  <span className="text-[11px] font-bold text-center leading-tight">{a.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Low Attendance Alerts */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <FiAlertTriangle className="text-red-600 w-3 h-3" />
              </div>
              <h3 className="font-bold text-military-dark text-base">Low Attendance</h3>
            </div>
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{lowAttendance.length} Alerts</span>
          </div>
          {lowAttendance.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-8">No alerts today 🎉</p>
          ) : (
            <div className="space-y-4 mt-2">
              {lowAttendance.map(s => (
                <div key={s.id} className="flex items-center gap-3 pb-3 border-b border-surface-border/50 last:border-0 last:pb-0 group">
                  <Avatar name={s.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-military-green transition-colors">{s.name}</p>
                    <p className="text-xs text-red-500 font-bold mt-0.5">{s.attendancePercentage}% attendance</p>
                  </div>
                  <Link to={`/admin/students`}>
                    <button className="text-[10px] font-bold text-military-dark bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors uppercase tracking-wide">View</button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
