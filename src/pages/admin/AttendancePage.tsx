import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiPrinter, FiCalendar, FiCheck, FiX, FiClock, FiAlertCircle } from 'react-icons/fi';
import { Card, Badge, Button, Avatar } from '@/components/ui';
import { MOCK_STUDENTS, ATTENDANCE_TREND } from '@/constants/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

type AttStatus = 'present' | 'absent' | 'late' | 'leave';

const STATUS_CONFIG: Record<AttStatus, { label: string; color: string; icon: any; badge: any }> = {
  present: { label: 'Present', color: 'bg-green-500', icon: FiCheck, badge: 'green' as any },
  absent: { label: 'Absent', color: 'bg-red-500', icon: FiX, badge: 'red' as any },
  late: { label: 'Late', color: 'bg-yellow-500', icon: FiClock, badge: 'gold' as any },
  leave: { label: 'Leave', color: 'bg-blue-500', icon: FiAlertCircle, badge: 'blue' as any },
};

export default function AttendancePage() {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [attendance, setAttendance] = useState<Record<string, AttStatus>>(() => {
    const init: Record<string, AttStatus> = {};
    MOCK_STUDENTS.forEach(s => { init[s.id] = 'present'; });
    return init;
  });
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<'daily' | 'summary'>('daily');

  const counts = {
    present: Object.values(attendance).filter(v => v === 'present').length,
    absent: Object.values(attendance).filter(v => v === 'absent').length,
    late: Object.values(attendance).filter(v => v === 'late').length,
    leave: Object.values(attendance).filter(v => v === 'leave').length,
  };
  const pct = Math.round((counts.present / MOCK_STUDENTS.length) * 100);

  const handleSave = () => {
    setSaved(true);
    toast.success('Attendance saved successfully!');
    setTimeout(() => setSaved(false), 3000);
  };

  const markAll = (status: AttStatus) => {
    const updated: Record<string, AttStatus> = {};
    MOCK_STUDENTS.forEach(s => { updated[s.id] = status; });
    setAttendance(updated);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-military-dark">Attendance</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track and manage daily attendance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<FiDownload className="w-4 h-4" />} size="sm" onClick={() => toast.success('Exported!')}>Export</Button>
          <Button variant="outline" leftIcon={<FiPrinter className="w-4 h-4" />} size="sm" onClick={() => window.print()}>Print</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-subtle p-1 rounded-xl w-fit">
        {(['daily', 'summary'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white shadow-sm text-military-green' : 'text-gray-500 hover:text-gray-700'}`}>
            {t === 'daily' ? '📋 Daily Attendance' : '📊 Monthly Summary'}
          </button>
        ))}
      </div>

      {tab === 'daily' && (
        <>
          {/* Date + Stats */}
          <div className="grid md:grid-cols-5 gap-4">
            <Card className="md:col-span-1">
              <label className="text-xs font-semibold text-gray-500 block mb-2">Select Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20" />
              <div className="mt-3 text-center">
                <div className="text-3xl font-extrabold text-military-green">{pct}%</div>
                <div className="text-xs text-gray-500">Attendance Rate</div>
              </div>
            </Card>
            {Object.entries(counts).map(([status, count]) => {
              const cfg = STATUS_CONFIG[status as AttStatus];
              return (
                <div key={status} className="card p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 ${cfg.color} rounded-xl flex items-center justify-center`}>
                    <cfg.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-military-dark">{count}</div>
                    <div className="text-xs text-gray-500">{cfg.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Batch Actions */}
          <Card padding="sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Mark All:</span>
              {(Object.keys(STATUS_CONFIG) as AttStatus[]).map(s => (
                <button key={s} onClick={() => markAll(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${s === 'present' ? 'border-green-300 text-green-700 hover:bg-green-50' : s === 'absent' ? 'border-red-300 text-red-700 hover:bg-red-50' : s === 'late' ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-50' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}`}>
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
              <Button variant="primary" size="sm" className="ml-auto" onClick={handleSave} isLoading={false}>
                {saved ? '✓ Saved' : 'Save Attendance'}
              </Button>
            </div>
          </Card>

          {/* Attendance Table */}
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border bg-surface-subtle/50">
                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Domain</th>
                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mark</th>
                    <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Overall %</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STUDENTS.map((s, i) => {
                    const status = attendance[s.id];
                    return (
                      <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-surface-border/50 hover:bg-surface-subtle/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={s.name} size="sm" />
                            <div>
                              <p className="font-semibold text-gray-800">{s.name}</p>
                              <p className="text-xs text-gray-400">{s.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs bg-military-green/8 text-military-green px-2 py-1 rounded-lg font-semibold">{s.domain}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge color={STATUS_CONFIG[status].badge}>{STATUS_CONFIG[status].label}</Badge>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex gap-1.5">
                            {(Object.keys(STATUS_CONFIG) as AttStatus[]).map(st => (
                              <button key={st} onClick={() => setAttendance(prev => ({ ...prev, [s.id]: st }))}
                                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all border ${status === st ? `${STATUS_CONFIG[st].color} text-white border-transparent` : 'border-surface-border text-gray-400 hover:border-gray-300'}`}
                                title={STATUS_CONFIG[st].label}>
                                {st === 'present' ? 'P' : st === 'absent' ? 'A' : st === 'late' ? 'L' : 'V'}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-surface-subtle rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${s.attendancePercentage >= 75 ? 'bg-military-green' : 'bg-red-500'}`} style={{ width: `${s.attendancePercentage}%` }} />
                            </div>
                            <span className={`text-xs font-bold ${s.attendancePercentage >= 75 ? 'text-green-700' : 'text-red-600'}`}>{s.attendancePercentage}%</span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {tab === 'summary' && (
        <div className="space-y-5">
          <Card>
            <h3 className="font-bold text-military-dark mb-4">Weekly Attendance Overview</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ATTENDANCE_TREND} barSize={20} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 12 }} />
                <Bar dataKey="present" fill="#1B3A2D" name="Present" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#C9A227" name="Absent" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="#7ab57a" name="Late" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card padding="none">
            <div className="px-6 py-4 border-b border-surface-border">
              <h3 className="font-bold text-military-dark">Student Attendance Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border bg-surface-subtle/50">
                    {['Student', 'Present', 'Absent', 'Late', 'Leave', 'Overall %', 'Status'].map(h => (
                      <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STUDENTS.map(s => (
                    <tr key={s.id} className="border-b border-surface-border/50 hover:bg-surface-subtle/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Avatar name={s.name} size="sm" />
                          <span className="font-medium text-gray-800">{s.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-green-700 font-semibold">{Math.round(s.attendancePercentage * 0.8)}</td>
                      <td className="py-3 px-4 text-red-600 font-semibold">{Math.round((100 - s.attendancePercentage) * 0.6)}</td>
                      <td className="py-3 px-4 text-yellow-700 font-semibold">{Math.round(s.attendancePercentage * 0.1)}</td>
                      <td className="py-3 px-4 text-blue-700 font-semibold">{Math.round((100 - s.attendancePercentage) * 0.4)}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${s.attendancePercentage >= 75 ? 'text-green-700' : 'text-red-600'}`}>{s.attendancePercentage}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge color={s.attendancePercentage >= 75 ? 'green' : 'red'}>{s.attendancePercentage >= 75 ? 'Good' : 'At Risk'}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
