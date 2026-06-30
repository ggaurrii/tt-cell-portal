import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiDownload, FiUpload, FiFilter, FiEdit2, FiTrash2, FiEye, FiMoreVertical } from 'react-icons/fi';
import { Card, Badge, Avatar, Button, Modal, Input, Select, ProgressBar, EmptyState } from '@/components/ui';
import { MOCK_STUDENTS, DOMAINS } from '@/constants/mockData';
import { Student } from '@/types';
import toast from 'react-hot-toast';

const DOMAIN_OPTIONS = [{ value: '', label: 'All Domains' }, ...DOMAINS.map(d => ({ value: d, label: d }))];
const STATUS_OPTIONS = [{ value: '', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'completed', label: 'Completed' }];

function StudentModal({ student, onClose }: { student: Student | null; onClose: () => void }) {
  if (!student) return null;
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Avatar name={student.name} size="xl" />
        <div>
          <h3 className="text-lg font-bold text-military-dark">{student.name}</h3>
          <p className="text-gray-500 text-sm">{student.studentId}</p>
          <Badge color={student.status === 'active' ? 'green' : student.status === 'completed' ? 'blue' : 'red'} className="mt-1">{student.status}</Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        {[
          { l: 'Email', v: student.email }, { l: 'Phone', v: student.phone },
          { l: 'Domain', v: student.domain }, { l: 'Batch', v: student.batch || 'N/A' },
          { l: 'Enrolled', v: student.enrollmentDate }, { l: 'Projects', v: `${student.projectsCompleted}/${student.projectsAssigned}` },
        ].map(f => (
          <div key={f.l} className="bg-surface-subtle rounded-xl p-3">
            <p className="text-xs text-gray-500 font-medium">{f.l}</p>
            <p className="font-semibold text-gray-800 mt-0.5 text-sm">{f.v}</p>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Attendance</span>
          <span className={`text-sm font-bold ${student.attendancePercentage >= 75 ? 'text-green-600' : 'text-red-500'}`}>{student.attendancePercentage}%</span>
        </div>
        <ProgressBar value={student.attendancePercentage} color={student.attendancePercentage >= 75 ? 'green' : 'red'} />
      </div>
    </div>
  );
}

function AddStudentForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', domain: '', batch: '' });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.domain) { toast.error('Please fill required fields'); return; }
    toast.success('Student added successfully!');
    onClose();
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Input label="Full Name *" placeholder="Enter full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        <Input label="Email *" type="email" placeholder="student@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <Input label="Phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <Select label="Domain *" options={DOMAIN_OPTIONS.slice(1)} value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })} />
        <Input label="Batch" placeholder="Batch 2025-A" value={form.batch} onChange={e => setForm({ ...form, batch: e.target.value })} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1 justify-center">Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1 justify-center">Add Student</Button>
      </div>
    </form>
  );
}

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const PER_PAGE = 6;

  const filtered = useMemo(() => {
    return MOCK_STUDENTS.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
      const matchDomain = !domainFilter || s.domain === domainFilter;
      const matchStatus = !statusFilter || s.status === statusFilter;
      return matchSearch && matchDomain && matchStatus;
    });
  }, [search, domainFilter, statusFilter]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(s => s.id));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-military-dark">Student Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">{MOCK_STUDENTS.length} students enrolled</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<FiUpload className="w-4 h-4" />} size="sm">Import CSV</Button>
          <Button variant="outline" leftIcon={<FiDownload className="w-4 h-4" />} size="sm">Export</Button>
          <Button variant="primary" leftIcon={<FiPlus className="w-4 h-4" />} size="sm" onClick={() => setShowAdd(true)}>Add Student</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: MOCK_STUDENTS.length, color: 'text-military-dark', bg: 'bg-military-green/8' },
          { label: 'Active', value: MOCK_STUDENTS.filter(s => s.status === 'active').length, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Inactive', value: MOCK_STUDENTS.filter(s => s.status === 'inactive').length, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Completed', value: MOCK_STUDENTS.filter(s => s.status === 'completed').length, color: 'text-blue-700', bg: 'bg-blue-50' },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-4 border border-surface-border`}>
            <p className="text-xs text-gray-500 font-medium">{c.label} Students</p>
            <p className={`text-2xl font-extrabold ${c.color} mt-1`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, ID, email…" className="w-full pl-10 pr-4 py-2.5 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20 focus:border-military-green" />
          </div>
          <select value={domainFilter} onChange={e => { setDomainFilter(e.target.value); setPage(1); }} className="px-3 py-2.5 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20 min-w-[160px] bg-white">
            {DOMAIN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2.5 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20 min-w-[130px] bg-white">
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {(search || domainFilter || statusFilter) && (
            <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setDomainFilter(''); setStatusFilter(''); setPage(1); }}>Clear</Button>
          )}
        </div>
      </Card>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-military-green/8 border border-military-green/20 rounded-xl p-3 flex items-center gap-4">
          <span className="text-sm font-semibold text-military-green">{selected.length} selected</span>
          <Button variant="outline" size="sm" onClick={() => { toast.success('Exported selected students'); setSelected([]); }}>Export Selected</Button>
          <Button variant="danger" size="sm" onClick={() => { toast.success('Archived selected students'); setSelected([]); }}>Archive</Button>
          <button onClick={() => setSelected([])} className="ml-auto text-gray-500 hover:text-gray-700 text-sm">Deselect all</button>
        </motion.div>
      )}

      {/* Table */}
      <Card padding="none">
        {paginated.length === 0 ? (
          <EmptyState title="No students found" description="Try adjusting your search or filters to find what you're looking for." action={<Button variant="primary" onClick={() => { setSearch(''); setDomainFilter(''); setStatusFilter(''); }}>Clear Filters</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-surface-subtle/50">
                  <th className="py-3.5 px-4 text-left">
                    <input type="checkbox" checked={selected.length === paginated.length && paginated.length > 0} onChange={toggleAll} className="rounded accent-military-green" />
                  </th>
                  {['Student', 'ID / Batch', 'Domain', 'Attendance', 'Projects', 'Status', 'Actions'].map(h => (
                    <th key={h} className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((s, i) => (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-surface-border/50 hover:bg-surface-subtle/50 transition-colors group">
                    <td className="py-3.5 px-4"><input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleSelect(s.id)} className="rounded accent-military-green" /></td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name} size="md" />
                        <div>
                          <p className="font-semibold text-gray-800">{s.name}</p>
                          <p className="text-xs text-gray-500">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-gray-700">{s.studentId}</p>
                      <p className="text-xs text-gray-400">{s.batch}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-military-green/8 text-military-green">{s.domain}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <div className="flex-1 h-1.5 bg-surface-subtle rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.attendancePercentage >= 75 ? 'bg-military-green' : 'bg-red-500'}`} style={{ width: `${s.attendancePercentage}%` }} />
                        </div>
                        <span className={`text-xs font-bold ${s.attendancePercentage >= 75 ? 'text-green-700' : 'text-red-600'}`}>{s.attendancePercentage}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm font-medium text-gray-700">{s.projectsCompleted}/{s.projectsAssigned}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge color={s.status === 'active' ? 'green' : s.status === 'completed' ? 'blue' : 'red'}>{s.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setViewStudent(s)} className="p-1.5 rounded-lg hover:bg-military-green/10 text-military-green transition-colors" title="View"><FiEye className="w-4 h-4" /></button>
                        <button onClick={() => toast.success('Edit mode opened')} className="p-1.5 rounded-lg hover:bg-gold/10 text-gold-dark transition-colors" title="Edit"><FiEdit2 className="w-4 h-4" /></button>
                        <button onClick={() => toast.error('Student deleted')} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3.5 border-t border-surface-border">
            <p className="text-xs text-gray-500">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs font-medium border border-surface-border rounded-lg disabled:opacity-40 hover:bg-surface-subtle transition-colors">Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${p === page ? 'bg-military-green text-white' : 'border border-surface-border hover:bg-surface-subtle'}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-xs font-medium border border-surface-border rounded-lg disabled:opacity-40 hover:bg-surface-subtle transition-colors">Next</button>
            </div>
          </div>
        )}
      </Card>

      {/* Modals */}
      <Modal isOpen={!!viewStudent} onClose={() => setViewStudent(null)} title="Student Profile" size="md">
        <StudentModal student={viewStudent} onClose={() => setViewStudent(null)} />
      </Modal>
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Student" size="md">
        <AddStudentForm onClose={() => setShowAdd(false)} />
      </Modal>
    </div>
  );
}
