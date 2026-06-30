import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, Button, Avatar, Badge } from '@/components/ui';
import { FiEdit2, FiLock, FiBell, FiShield, FiSave, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

export function AdminProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', department: user?.department || '', phone: '+91 123 456 7890' });

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-military-dark">My Profile</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your personal information</p>
      </div>

      <Card>
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <Avatar name={user?.name || 'Admin'} size="xl" />
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-military-green text-white rounded-full flex items-center justify-center text-xs hover:bg-military-light transition-colors">
              <FiEdit2 className="w-3 h-3" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-military-dark">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge color="green">Administrator</Badge>
              <Badge color="blue">{user?.department}</Badge>
            </div>
          </div>
          <div className="ml-auto">
            <Button variant={editing ? 'primary' : 'outline'} leftIcon={editing ? <FiSave className="w-4 h-4" /> : <FiEdit2 className="w-4 h-4" />}
              onClick={() => { if (editing) toast.success('Profile saved!'); setEditing(!editing); }}>
              {editing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Full Name', key: 'name' as const },
            { label: 'Email Address', key: 'email' as const },
            { label: 'Department', key: 'department' as const },
            { label: 'Phone', key: 'phone' as const },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.label}</label>
              {editing ? (
                <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-3 py-2.5 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20 focus:border-military-green" />
              ) : (
                <div className="px-3 py-2.5 bg-surface-subtle rounded-xl text-sm font-medium text-gray-800">{form[f.key]}</div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-military-dark mb-4 flex items-center gap-2"><FiShield className="w-4 h-4 text-military-green" /> Activity Log</h3>
        <div className="space-y-3">
          {[
            { action: 'Marked attendance for 42 students', time: 'Today, 9:30 AM' },
            { action: 'Added new student: Arjun Sharma', time: 'Yesterday, 3:15 PM' },
            { action: 'Published announcement: New Batch Registration', time: '2 days ago' },
            { action: 'Generated attendance report', time: '3 days ago' },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-surface-border/50 last:border-0">
              <div className="w-2 h-2 rounded-full bg-military-green flex-shrink-0" />
              <p className="text-sm text-gray-700 flex-1">{log.action}</p>
              <span className="text-xs text-gray-400 flex-shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function AdminSettingsPage() {
  const [notifications, setNotifications] = useState({ email: true, attendance: true, projects: false, announcements: true });
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) { toast.error('Passwords do not match'); return; }
    if (newPass.length < 6) { toast.error('Password too short'); return; }
    toast.success('Password changed successfully!');
    setCurrentPass(''); setNewPass(''); setConfirmPass('');
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-military-dark">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your account preferences</p>
      </div>

      {/* Password */}
      <Card>
        <h3 className="font-bold text-military-dark mb-4 flex items-center gap-2"><FiLock className="w-4 h-4" /> Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Current Password</label>
            <input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} className="w-full px-4 py-3 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20" placeholder="Enter current password" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">New Password</label>
              <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full px-4 py-3 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20" placeholder="New password" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Confirm Password</label>
              <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full px-4 py-3 border border-surface-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20" placeholder="Confirm new password" />
            </div>
          </div>
          <Button type="submit" variant="primary" leftIcon={<FiSave className="w-4 h-4" />}>Update Password</Button>
        </form>
      </Card>

      {/* Notifications */}
      <Card>
        <h3 className="font-bold text-military-dark mb-4 flex items-center gap-2"><FiBell className="w-4 h-4" /> Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'email' as const, label: 'Email Notifications', desc: 'Receive updates via email' },
            { key: 'attendance' as const, label: 'Attendance Alerts', desc: 'Get notified about low attendance' },
            { key: 'projects' as const, label: 'Project Updates', desc: 'Updates on project deadlines' },
            { key: 'announcements' as const, label: 'Announcements', desc: 'New announcement notifications' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between py-2 border-b border-surface-border/50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-gray-800">{n.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
              </div>
              <button onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${notifications[n.key] ? 'bg-military-green' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${notifications[n.key] ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
        <Button variant="primary" className="mt-4" onClick={() => toast.success('Preferences saved!')} leftIcon={<FiSave className="w-4 h-4" />}>Save Preferences</Button>
      </Card>

      {/* Account */}
      <Card>
        <h3 className="font-bold text-military-dark mb-4 flex items-center gap-2"><FiUser className="w-4 h-4" /> Account Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-surface-subtle rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-800">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500">Add extra security to your account</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.success('2FA setup opened')}>Setup</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
            <div>
              <p className="text-sm font-semibold text-red-700">Delete Account</p>
              <p className="text-xs text-red-500">Permanently delete your account and all data</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => toast.error('This action is irreversible')}>Delete</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
