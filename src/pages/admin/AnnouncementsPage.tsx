import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiBookmark, FiEdit2, FiTrash2, FiSend } from 'react-icons/fi';
import { Card, Badge, Button, Modal } from '@/components/ui';
import { MOCK_ANNOUNCEMENTS } from '@/constants/mockData';
import { Announcement } from '@/types';
import toast from 'react-hot-toast';

const priorityColor: Record<string, any> = {
  low: 'gray', medium: 'blue', high: 'gold', urgent: 'red'
};
const categoryIcon: Record<string, string> = {
  general: '📋', urgent: '🚨', event: '🎯', deadline: '⏰'
};

function AnnouncementCard({ ann, onEdit, onDelete }: { ann: Announcement; onEdit: () => void; onDelete: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-surface-border p-5 hover:shadow-card-hover transition-all duration-200 group">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-military-green/8 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
          {categoryIcon[ann.category]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              {ann.isPinned && <span className="flex items-center gap-1 text-xs font-semibold text-gold"><FiBookmark className="w-3 h-3" />Pinned</span>}
              {ann.isDraft && <Badge color="gray">Draft</Badge>}
              <Badge color={priorityColor[ann.priority]}>{ann.priority}</Badge>
              <Badge color="gray">{ann.category}</Badge>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-gold/10 text-gold-dark"><FiEdit2 className="w-3.5 h-3.5" /></button>
              <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><FiTrash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <h3 className="font-bold text-military-dark text-sm leading-snug mb-1">{ann.title}</h3>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{ann.content}</p>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
            <span>By {ann.author}</span>
            <span>{ann.publishedAt}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AnnouncementForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ title: '', content: '', category: 'general', priority: 'medium', isPinned: false });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) { toast.error('Fill all required fields'); return; }
    toast.success('Announcement published!');
    onClose();
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Title *</label>
        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Announcement title" className="w-full px-4 py-3 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20 focus:border-military-green" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 border border-surface-border rounded-xl text-sm focus:outline-none bg-white">
            <option value="general">General</option>
            <option value="event">Event</option>
            <option value="deadline">Deadline</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Priority</label>
          <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full px-4 py-3 border border-surface-border rounded-xl text-sm focus:outline-none bg-white">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">Content *</label>
        <textarea rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your announcement here..." className="w-full px-4 py-3 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20 focus:border-military-green resize-none" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.isPinned} onChange={e => setForm({ ...form, isPinned: e.target.checked })} className="rounded accent-military-green" />
        <span className="text-sm text-gray-700">Pin this announcement</span>
      </label>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1 justify-center">Save as Draft</Button>
        <Button type="submit" variant="primary" leftIcon={<FiSend className="w-4 h-4" />} className="flex-1 justify-center">Publish</Button>
      </div>
    </form>
  );
}

export default function AnnouncementsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);

  const filtered = announcements.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true : filter === 'pinned' ? a.isPinned : filter === 'draft' ? a.isDraft : a.category === filter;
    return matchSearch && matchFilter;
  });

  const pinned = filtered.filter(a => a.isPinned);
  const regular = filtered.filter(a => !a.isPinned);

  const handleDelete = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    toast.success('Announcement deleted');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-military-dark">Announcements</h1>
          <p className="text-gray-500 text-sm mt-0.5">{announcements.filter(a => !a.isDraft).length} active announcements</p>
        </div>
        <Button variant="primary" leftIcon={<FiPlus className="w-4 h-4" />} onClick={() => setShowAdd(true)}>New Announcement</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: announcements.length, bg: 'bg-military-green/8', color: 'text-military-green' },
          { label: 'Pinned', value: announcements.filter(a => a.isPinned).length, bg: 'bg-gold/8', color: 'text-gold-dark' },
          { label: 'Drafts', value: announcements.filter(a => a.isDraft).length, bg: 'bg-gray-100', color: 'text-gray-700' },
          { label: 'Urgent', value: announcements.filter(a => a.priority === 'urgent').length, bg: 'bg-red-50', color: 'text-red-600' },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-4 border border-surface-border`}>
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className={`text-2xl font-extrabold ${c.color} mt-1`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search announcements…" className="w-full pl-10 pr-4 py-2.5 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {[{ v: 'all', l: 'All' }, { v: 'pinned', l: '📌 Pinned' }, { v: 'draft', l: 'Drafts' }, { v: 'event', l: 'Events' }, { v: 'deadline', l: 'Deadlines' }].map(f => (
              <button key={f.v} onClick={() => setFilter(f.v)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === f.v ? 'bg-military-green text-white' : 'border border-surface-border text-gray-600 hover:bg-surface-subtle'}`}>{f.l}</button>
            ))}
          </div>
        </div>
      </Card>

      {/* Pinned */}
      {pinned.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2"><FiBookmark className="w-4 h-4 text-gold" /> Pinned Announcements</h3>
          <div className="space-y-3">
            {pinned.map(a => <AnnouncementCard key={a.id} ann={a} onEdit={() => toast.success('Edit mode')} onDelete={() => handleDelete(a.id)} />)}
          </div>
        </div>
      )}

      {/* Regular */}
      {regular.length > 0 && (
        <div>
          {pinned.length > 0 && <h3 className="text-sm font-bold text-gray-600 mb-3">All Announcements</h3>}
          <div className="space-y-3">
            {regular.map(a => <AnnouncementCard key={a.id} ann={a} onEdit={() => toast.success('Edit mode')} onDelete={() => handleDelete(a.id)} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-600 font-semibold">No announcements found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Create Announcement" size="lg">
        <AnnouncementForm onClose={() => setShowAdd(false)} />
      </Modal>
    </div>
  );
}
