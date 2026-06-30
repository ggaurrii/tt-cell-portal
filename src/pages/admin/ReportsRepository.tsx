import { useState } from 'react';
import { FiDownload, FiFileText, FiCalendar, FiFilter } from 'react-icons/fi';
import { Card, Button, Badge } from '@/components/ui';
import { MOCK_STUDENTS, MOCK_PROJECTS } from '@/constants/mockData';
import toast from 'react-hot-toast';

export function ReportsPage() {
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState('2025-06-30');

  const reportTypes = [
    { id: 'attendance', label: 'Attendance Report', icon: '📋', desc: 'Daily/Monthly attendance records for all students' },
    { id: 'project', label: 'Project Report', icon: '📁', desc: 'Project status, progress and completion summary' },
    { id: 'performance', label: 'Student Performance', icon: '📊', desc: 'Individual student performance analysis' },
    { id: 'analytics', label: 'Analytics Report', icon: '📈', desc: 'Comprehensive analytics with charts and insights' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-military-dark">Reports</h1>
        <p className="text-gray-500 text-sm mt-0.5">Generate and export comprehensive reports</p>
      </div>

      <Card>
        <h3 className="font-bold text-military-dark mb-4">Date Range Filter</h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">From Date</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-2 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">To Date</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-3 py-2 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20" />
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {reportTypes.map(r => (
          <Card key={r.id} hover className="flex items-center gap-4">
            <div className="w-14 h-14 bg-military-green/8 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">{r.icon}</div>
            <div className="flex-1">
              <h3 className="font-bold text-military-dark text-sm">{r.label}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
              <div className="flex gap-2 mt-3">
                <Button variant="primary" size="sm" leftIcon={<FiDownload className="w-3.5 h-3.5" />} onClick={() => toast.success(`${r.label} PDF downloaded!`)}>PDF</Button>
                <Button variant="outline" size="sm" leftIcon={<FiDownload className="w-3.5 h-3.5" />} onClick={() => toast.success(`${r.label} CSV downloaded!`)}>CSV</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-military-dark">Quick Summary</h3>
          <Badge color="green">As of today</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: MOCK_STUDENTS.length },
            { label: 'Active Projects', value: MOCK_PROJECTS.filter(p => p.status === 'active').length },
            { label: 'Avg Attendance', value: `${Math.round(MOCK_STUDENTS.reduce((s, st) => s + st.attendancePercentage, 0) / MOCK_STUDENTS.length)}%` },
            { label: 'Completed Projects', value: MOCK_PROJECTS.filter(p => p.status === 'completed').length },
          ].map(s => (
            <div key={s.label} className="bg-surface-subtle rounded-xl p-4 text-center">
              <p className="text-2xl font-extrabold text-military-dark">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function RepositoryPage() {
  const [search, setSearch] = useState('');
  const completed = MOCK_PROJECTS.filter(p => p.status === 'completed');
  const filtered = completed.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-military-dark">Historical Repository</h1>
        <p className="text-gray-500 text-sm mt-0.5">Archive of completed projects and records</p>
      </div>
      <div className="relative">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search archived projects…" className="w-full pl-10 pr-4 py-2.5 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20 bg-white" />
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(p => (
          <Card key={p.id} hover>
            <div className="flex items-start justify-between mb-3">
              <Badge color="blue">Completed</Badge>
              <span className="text-xs text-gray-400">{p.deadline}</span>
            </div>
            <h3 className="font-bold text-military-dark text-sm mb-1">{p.title}</h3>
            <p className="text-xs text-gray-500 mb-3">{p.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="bg-military-green/8 text-military-green px-2 py-1 rounded-lg font-semibold">{p.domain}</span>
              <span className="text-gray-400">{p.assignedTo.length} student{p.assignedTo.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-surface-border flex gap-2">
              <Button variant="outline" size="sm" leftIcon={<FiFileText className="w-3.5 h-3.5" />} onClick={() => toast.success('Report opened')}>View Report</Button>
              <Button variant="ghost" size="sm" leftIcon={<FiDownload className="w-3.5 h-3.5" />} onClick={() => toast.success('Downloaded!')}>Export</Button>
            </div>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📦</div>
          <p className="font-semibold text-gray-700">No archived projects found</p>
        </div>
      )}
    </div>
  );
}
