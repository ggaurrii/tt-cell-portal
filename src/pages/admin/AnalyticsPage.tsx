import { Card } from '@/components/ui';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { ATTENDANCE_TREND, DOMAIN_DISTRIBUTION, MONTHLY_ATTENDANCE, MOCK_STUDENTS, MOCK_PROJECTS } from '@/constants/mockData';

const COLORS = ['#1B3A2D', '#2D5A3D', '#C9A227', '#4d954d', '#7ab57a', '#A07D1A', '#E8BB3A'];

const performanceData = [
  { domain: 'AI & ML', attendance: 88, projects: 90, completion: 82 },
  { domain: 'Web Dev', attendance: 85, projects: 78, completion: 75 },
  { domain: 'Cyber Sec', attendance: 72, projects: 65, completion: 60 },
  { domain: 'Embedded', attendance: 91, projects: 85, completion: 88 },
  { domain: 'IoT', attendance: 94, projects: 92, completion: 89 },
  { domain: 'Robotics', attendance: 68, projects: 55, completion: 50 },
  { domain: 'Data Sci', attendance: 80, projects: 75, completion: 70 },
];

const radarData = performanceData.map(d => ({ subject: d.domain, A: d.attendance, B: d.projects }));

const projectProgress = MOCK_PROJECTS.map(p => ({ name: p.title.split(' ').slice(0, 3).join(' ') + '...', progress: p.progress, domain: p.domain }));

export default function AnalyticsPage() {
  const avgAttendance = Math.round(MOCK_STUDENTS.reduce((s, st) => s + st.attendancePercentage, 0) / MOCK_STUDENTS.length);
  const completedProjects = MOCK_PROJECTS.filter(p => p.status === 'completed').length;
  const completionRate = Math.round((completedProjects / MOCK_PROJECTS.length) * 100);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-military-dark">Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Comprehensive performance insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Attendance', value: `${avgAttendance}%`, sub: 'Across all students', color: 'text-military-green', bg: 'bg-military-green/8' },
          { label: 'Completion Rate', value: `${completionRate}%`, sub: 'Projects completed', color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Active Rate', value: `${Math.round(MOCK_STUDENTS.filter(s => s.status === 'active').length / MOCK_STUDENTS.length * 100)}%`, sub: 'Students currently active', color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'At Risk', value: MOCK_STUDENTS.filter(s => s.attendancePercentage < 75).length, sub: 'Students below 75%', color: 'text-red-600', bg: 'bg-red-50' },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-5 border border-surface-border`}>
            <p className="text-xs text-gray-500 font-medium">{c.label}</p>
            <p className={`text-3xl font-extrabold ${c.color} mt-1`}>{c.value}</p>
            <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Row 1 */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="font-bold text-military-dark mb-1">Attendance Trend</h3>
          <p className="text-xs text-gray-500 mb-5">Daily attendance over the week</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={ATTENDANCE_TREND}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B3A2D" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1B3A2D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="present" stroke="#1B3A2D" strokeWidth={2.5} fill="url(#g1)" name="Present" />
              <Area type="monotone" dataKey="absent" stroke="#C9A227" strokeWidth={2} fill="none" name="Absent" />
              <Area type="monotone" dataKey="late" stroke="#7ab57a" strokeWidth={2} fill="none" name="Late" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-bold text-military-dark mb-1">Domain Distribution</h3>
          <p className="text-xs text-gray-500 mb-5">Students per domain</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={DOMAIN_DISTRIBUTION} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {DOMAIN_DISTRIBUTION.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <h3 className="font-bold text-military-dark mb-1">Domain Performance Comparison</h3>
          <p className="text-xs text-gray-500 mb-5">Attendance, projects & completion by domain</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={performanceData} barSize={14} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f0" vertical={false} />
              <XAxis dataKey="domain" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 11 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="attendance" fill="#1B3A2D" name="Attendance %" radius={[3, 3, 0, 0]} />
              <Bar dataKey="projects" fill="#C9A227" name="Projects %" radius={[3, 3, 0, 0]} />
              <Bar dataKey="completion" fill="#7ab57a" name="Completion %" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-bold text-military-dark mb-1">Skill Radar</h3>
          <p className="text-xs text-gray-500 mb-4">Domain attendance vs projects</p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e8ede9" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#9ca3af' }} />
              <Radar name="Attendance" dataKey="A" stroke="#1B3A2D" fill="#1B3A2D" fillOpacity={0.2} />
              <Radar name="Projects" dataKey="B" stroke="#C9A227" fill="#C9A227" fillOpacity={0.2} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 3 */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="font-bold text-military-dark mb-1">Monthly Attendance Trend</h3>
          <p className="text-xs text-gray-500 mb-5">Average monthly attendance %</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MONTHLY_ATTENDANCE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[70, 100]} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }} formatter={v => [`${v}%`, 'Attendance']} />
              <Line type="monotone" dataKey="percentage" stroke="#1B3A2D" strokeWidth={3} dot={{ fill: '#1B3A2D', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-bold text-military-dark mb-1">Project Progress</h3>
          <p className="text-xs text-gray-500 mb-5">Current completion status per project</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={projectProgress} layout="vertical" barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 11 }} formatter={v => [`${v}%`, 'Progress']} />
              <Bar dataKey="progress" fill="#1B3A2D" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
