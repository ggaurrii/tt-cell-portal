import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, Badge, ProgressBar, Button, Avatar } from '@/components/ui';
import { MOCK_PROJECTS, MOCK_ANNOUNCEMENTS } from '@/constants/mockData';
import { FiCalendar, FiDownload, FiSave } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MONTHLY_ATTENDANCE } from '@/constants/mockData';
import toast from 'react-hot-toast';

export function StudentAttendancePage() {
  const months = MONTHLY_ATTENDANCE.map(m => ({ ...m, myAtt: m.percentage - Math.floor(Math.random() * 8) }));
  const overallAtt = 92;

  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const statuses = ['present', 'present', 'present', 'absent', 'late', 'present', 'present', 'leave'];
    return { day: i + 1, status: statuses[Math.floor(Math.random() * statuses.length)] };
  });

  const statusColor: Record<string, string> = {
    present: 'bg-military-green text-white',
    absent: 'bg-red-500 text-white',
    late: 'bg-yellow-400 text-white',
    leave: 'bg-blue-400 text-white',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-military-dark">My Attendance</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your attendance records and history</p>
        </div>
        <Button variant="outline" leftIcon={<FiDownload className="w-4 h-4" />} size="sm" onClick={() => toast.success('Exported!')}>Export</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall', value: `${overallAtt}%`, color: 'text-military-green', bg: 'bg-military-green/8' },
          { label: 'Present', value: '22', color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Absent', value: '2', color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Late', value: '2', color: 'text-yellow-700', bg: 'bg-yellow-50' },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-5 border border-surface-border text-center`}>
            <p className={`text-3xl font-extrabold ${c.color}`}>{c.value}</p>
            <p className="text-xs text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="font-bold text-military-dark mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={months} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[60, 100]} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }} formatter={v => [`${v}%`]} />
              <Bar dataKey="myAtt" fill="#1B3A2D" radius={[4, 4, 0, 0]} name="My Attendance" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-bold text-military-dark mb-4">June 2025 Calendar</h3>
          <div className="grid grid-cols-7 gap-1.5">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>
            ))}
            {calendarDays.map(d => (
              <div key={d.day} className={`text-center text-xs py-1.5 rounded-lg font-semibold ${statusColor[d.status]}`}>{d.day}</div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {[{ s: 'present', l: 'Present', c: 'bg-military-green' }, { s: 'absent', l: 'Absent', c: 'bg-red-500' }, { s: 'late', l: 'Late', c: 'bg-yellow-400' }, { s: 'leave', l: 'Leave', c: 'bg-blue-400' }].map(s => (
              <div key={s.s} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${s.c}`} />
                <span className="text-xs text-gray-500">{s.l}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function StudentProjectsPage() {
  const myProjects = MOCK_PROJECTS.filter(p => p.assignedTo.includes('1'));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-military-dark">My Projects</h1>
        <p className="text-gray-500 text-sm mt-0.5">{myProjects.length} projects assigned to you</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {myProjects.map(p => {
          const daysLeft = Math.ceil((new Date(p.deadline).getTime() - Date.now()) / 86400000);
          return (
            <Card key={p.id} hover>
              <div className="flex items-start justify-between mb-3">
                <Badge color={p.status === 'completed' ? 'green' : p.status === 'active' ? 'blue' : 'gold'}>{p.status}</Badge>
                <span className={`text-xs font-semibold ${daysLeft < 0 ? 'text-red-600' : daysLeft < 7 ? 'text-yellow-600' : 'text-gray-500'}`}>
                  {p.status === 'completed' ? '✓ Completed' : daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                </span>
              </div>
              <h3 className="font-bold text-military-dark mb-1">{p.title}</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">{p.description}</p>
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-bold text-military-green">{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-surface-subtle rounded-lg p-2.5">
                  <p className="text-gray-500">Domain</p>
                  <p className="font-semibold text-gray-800 mt-0.5">{p.domain}</p>
                </div>
                <div className="bg-surface-subtle rounded-lg p-2.5">
                  <p className="text-gray-500">Supervisor</p>
                  <p className="font-semibold text-gray-800 mt-0.5">{p.supervisor || 'N/A'}</p>
                </div>
                <div className="bg-surface-subtle rounded-lg p-2.5">
                  <p className="text-gray-500">Start</p>
                  <p className="font-semibold text-gray-800 mt-0.5">{p.startDate}</p>
                </div>
                <div className="bg-surface-subtle rounded-lg p-2.5">
                  <p className="text-gray-500">Deadline</p>
                  <p className="font-semibold text-gray-800 mt-0.5">{p.deadline}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function StudentAnnouncementsPage() {
  const announcements = MOCK_ANNOUNCEMENTS.filter(a => !a.isDraft);
  const priorityColor: Record<string, any> = { low: 'gray', medium: 'blue', high: 'gold', urgent: 'red' };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-military-dark">Announcements</h1>
        <p className="text-gray-500 text-sm mt-0.5">{announcements.length} active announcements</p>
      </div>

      <div className="space-y-4">
        {announcements.map(a => (
          <Card key={a.id} hover>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-military-green/8 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                {a.category === 'event' ? '🎯' : a.category === 'deadline' ? '⏰' : a.category === 'urgent' ? '🚨' : '📋'}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex gap-2 flex-wrap">
                    {a.isPinned && <span className="text-xs font-bold text-gold">📌 Pinned</span>}
                    <Badge color={priorityColor[a.priority]}>{a.priority}</Badge>
                  </div>
                  <span className="text-xs text-gray-400">{a.publishedAt}</span>
                </div>
                <h3 className="font-bold text-military-dark text-sm mb-1">{a.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{a.content}</p>
                <p className="text-xs text-gray-400 mt-2">Posted by {a.author}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function StudentProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState('+91 98765 43210');

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-military-dark">My Profile</h1>
        <p className="text-gray-500 text-sm mt-0.5">Your personal information</p>
      </div>
      <Card>
        <div className="flex items-center gap-5 mb-6">
          <Avatar name={user?.name || 'Student'} size="xl" />
          <div>
            <h2 className="text-xl font-extrabold text-military-dark">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <div className="flex gap-2 mt-2">
              <Badge color="green">Active</Badge>
              <Badge color="blue">{user?.department}</Badge>
            </div>
          </div>
          <Button variant={editing ? 'primary' : 'outline'} size="sm" className="ml-auto"
            onClick={() => { if (editing) toast.success('Profile saved!'); setEditing(!editing); }}>
            {editing ? <><FiSave className="w-4 h-4 mr-1" /> Save</> : 'Edit'}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { l: 'Student ID', v: (user as any)?.studentId || 'TTC2025001', editable: false },
            { l: 'Phone', v: phone, editable: true },
            { l: 'Department', v: user?.department || 'AI & ML', editable: false },
            { l: 'Join Date', v: '2025-01-15', editable: false },
          ].map(f => (
            <div key={f.l}>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.l}</label>
              {editing && f.editable ? (
                <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2.5 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20" />
              ) : (
                <div className="px-3 py-2.5 bg-surface-subtle rounded-xl text-sm font-medium text-gray-800">{f.v}</div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function StudentSettingsPage() {
  const [notifs, setNotifs] = useState({ announcements: true, attendance: true, projects: false });
  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-military-dark">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your preferences</p>
      </div>
      <Card>
        <h3 className="font-bold text-military-dark mb-4">Notifications</h3>
        <div className="space-y-3">
          {[{ k: 'announcements' as const, l: 'New Announcements' }, { k: 'attendance' as const, l: 'Attendance Alerts' }, { k: 'projects' as const, l: 'Project Updates' }].map(n => (
            <div key={n.k} className="flex items-center justify-between py-2 border-b border-surface-border/50 last:border-0">
              <span className="text-sm font-medium text-gray-700">{n.l}</span>
              <button onClick={() => setNotifs(prev => ({ ...prev, [n.k]: !prev[n.k] }))}
                className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${notifs[n.k] ? 'bg-military-green' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${notifs[n.k] ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
        <Button variant="primary" className="mt-4" size="sm" onClick={() => toast.success('Saved!')}>Save Preferences</Button>
      </Card>
    </div>
  );
}
