import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCalendar, FiBriefcase, FiCheckCircle, FiBell, FiArrowRight } from 'react-icons/fi';
import { Card, Badge, ProgressBar } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { MOCK_PROJECTS, MOCK_ANNOUNCEMENTS } from '@/constants/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MONTHLY_ATTENDANCE } from '@/constants/mockData';

const STUDENT_ATTENDANCE_MONTHLY = MONTHLY_ATTENDANCE.map(m => ({ ...m, mine: m.percentage - Math.floor(Math.random() * 10) }));

export default function StudentDashboard() {
  const { user } = useAuth();
  const myProjects = MOCK_PROJECTS.filter(p => p.assignedTo.includes('1'));
  const announcements = MOCK_ANNOUNCEMENTS.filter(a => !a.isDraft).slice(0, 3);

  const myAttendance = 92;
  const assignedProjects = myProjects.length;
  const completedProjects = myProjects.filter(p => p.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-military-dark rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1581092787765-e3feb951d987?w=800&auto=format")', backgroundSize: 'cover' }} />
        <div className="relative z-10">
          <p className="text-gold text-xs font-bold tracking-widest uppercase mb-2">Welcome Back</p>
          <h1 className="text-2xl font-extrabold text-white mb-1">{user?.name}</h1>
          <p className="text-white/60 text-sm">{(user as any)?.studentId} · {user?.department}</p>
          <div className="flex gap-3 mt-4">
            <Link to="/student/attendance"><button className="btn-gold text-sm py-2 px-4 flex items-center gap-1.5"><FiCalendar className="w-4 h-4" /> My Attendance</button></Link>
            <Link to="/student/projects"><button className="flex items-center gap-1.5 border border-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"><FiBriefcase className="w-4 h-4" /> My Projects</button></Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'My Attendance', value: `${myAttendance}%`, icon: <FiCalendar />, color: myAttendance >= 75 ? 'text-green-700' : 'text-red-600', bg: myAttendance >= 75 ? 'bg-green-50' : 'bg-red-50' },
          { label: 'Assigned Projects', value: assignedProjects, icon: <FiBriefcase />, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Completed', value: completedProjects, icon: <FiCheckCircle />, color: 'text-military-green', bg: 'bg-military-green/8' },
          { label: 'Announcements', value: announcements.length, icon: <FiBell />, color: 'text-gold-dark', bg: 'bg-gold/8' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className={`${s.bg} rounded-2xl p-5 border border-surface-border`}>
            <div className={`${s.color} mb-2`}>{s.icon}</div>
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Attendance Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-military-dark">My Attendance</h3>
              <p className="text-xs text-gray-500">Monthly attendance percentage</p>
            </div>
            <span className={`text-2xl font-extrabold ${myAttendance >= 75 ? 'text-green-600' : 'text-red-600'}`}>{myAttendance}%</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={STUDENT_ATTENDANCE_MONTHLY}>
              <defs>
                <linearGradient id="myAtt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B3A2D" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1B3A2D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[60, 100]} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }} formatter={v => [`${v}%`, 'Attendance']} />
              <Area type="monotone" dataKey="percentage" stroke="#1B3A2D" strokeWidth={2.5} fill="url(#myAtt)" name="Class Avg" />
              <Area type="monotone" dataKey="mine" stroke="#C9A227" strokeWidth={2} fill="none" name="My Attendance" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Announcements */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-military-dark text-sm">Latest Announcements</h3>
            <Link to="/student/announcements"><button className="text-xs text-military-green font-semibold hover:underline flex items-center gap-1">View All <FiArrowRight className="w-3 h-3" /></button></Link>
          </div>
          <div className="space-y-3">
            {announcements.map(a => (
              <div key={a.id} className="flex gap-3 pb-3 border-b border-surface-border/50 last:border-0">
                <div className="w-8 h-8 bg-military-green/10 rounded-lg flex items-center justify-center flex-shrink-0 text-sm">📢</div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.publishedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* My Projects */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-military-dark">My Projects</h3>
          <Link to="/student/projects"><button className="text-xs text-military-green font-semibold hover:underline flex items-center gap-1">View All <FiArrowRight className="w-3 h-3" /></button></Link>
        </div>
        <div className="space-y-4">
          {myProjects.map(p => {
            const daysLeft = Math.ceil((new Date(p.deadline).getTime() - Date.now()) / 86400000);
            return (
              <div key={p.id} className="flex items-center gap-4 py-3 border-b border-surface-border/50 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-800 text-sm truncate">{p.title}</p>
                    <Badge color={p.status === 'completed' ? 'green' : p.status === 'active' ? 'blue' : 'gold'}>{p.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{p.domain}</p>
                  <ProgressBar value={p.progress} color={p.progress === 100 ? 'green' : 'green'} />
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xs font-semibold ${daysLeft < 0 ? 'text-red-600' : daysLeft < 7 ? 'text-yellow-600' : 'text-gray-500'}`}>
                    {p.status === 'completed' ? '✓ Done' : daysLeft > 0 ? `${daysLeft}d left` : 'Overdue'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.deadline}</p>
                </div>
              </div>
            );
          })}
          {myProjects.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <FiBriefcase className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No projects assigned yet</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
