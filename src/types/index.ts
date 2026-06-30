export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  employeeId?: string;
  studentId?: string;
  department?: string;
  joinDate?: string;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  domain: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'completed';
  attendancePercentage: number;
  projectsAssigned: number;
  projectsCompleted: number;
  avatar?: string;
  batch?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  domain: string;
  status: 'active' | 'completed' | 'pending' | 'on-hold';
  assignedTo: string[];
  startDate: string;
  deadline: string;
  progress: number;
  priority: 'low' | 'medium' | 'high';
  supervisor?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  remarks?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'urgent' | 'event' | 'deadline';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  publishedAt: string;
  isPinned: boolean;
  isDraft: boolean;
  author: string;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalProjects: number;
  attendanceToday: number;
  completionRate: number;
  pendingReports: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
