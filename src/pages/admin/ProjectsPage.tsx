import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiGrid, FiList, FiSearch, FiCalendar, FiUser, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Card, Badge, Button, Modal, Input, Select, ProgressBar } from '@/components/ui';
import { MOCK_PROJECTS, DOMAINS } from '@/constants/mockData';
import { Project } from '@/types';
import toast from 'react-hot-toast';

type ViewMode = 'grid' | 'table' | 'kanban';

const statusColor: Record<string, any> = {
  active: 'green', completed: 'blue', pending: 'gold', 'on-hold': 'gray'
};
const priorityColor: Record<string, any> = {
  high: 'red', medium: 'gold', low: 'gray'
};

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const daysLeft = Math.ceil((new Date(project.deadline).getTime() - Date.now()) / 86400000);
  return (
    <motion.div whileHover={{ y: -2 }} className="card p-5 cursor-pointer hover:shadow-card-hover transition-all duration-300" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <Badge color={statusColor[project.status]}>{project.status}</Badge>
        <Badge color={priorityColor[project.priority]}>{project.priority}</Badge>
      </div>
      <h3 className="font-bold text-military-dark text-sm leading-snug mb-1">{project.title}</h3>
      <p className="text-xs text-gray-500 line-clamp-2 mb-4">{project.description}</p>
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="font-semibold text-military-green">{project.progress}%</span>
        </div>
        <ProgressBar value={project.progress} color={project.progress === 100 ? 'green' : project.progress >= 50 ? 'green' : 'gold'} showLabel={false} />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1"><FiUser className="w-3 h-3" /> {project.assignedTo.length} student{project.assignedTo.length !== 1 ? 's' : ''}</span>
        <span className="flex items-center gap-1">
          <FiCalendar className="w-3 h-3" />
          {project.status === 'completed' ? 'Completed' : daysLeft > 0 ? `${daysLeft}d left` : <span className="text-red-500">Overdue</span>}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t border-surface-border">
        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-military-green/8 text-military-green">{project.domain}</span>
      </div>
    </motion.div>
  );
}

function KanbanColumn({ title, projects, color, onClick }: { title: string; projects: Project[]; color: string; onClick: (p: Project) => void }) {
  return (
    <div className="flex-1 min-w-[240px]">
      <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-xl ${color}`}>
        <span className="text-sm font-bold">{title}</span>
        <span className="ml-auto text-xs font-bold bg-white/60 px-1.5 py-0.5 rounded-md">{projects.length}</span>
      </div>
      <div className="space-y-3">
        {projects.map(p => (
          <div key={p.id} onClick={() => onClick(p)} className="bg-white rounded-xl border border-surface-border p-3 cursor-pointer hover:shadow-sm hover:border-military-green/30 transition-all">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-xs font-bold text-gray-800 leading-snug flex-1">{p.title}</h4>
              <Badge color={priorityColor[p.priority]} className="ml-2 flex-shrink-0">{p.priority}</Badge>
            </div>
            <ProgressBar value={p.progress} showLabel={false} />
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>{p.domain}</span>
              <span>{p.progress}%</span>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="border-2 border-dashed border-surface-border rounded-xl p-6 text-center">
            <p className="text-xs text-gray-400">No projects</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectDetailModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const daysLeft = Math.ceil((new Date(project.deadline).getTime() - Date.now()) / 86400000);
  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <Badge color={statusColor[project.status]}>{project.status}</Badge>
        <Badge color={priorityColor[project.priority]}>{project.priority} priority</Badge>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { l: 'Domain', v: project.domain },
          { l: 'Supervisor', v: project.supervisor || 'Not Assigned' },
          { l: 'Start Date', v: project.startDate },
          { l: 'Deadline', v: project.deadline },
          { l: 'Students', v: `${project.assignedTo.length} assigned` },
          { l: 'Days Left', v: project.status === 'completed' ? 'Completed' : daysLeft > 0 ? `${daysLeft} days` : 'Overdue' },
        ].map(f => (
          <div key={f.l} className="bg-surface-subtle rounded-xl p-3">
            <p className="text-xs text-gray-500">{f.l}</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{f.v}</p>
          </div>
        ))}
      </div>
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-gray-700">Overall Progress</span>
          <span className="font-bold text-military-green">{project.progress}%</span>
        </div>
        <ProgressBar value={project.progress} color={project.progress === 100 ? 'green' : 'green'} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" leftIcon={<FiEdit2 className="w-4 h-4" />} onClick={() => { toast.success('Edit mode'); onClose(); }} className="flex-1 justify-center">Edit Project</Button>
        <Button variant="danger" leftIcon={<FiTrash2 className="w-4 h-4" />} onClick={() => { toast.error('Project deleted'); onClose(); }} className="flex-1 justify-center">Delete</Button>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = MOCK_PROJECTS.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchDomain = !domainFilter || p.domain === domainFilter;
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchDomain && matchStatus;
  });

  const kanbanGroups = {
    pending: filtered.filter(p => p.status === 'pending'),
    active: filtered.filter(p => p.status === 'active'),
    'on-hold': filtered.filter(p => p.status === 'on-hold'),
    completed: filtered.filter(p => p.status === 'completed'),
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-military-dark">Project Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">{MOCK_PROJECTS.length} total projects</p>
        </div>
        <Button variant="primary" leftIcon={<FiPlus className="w-4 h-4" />} onClick={() => setShowAdd(true)}>New Project</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active', value: MOCK_PROJECTS.filter(p => p.status === 'active').length, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Pending', value: MOCK_PROJECTS.filter(p => p.status === 'pending').length, color: 'text-yellow-700', bg: 'bg-yellow-50' },
          { label: 'On Hold', value: MOCK_PROJECTS.filter(p => p.status === 'on-hold').length, color: 'text-gray-700', bg: 'bg-gray-100' },
          { label: 'Completed', value: MOCK_PROJECTS.filter(p => p.status === 'completed').length, color: 'text-blue-700', bg: 'bg-blue-50' },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-4 border border-surface-border`}>
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className={`text-2xl font-extrabold ${c.color} mt-1`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Filters + View Toggle */}
      <Card padding="sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects…" className="w-full pl-10 pr-4 py-2.5 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20" />
          </div>
          <select value={domainFilter} onChange={e => setDomainFilter(e.target.value)} className="px-3 py-2.5 border border-surface-border rounded-xl text-sm focus:outline-none min-w-[150px] bg-white">
            <option value="">All Domains</option>
            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 border border-surface-border rounded-xl text-sm focus:outline-none min-w-[130px] bg-white">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
          <div className="flex border border-surface-border rounded-xl overflow-hidden">
            {[{ mode: 'grid' as ViewMode, icon: <FiGrid /> }, { mode: 'table' as ViewMode, icon: <FiList /> }].map(v => (
              <button key={v.mode} onClick={() => setViewMode(v.mode)} className={`px-3 py-2 text-sm transition-colors ${viewMode === v.mode ? 'bg-military-green text-white' : 'hover:bg-surface-subtle text-gray-600'}`}>{v.icon}</button>
            ))}
            <button onClick={() => setViewMode('kanban')} className={`px-3 py-2 text-xs font-medium transition-colors ${viewMode === 'kanban' ? 'bg-military-green text-white' : 'hover:bg-surface-subtle text-gray-600'}`}>Kanban</button>
          </div>
        </div>
      </Card>

      {/* Views */}
      {viewMode === 'grid' && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(p => <ProjectCard key={p.id} project={p} onClick={() => setSelectedProject(p)} />)}
        </div>
      )}

      {viewMode === 'table' && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-surface-subtle/50">
                  {['Project', 'Domain', 'Status', 'Priority', 'Progress', 'Deadline', 'Actions'].map(h => (
                    <th key={h} className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-surface-border/50 hover:bg-surface-subtle/50 transition-colors group">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-gray-800">{p.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.supervisor}</p>
                    </td>
                    <td className="py-3.5 px-4"><span className="text-xs bg-military-green/8 text-military-green px-2 py-1 rounded-lg font-semibold">{p.domain}</span></td>
                    <td className="py-3.5 px-4"><Badge color={statusColor[p.status]}>{p.status}</Badge></td>
                    <td className="py-3.5 px-4"><Badge color={priorityColor[p.priority]}>{p.priority}</Badge></td>
                    <td className="py-3.5 px-4 min-w-[120px]"><ProgressBar value={p.progress} /></td>
                    <td className="py-3.5 px-4 text-xs text-gray-600">{p.deadline}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelectedProject(p)} className="p-1.5 rounded-lg hover:bg-military-green/10 text-military-green"><FiEdit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => toast.error('Deleted')} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><FiTrash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          <KanbanColumn title="Pending" projects={kanbanGroups.pending} color="bg-yellow-50 text-yellow-800" onClick={setSelectedProject} />
          <KanbanColumn title="Active" projects={kanbanGroups.active} color="bg-green-50 text-green-800" onClick={setSelectedProject} />
          <KanbanColumn title="On Hold" projects={kanbanGroups['on-hold']} color="bg-gray-100 text-gray-700" onClick={setSelectedProject} />
          <KanbanColumn title="Completed" projects={kanbanGroups.completed} color="bg-blue-50 text-blue-800" onClick={setSelectedProject} />
        </div>
      )}

      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title={selectedProject?.title || ''} size="lg">
        {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </Modal>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Create New Project" size="lg">
        <div className="space-y-4">
          <Input label="Project Title *" placeholder="Enter project title" />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Domain *" options={[{ value: '', label: 'Select domain' }, ...DOMAINS.map(d => ({ value: d, label: d }))]} />
            <Select label="Priority" options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} />
            <Input label="Start Date" type="date" />
            <Input label="Deadline *" type="date" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
            <textarea rows={3} placeholder="Project description…" className="w-full px-4 py-3 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20 focus:border-military-green resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowAdd(false)} className="flex-1 justify-center">Cancel</Button>
            <Button variant="primary" onClick={() => { toast.success('Project created!'); setShowAdd(false); }} className="flex-1 justify-center">Create Project</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
